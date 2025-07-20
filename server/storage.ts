import { 
  users, type User, type InsertUser, type UpdateProfile,
  customers, type Customer, type InsertCustomer,
  serviceProviders, type ServiceProvider, type InsertServiceProvider
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for customer storage operations
export interface ICustomerStorage {
  // Customer operations
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByUsername(username: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined>;
  
  // Authentication
  authenticateCustomer(emailOrUsername: string, password: string): Promise<Customer | undefined>;
  getCustomerBySocialId(provider: string, socialId: string): Promise<Customer | undefined>;
  createOrUpdateSocialCustomer(provider: string, userData: any): Promise<Customer>;
}

// Interface for service provider storage operations
export interface IServiceProviderStorage {
  // Service provider operations
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderByUsername(username: string): Promise<ServiceProvider | undefined>;
  getServiceProviderByEmail(email: string): Promise<ServiceProvider | undefined>;
  getAllServiceProviders(): Promise<ServiceProvider[]>;
  createServiceProvider(serviceProvider: InsertServiceProvider): Promise<ServiceProvider>;
  updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider | undefined>;
  
  // Authentication
  authenticateServiceProvider(emailOrUsername: string, password: string): Promise<ServiceProvider | undefined>;
  getServiceProviderBySocialId(provider: string, socialId: string): Promise<ServiceProvider | undefined>;
  createOrUpdateSocialServiceProvider(provider: string, userData: any): Promise<ServiceProvider>;
}

// Legacy interface for backward compatibility
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateProfile(username: string, profile: UpdateProfile): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Authentication
  authenticateUser(emailOrUsername: string, password: string): Promise<User | undefined>;
  getUserBySocialId(provider: string, socialId: string): Promise<User | undefined>;
  createOrUpdateSocialUser(provider: string, userData: any): Promise<User>;
  
  // Admin dashboard stats
  getAdminDashboardStats(): Promise<any>;
  
  // Service request management (for backward compatibility)
  createServiceRequest(request: any): Promise<any>;
  getAllTechnicians(): Promise<any>;
  
  // FAQ management
  getFAQs(type?: string): Promise<any[]>;
  createFAQ(faq: any): Promise<any>;
  updateFAQ(id: number, updates: any): Promise<any>;
  deleteFAQ(id: number): Promise<void>;
  
  // Diagnostic tools management
  getDiagnosticTools(): Promise<any[]>;
  getDiagnosticAnalytics(): Promise<any>;
  createDiagnosticTool(tool: any): Promise<any>;
  updateDiagnosticTool(id: number, updates: any): Promise<any>;
  deleteDiagnosticTool(id: number): Promise<void>;

  // Phone Support Logs operations
  getPhoneSupportLogs(filters?: {
    searchTerm?: string;
    callType?: string;
    status?: string;
    priority?: string;
    dateRange?: string;
  }): Promise<{
    logs: any[];
    stats: {
      total: number;
      active: number;
      completed: number;
      avgDuration: number;
      customerCalls: number;
      providerCalls: number;
      adminCalls: number;
    };
  }>;
  getPhoneSupportLogById(id: string): Promise<any | undefined>;
  createPhoneSupportLog(logData: any): Promise<any>;
  updatePhoneSupportLog(id: string, updates: any): Promise<any | undefined>;
}

// Customer storage implementation
export class CustomerStorage implements ICustomerStorage {
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getCustomerByUsername(username: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.username, username));
    return customer || undefined;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    if (!email) return undefined;
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer || undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values(insertCustomer)
      .returning();
    return customer;
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined> {
    const [customer] = await db
      .update(customers)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();
    
    return customer || undefined;
  }

  async authenticateCustomer(emailOrUsername: string, password: string): Promise<Customer | undefined> {
    const bcrypt = await import('bcryptjs');
    
    // Find customer by email or username
    let customer: Customer | undefined;
    
    // Try to find by email first
    if (emailOrUsername.includes('@')) {
      customer = await this.getCustomerByEmail(emailOrUsername);
    } else {
      customer = await this.getCustomerByUsername(emailOrUsername);
    }
    
    // If not found by email, try username
    if (!customer && emailOrUsername.includes('@')) {
      customer = await this.getCustomerByUsername(emailOrUsername);
    }
    
    if (!customer || !customer.password) {
      return undefined;
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      return undefined;
    }
    
    // Update last login
    await this.updateCustomer(customer.id, { 
      lastLoginMethod: 'email',
      updatedAt: new Date()
    });
    
    return customer;
  }

  async getCustomerBySocialId(provider: string, socialId: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.socialProviders, { [provider]: { id: socialId } }));
    return customer || undefined;
  }

  async createOrUpdateSocialCustomer(provider: string, userData: any): Promise<Customer> {
    // Implementation for social login
    const [customer] = await db
      .insert(customers)
      .values({
        username: userData.username || `${provider}_${userData.id}`,
        email: userData.email,
        fullName: userData.name,
        avatar: userData.avatar,
        socialProviders: { [provider]: userData },
        authMethod: provider,
        lastLoginMethod: provider,
      })
      .returning();
    return customer;
  }
}

// Service Provider storage implementation
export class ServiceProviderStorage implements IServiceProviderStorage {
  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    const [serviceProvider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
    return serviceProvider || undefined;
  }

  async getServiceProviderByUsername(username: string): Promise<ServiceProvider | undefined> {
    const [serviceProvider] = await db.select().from(serviceProviders).where(eq(serviceProviders.username, username));
    return serviceProvider || undefined;
  }

  async getServiceProviderByEmail(email: string): Promise<ServiceProvider | undefined> {
    if (!email) return undefined;
    const [serviceProvider] = await db.select().from(serviceProviders).where(eq(serviceProviders.email, email));
    return serviceProvider || undefined;
  }

  async getAllServiceProviders(): Promise<ServiceProvider[]> {
    const allServiceProviders = await db.select().from(serviceProviders);
    return allServiceProviders;
  }

  async createServiceProvider(insertServiceProvider: InsertServiceProvider): Promise<ServiceProvider> {
    const [serviceProvider] = await db
      .insert(serviceProviders)
      .values(insertServiceProvider)
      .returning();
    return serviceProvider;
  }

  async updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider | undefined> {
    const [serviceProvider] = await db
      .update(serviceProviders)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(serviceProviders.id, id))
      .returning();
    
    return serviceProvider || undefined;
  }

  async authenticateServiceProvider(emailOrUsername: string, password: string): Promise<ServiceProvider | undefined> {
    const bcrypt = await import('bcryptjs');
    
    // Find service provider by email or username
    let serviceProvider: ServiceProvider | undefined;
    
    // Try to find by email first
    if (emailOrUsername.includes('@')) {
      serviceProvider = await this.getServiceProviderByEmail(emailOrUsername);
    } else {
      serviceProvider = await this.getServiceProviderByUsername(emailOrUsername);
    }
    
    // If not found by email, try username
    if (!serviceProvider && emailOrUsername.includes('@')) {
      serviceProvider = await this.getServiceProviderByUsername(emailOrUsername);
    }
    
    if (!serviceProvider || !serviceProvider.password) {
      return undefined;
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, serviceProvider.password);
    if (!isValid) {
      return undefined;
    }
    
    // Update last login
    await this.updateServiceProvider(serviceProvider.id, { 
      lastLoginMethod: 'email',
      updatedAt: new Date()
    });
    
    return serviceProvider;
  }

  async getServiceProviderBySocialId(provider: string, socialId: string): Promise<ServiceProvider | undefined> {
    const [serviceProvider] = await db.select().from(serviceProviders).where(eq(serviceProviders.socialProviders, { [provider]: { id: socialId } }));
    return serviceProvider || undefined;
  }

  async createOrUpdateSocialServiceProvider(provider: string, userData: any): Promise<ServiceProvider> {
    // Implementation for social login
    const [serviceProvider] = await db
      .insert(serviceProviders)
      .values({
        username: userData.username || `${provider}_${userData.id}`,
        email: userData.email,
        fullName: userData.name,
        avatar: userData.avatar,
        socialProviders: { [provider]: userData },
        authMethod: provider,
        lastLoginMethod: provider,
      })
      .returning();
    return serviceProvider;
  }
}

// Legacy storage implementation for backward compatibility
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateProfile(username: string, profile: UpdateProfile): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...profile,
        updatedAt: new Date(),
      })
      .where(eq(users.username, username))
      .returning();
    
    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }
    
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    
    return user || undefined;
  }

  // Authentication methods
  async authenticateUser(emailOrUsername: string, password: string): Promise<User | undefined> {
    const bcrypt = await import('bcryptjs');
    
    // Find user by email or username
    let user: User | undefined;
    
    // Try to find by email first
    if (emailOrUsername.includes('@')) {
      user = await this.getUserByEmail(emailOrUsername);
    } else {
      user = await this.getUserByUsername(emailOrUsername);
    }
    
    // If not found by email, try username
    if (!user && emailOrUsername.includes('@')) {
      user = await this.getUserByUsername(emailOrUsername);
    }
    
    if (!user || !user.password) {
      return undefined;
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return undefined;
    }
    
    // Update last login
    await this.updateUser(user.id, {
      lastLogin: new Date(),
      lastLoginMethod: "email"
    });
    
    return user;
  }

  async getUserBySocialId(provider: string, socialId: string): Promise<User | undefined> {
    const allUsers = await db.select().from(users);
    
    for (const user of allUsers) {
      if (user.socialProviders && user.socialProviders[provider]?.id === socialId) {
        return user;
      }
    }
    
    return undefined;
  }

  async createOrUpdateSocialUser(provider: string, userData: any): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUserBySocialId(provider, userData.id);
    if (existingUser) {
      // Update existing user
      const updatedUser = await this.updateUser(existingUser.id, {
        lastLogin: new Date(),
        lastLoginMethod: provider
      });
      return updatedUser!;
    }
    
    // Create new user
    const username = this.generateUniqueUsername(userData.username || userData.name || `user_${provider}_${userData.id.slice(0, 8)}`);
    
    const newUser = await this.createUser({
      username,
      password: null, // No password for social users
      email: userData.email || null,
      fullName: userData.name || null,
      bio: null,
      avatar: userData.avatar || null,
      userType: "customer",
      socialProviders: {
        [provider]: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar
        }
      },
      authMethod: provider,
      lastLoginMethod: provider,
      phone: null,
      street: null,
      apartment: null,
      city: null,
      state: null,
      zipCode: null,
      country: "Canada",
      emailVerified: true, // Assume verified via social provider
      phoneVerified: false,
      identityVerified: false,
      accountActive: true,
      businessInfo: null,
      paymentMethod: null,
      paymentMethods: [],
      paymentMethodSetup: false,
      paymentDetails: null,
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      twoFactorEnabled: false,
      twoFactorMethod: null,
      timezone: "America/Toronto",
      language: "en",
      newsletter: true,
      lastLogin: new Date(),
      isActive: true,
      preferences: null,
      metadata: null
    });
    
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers;
  }

  async getAdminDashboardStats(): Promise<any> {
    const totalUsers = await db.select().from(users);
    const allCustomers = await db.select().from(customers);
    const allServiceProviders = await db.select().from(serviceProviders);
    
    return {
      totalUsers: totalUsers.length,
      totalCustomers: allCustomers.length,
      totalServiceProviders: allServiceProviders.length,
      activeJobs: 28, // Mock data - would come from jobs table
      completedJobs: 1593, // Mock data
      totalRevenue: 147382, // Mock data
      pendingDisputes: 3, // Mock data
      responseTime: "2.3 min", // Mock data
      systemUptime: "99.9%" // Mock data
    };
  }

  // Service request management for backward compatibility
  async createServiceRequest(request: any): Promise<any> {
    // For now, return a mock service request since we don't have the table yet
    return {
      id: Math.floor(Math.random() * 10000),
      ...request,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getAllTechnicians(): Promise<any[]> {
    // For now, return service providers as technicians for backward compatibility
    const serviceProviders = await db.select().from(serviceProviders);
    return serviceProviders.map(sp => ({
      ...sp,
      // Map service provider fields to technician fields
      technicianId: sp.id,
      skills: sp.categories || [],
      isAvailable: sp.isActive || false
    }));
  }

  // FAQ management methods
  async getFAQs(type?: string): Promise<any[]> {
    // Mock FAQ data for now - in a real implementation, this would come from a database table
    const mockFAQs = [
      {
        id: 1,
        question: "How do I request technical support?",
        answer: "You can request technical support by clicking on the 'AI Support' button and describing your issue. Our AI will help diagnose your problem and connect you with the appropriate service provider if needed.",
        category: "General",
        type: "general",
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        question: "What types of technical issues can you help with?",
        answer: "We provide support for hardware issues, software troubleshooting, network problems, web development, database management, mobile device support, cybersecurity, and system administration.",
        category: "Services",
        type: "general",
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        question: "How do I become a service provider?",
        answer: "To become a service provider, complete our application process through the Service Provider portal. You'll need to provide your technical credentials, pass our verification requirements, and complete the onboarding process.",
        category: "Registration",
        type: "service-provider",
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        question: "What are the earning opportunities?",
        answer: "Service providers earn 85% of service fees with additional performance bonuses. Earnings vary based on service type (remote: $60-120/hr, phone: $50-100/hr, onsite: $80-150/hr) and your expertise level.",
        category: "Earnings",
        type: "service-provider",
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        question: "How do payments work?",
        answer: "Payments are processed weekly via direct deposit, PayPal, or your preferred payment method. Platform fees (15%) are automatically deducted, and you receive detailed earnings statements.",
        category: "Payments",
        type: "service-provider",
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    if (type) {
      return mockFAQs.filter(faq => faq.type === type);
    }
    return mockFAQs;
  }

  async createFAQ(faq: any): Promise<any> {
    // Mock implementation - in a real app, this would insert into database
    const newFAQ = {
      id: Math.floor(Math.random() * 10000),
      ...faq,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      order: 1
    };
    return newFAQ;
  }

  async updateFAQ(id: number, updates: any): Promise<any> {
    // Mock implementation - in a real app, this would update the database record
    const existingFAQs = await this.getFAQs();
    const faq = existingFAQs.find(f => f.id === id);
    if (!faq) {
      throw new Error('FAQ not found');
    }
    
    return {
      ...faq,
      ...updates,
      updatedAt: new Date()
    };
  }

  async deleteFAQ(id: number): Promise<void> {
    // Mock implementation - in a real app, this would delete from database
    const existingFAQs = await this.getFAQs();
    const faq = existingFAQs.find(f => f.id === id);
    if (!faq) {
      throw new Error('FAQ not found');
    }
    // Mock deletion - would actually remove from database
  }

  // Diagnostic tools management methods
  async getDiagnosticTools(): Promise<any[]> {
    // Mock diagnostic tools data - in a real implementation, this would come from a database table
    const mockTools = [
      {
        id: 1,
        name: "Network Connectivity Test",
        description: "Tests network connectivity and identifies connection issues including DNS resolution, ping tests, and port accessibility",
        category: "Connectivity",
        type: "network",
        script: `// Network Connectivity Test
function runNetworkTest() {
  const results = {
    dns: testDNSResolution(),
    ping: testPingConnectivity(),
    ports: testCommonPorts(),
    speed: measureConnectionSpeed()
  };
  return generateNetworkReport(results);
}`,
        parameters: ["target_host", "timeout_seconds"],
        isActive: true,
        estimatedDuration: 45,
        successRate: 96.8,
        usageCount: 1247,
        lastUsed: "2025-01-20T10:30:00Z",
        createdAt: new Date("2024-12-15"),
        updatedAt: new Date("2025-01-18")
      },
      {
        id: 2,
        name: "System Performance Check",
        description: "Analyzes CPU usage, memory consumption, disk space, and running processes to identify performance bottlenecks",
        category: "Performance",
        type: "system",
        script: `// System Performance Check
function runPerformanceCheck() {
  const metrics = {
    cpu: getCPUUsage(),
    memory: getMemoryStats(),
    disk: getDiskSpace(),
    processes: getTopProcesses()
  };
  return analyzePerformanceMetrics(metrics);
}`,
        parameters: ["duration_minutes", "include_processes"],
        isActive: true,
        estimatedDuration: 60,
        successRate: 94.2,
        usageCount: 892,
        lastUsed: "2025-01-20T09:15:00Z",
        createdAt: new Date("2024-11-20"),
        updatedAt: new Date("2025-01-19")
      },
      {
        id: 3,
        name: "Browser Compatibility Test",
        description: "Tests browser functionality including JavaScript execution, CSS support, cookies, local storage, and plugin compatibility",
        category: "Compatibility",
        type: "browser",
        script: `// Browser Compatibility Test
function runBrowserTest() {
  const compatibility = {
    javascript: testJavaScriptSupport(),
    css: testCSSFeatures(),
    storage: testStorageAPIs(),
    plugins: testPluginSupport()
  };
  return generateBrowserReport(compatibility);
}`,
        parameters: ["test_features", "browser_version"],
        isActive: true,
        estimatedDuration: 30,
        successRate: 98.1,
        usageCount: 567,
        lastUsed: "2025-01-19T16:45:00Z",
        createdAt: new Date("2024-10-05"),
        updatedAt: new Date("2025-01-15")
      },
      {
        id: 4,
        name: "Hardware Diagnostic Scan",
        description: "Comprehensive hardware health check including temperature monitoring, hard drive health, RAM testing, and component status",
        category: "Hardware",
        type: "hardware",
        script: `// Hardware Diagnostic Scan
function runHardwareScan() {
  const hardware = {
    temperature: checkSystemTemperature(),
    storage: testStorageHealth(),
    memory: runMemoryTest(),
    components: checkComponentStatus()
  };
  return generateHardwareReport(hardware);
}`,
        parameters: ["deep_scan", "component_filter"],
        isActive: true,
        estimatedDuration: 120,
        successRate: 91.5,
        usageCount: 423,
        lastUsed: "2025-01-19T14:20:00Z",
        createdAt: new Date("2025-01-05"),
        updatedAt: new Date("2025-01-18")
      },
      {
        id: 5,
        name: "Security Vulnerability Scan",
        description: "Scans for common security vulnerabilities, open ports, outdated software, and potential malware indicators",
        category: "Security",
        type: "security",
        script: `// Security Vulnerability Scan
function runSecurityScan() {
  const security = {
    ports: scanOpenPorts(),
    software: checkOutdatedSoftware(),
    malware: runMalwareCheck(),
    firewall: checkFirewallStatus()
  };
  return generateSecurityReport(security);
}`,
        parameters: ["scan_depth", "include_malware_scan"],
        isActive: true,
        estimatedDuration: 90,
        successRate: 89.3,
        usageCount: 334,
        lastUsed: "2025-01-20T08:00:00Z",
        createdAt: new Date("2024-12-01"),
        updatedAt: new Date("2025-01-17")
      },
      {
        id: 6,
        name: "Database Connection Test",
        description: "Tests database connectivity, query performance, and checks for common database issues including connection pooling and query optimization",
        category: "Database",
        type: "database",
        script: `// Database Connection Test
function runDatabaseTest() {
  const dbTest = {
    connection: testDBConnection(),
    performance: measureQueryPerformance(),
    health: checkDatabaseHealth(),
    optimization: analyzeQueryOptimization()
  };
  return generateDatabaseReport(dbTest);
}`,
        parameters: ["connection_string", "test_queries"],
        isActive: false,
        estimatedDuration: 40,
        successRate: 95.7,
        usageCount: 201,
        lastUsed: "2025-01-18T12:30:00Z",
        createdAt: new Date("2024-11-10"),
        updatedAt: new Date("2025-01-16")
      }
    ];

    return mockTools;
  }

  async getDiagnosticAnalytics(): Promise<any> {
    // Mock analytics data
    return {
      totalUsage: 3664,
      averageSuccessRate: 94.2,
      mostUsedTool: "Network Connectivity Test",
      toolsCreatedThisMonth: 3,
      activeTools: 5,
      totalTools: 6,
      averageDuration: 64,
      popularCategories: [
        { name: "Connectivity", usage: 1247, percentage: 34 },
        { name: "Performance", usage: 892, percentage: 24 },
        { name: "Compatibility", usage: 567, percentage: 15 },
        { name: "Hardware", usage: 423, percentage: 12 },
        { name: "Security", usage: 334, percentage: 9 },
        { name: "Database", usage: 201, percentage: 6 }
      ]
    };
  }

  async createDiagnosticTool(tool: any): Promise<any> {
    // Mock implementation - in a real app, this would insert into database
    const newTool = {
      id: Math.floor(Math.random() * 10000),
      ...tool,
      createdAt: new Date(),
      updatedAt: new Date(),
      successRate: 0,
      usageCount: 0,
      parameters: tool.parameters || []
    };
    return newTool;
  }

  async updateDiagnosticTool(id: number, updates: any): Promise<any> {
    // Mock implementation - in a real app, this would update the database record
    const existingTools = await this.getDiagnosticTools();
    const tool = existingTools.find(t => t.id === id);
    if (!tool) {
      throw new Error('Diagnostic tool not found');
    }
    
    return {
      ...tool,
      ...updates,
      updatedAt: new Date()
    };
  }

  async deleteDiagnosticTool(id: number): Promise<void> {
    // Mock implementation - in a real app, this would delete from database
    const existingTools = await this.getDiagnosticTools();
    const tool = existingTools.find(t => t.id === id);
    if (!tool) {
      throw new Error('Diagnostic tool not found');
    }
    // Mock deletion - would actually remove from database
  }

  private generateUniqueUsername(baseUsername: string): string {
    // Remove special characters and spaces
    let username = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Ensure minimum length
    if (username.length < 3) {
      username = username + Math.random().toString(36).substring(2, 8);
    }
    
    // Add random suffix to ensure uniqueness
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${username}_${suffix}`;
  }
}

// Create storage instances
export const customerStorage = new CustomerStorage();
export const serviceProviderStorage = new ServiceProviderStorage();
export const storage = new DatabaseStorage(); // Legacy storage for backward compatibility