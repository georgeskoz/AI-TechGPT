import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import { 
  type User, type InsertUser, type UpdateProfile,
  type Customer, type InsertCustomer,
  type ServiceProvider, type InsertServiceProvider,
  type Technician, type InsertTechnician
} from "@shared/schema";

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const SERVICE_PROVIDERS_FILE = path.join(DATA_DIR, 'service_providers.json');

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
  
  // Password reset tokens
  createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void>;
  getPasswordResetToken(token: string): Promise<{userId: number, expiresAt: Date, used: boolean} | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<void>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;
  
  // Dashboard data methods
  getServiceRequestsByCustomer(customerId: number): Promise<any[]>;
  getJobsByCustomer(customerId: number): Promise<any[]>;
  getServiceBookingsByCustomer(customerId: number): Promise<any[]>;
}

// Interface for service provider storage operations
export interface IServiceProviderStorage {
  // Service provider operations
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderByUsername(username: string): Promise<ServiceProvider | undefined>;
  getServiceProviderByEmail(email: string): Promise<ServiceProvider | undefined>;
  createServiceProvider(serviceProvider: InsertServiceProvider): Promise<ServiceProvider>;
  updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider | undefined>;
  
  // Authentication
  authenticateServiceProvider(emailOrUsername: string, password: string): Promise<ServiceProvider | undefined>;
  getServiceProviderBySocialId(provider: string, socialId: string): Promise<ServiceProvider | undefined>;
  createOrUpdateSocialServiceProvider(provider: string, userData: any): Promise<ServiceProvider>;
  
  // Password reset tokens
  createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void>;
  getPasswordResetToken(token: string): Promise<{userId: number, expiresAt: Date, used: boolean} | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<void>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;
}

// Legacy interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateProfile(username: string, profile: UpdateProfile): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Authentication
  authenticateUser(emailOrUsername: string, password: string): Promise<User | undefined>;
  getUserBySocialId(provider: string, socialId: string): Promise<User | undefined>;
  createOrUpdateSocialUser(provider: string, userData: any): Promise<User>;
  
  // Password reset tokens
  createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void>;
  getPasswordResetToken(token: string): Promise<{userId: number, expiresAt: Date, used: boolean} | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<void>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;
  
  // Dashboard data methods
  getServiceRequestsByCustomer(customerId: number): Promise<any[]>;
  getJobsByCustomer(customerId: number): Promise<any[]>;
  getServiceBookingsByCustomer(customerId: number): Promise<any[]>;
  
  // Support case methods
  getSupportCasesByCustomer(customerId: number): Promise<any[]>;
  
  // Admin dashboard methods
  getAllUsers(): Promise<User[]>;
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

  // Support Categories management
  getAllSupportCategories(): Promise<any[]>;
  getSupportCategory(id: number): Promise<any | undefined>;
  createSupportCategory(category: any): Promise<any>;
  updateSupportCategory(id: number, updates: any): Promise<any | undefined>;
  deleteSupportCategory(id: number): Promise<void>;

  // Technician management
  createTechnician(technician: InsertTechnician): Promise<Technician>;
  registerTechnician(technician: any): Promise<Technician>;
  getTechnician(id: number): Promise<Technician | undefined>;
  getTechnicianByUserId(userId: number): Promise<Technician | undefined>;
  updateTechnician(id: number, updates: Partial<Technician>): Promise<Technician>;
  searchTechnicians(criteria: {
    skills?: string[];
    location?: string;
    serviceRadius?: number;
    availability?: boolean;
  }): Promise<Technician[]>;
}

export class PersistentStorage {
  private users: Map<number, User> = new Map();
  private nextUserId = 1;
  private passwordResetTokens: Map<string, {userId: number, expiresAt: Date, used: boolean, createdAt: Date}> = new Map();
  private technicians: Map<number, Technician> = new Map();
  private nextTechnicianId = 1;

  constructor() {
    this.loadUsers();
  }

  private async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }

  private async loadUsers() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(USERS_FILE, 'utf8');
      const usersArray = JSON.parse(data);
      
      this.users.clear();
      usersArray.forEach((user: User) => {
        this.users.set(user.id, {
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null
        });
        if (user.id >= this.nextUserId) {
          this.nextUserId = user.id + 1;
        }
      });
      
      console.log(`Loaded ${this.users.size} users from persistent storage`);
    } catch (error) {
      console.log('No existing users file found, starting with empty storage');
    }
  }

  private async saveUsers() {
    try {
      await this.ensureDataDir();
      const usersArray = Array.from(this.users.values());
      await fs.writeFile(USERS_FILE, JSON.stringify(usersArray, null, 2));
      console.log(`Saved ${usersArray.length} users to persistent storage`);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const user: User = {
      id: this.nextUserId++,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || null,
      fullName: insertUser.fullName || null,
      bio: insertUser.bio || null,
      avatar: insertUser.avatar || null,
      userType: insertUser.userType || "customer",
      socialProviders: insertUser.socialProviders || null,
      authMethod: insertUser.authMethod || "email",
      lastLoginMethod: insertUser.lastLoginMethod || null,
      phone: insertUser.phone || null,
      street: insertUser.street || null,
      apartment: insertUser.apartment || null,
      city: insertUser.city || null,
      state: insertUser.state || null,
      zipCode: insertUser.zipCode || null,
      country: insertUser.country || "Canada",
      emailVerified: insertUser.emailVerified || false,
      phoneVerified: insertUser.phoneVerified || false,
      identityVerified: insertUser.identityVerified || false,
      accountActive: insertUser.accountActive !== false,
      businessInfo: insertUser.businessInfo || null,
      paymentMethod: insertUser.paymentMethod || null,
      paymentMethods: insertUser.paymentMethods || [],
      paymentMethodSetup: insertUser.paymentMethodSetup || false,
      paymentDetails: insertUser.paymentDetails || null,
      emailNotifications: insertUser.emailNotifications !== false,
      smsNotifications: insertUser.smsNotifications || false,
      marketingEmails: insertUser.marketingEmails !== false,
      twoFactorEnabled: insertUser.twoFactorEnabled || false,
      twoFactorMethod: insertUser.twoFactorMethod || null,
      timezone: insertUser.timezone || "America/Toronto",
      language: insertUser.language || "en",
      newsletter: insertUser.newsletter !== false,
      lastLogin: insertUser.lastLogin || null,
      isActive: insertUser.isActive !== false,
      preferences: insertUser.preferences || null,
      metadata: insertUser.metadata || null,
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(user.id, user);
    await this.saveUsers();
    return user;
  }

  async updateProfile(username: string, profile: UpdateProfile): Promise<User> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      ...profile,
      updatedAt: new Date()
    };
    
    this.users.set(user.id, updatedUser);
    await this.saveUsers();
    return updatedUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) {
      return undefined;
    }
    
    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    await this.saveUsers();
    return updatedUser;
  }

  // Authentication methods
  async authenticateUser(emailOrUsername: string, password: string): Promise<User | undefined> {
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
    
    // Verify password - handle both hashed and plain text passwords
    let isValid = false;
    
    // Check if password is hashed (bcrypt hashes start with $2b$)
    if (user.password.startsWith('$2b$')) {
      isValid = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password comparison for temporary passwords
      isValid = user.password === password;
    }
    
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
    for (const user of this.users.values()) {
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

  // Password reset token methods
  async createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void> {
    this.passwordResetTokens.set(token, {
      userId,
      expiresAt,
      used: false,
      createdAt: new Date()
    });
  }

  async getPasswordResetToken(token: string): Promise<{userId: number, expiresAt: Date, used: boolean} | undefined> {
    return this.passwordResetTokens.get(token);
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    const tokenData = this.passwordResetTokens.get(token);
    if (tokenData) {
      tokenData.used = true;
      this.passwordResetTokens.set(token, tokenData);
    }
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.password = newPassword;
      user.updatedAt = new Date();
      this.users.set(userId, user);
      await this.saveUsers();
    }
  }

  // Dashboard data methods - return empty arrays for now
  async getServiceRequestsByCustomer(customerId: number): Promise<any[]> {
    // For now, return empty array - this can be expanded later
    return [];
  }

  async getJobsByCustomer(customerId: number): Promise<any[]> {
    // For now, return empty array - this can be expanded later
    return [];
  }

  async getServiceBookingsByCustomer(customerId: number): Promise<any[]> {
    // For now, return empty array - this can be expanded later
    return [];
  }

  // Support case methods
  async getSupportCasesByCustomer(customerId: number): Promise<any[]> {
    // For now, return empty array - this can be expanded later
    return [];
  }

  // Update user last login
  async updateUserLastLogin(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      this.users.set(userId, user);
      await this.saveUsers();
    }
  }

  // Admin dashboard methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAdminDashboardStats(): Promise<any> {
    return {
      totalUsers: this.users.size,
      totalCustomers: 0, // Would be populated from customer storage
      totalServiceProviders: 0, // Would be populated from service provider storage
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
    return {
      id: Math.floor(Math.random() * 10000),
      ...request,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getAllTechnicians(): Promise<any[]> {
    // Return all technicians from the technicians map
    return Array.from(this.technicians.values());
  }

  // Technician management methods
  async createTechnician(technician: InsertTechnician): Promise<Technician> {
    const newTechnician: Technician = {
      id: this.nextTechnicianId++,
      ...technician,
      userId: technician.userId || 0, // Will be set when user is created
      rating: "5.00",
      completedJobs: 0,
      totalEarnings: "0.00",
      isActive: false,
      isVerified: false,
      verificationStatus: "pending",
      remoteEarningPercentage: "85.00",
      phoneEarningPercentage: "85.00",
      onsiteEarningPercentage: "85.00",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.technicians.set(newTechnician.id, newTechnician);
    return newTechnician;
  }

  async registerTechnician(technicianData: any): Promise<Technician> {
    // Create a user first if needed
    let userId = technicianData.userId;
    
    if (!userId) {
      // Create a basic user entry
      const newUser: InsertUser = {
        username: technicianData.email || `tech${this.nextTechnicianId}`,
        email: technicianData.email,
        userType: 'technician',
        password: 'temp_password', // Should be handled by proper auth flow
        firstName: technicianData.firstName,
        lastName: technicianData.lastName
      };
      
      const user = await this.createUser(newUser);
      userId = user.id;
    }

    // Create technician with proper data structure
    const technicianInsert: InsertTechnician = {
      userId,
      firstName: technicianData.firstName,
      lastName: technicianData.lastName,
      email: technicianData.email,
      phoneNumber: technicianData.phoneNumber,
      address: technicianData.address,
      businessName: technicianData.businessName,
      companyName: technicianData.companyName,
      experience: technicianData.experience,
      hourlyRate: technicianData.hourlyRate || '85.00',
      country: technicianData.country,
      state: technicianData.state,
      city: technicianData.city,
      location: technicianData.location,
      serviceRadius: technicianData.serviceRadius || 25,
      serviceAreas: technicianData.serviceAreas || [],
      skills: technicianData.skills || [],
      categories: technicianData.categories || [],
      certifications: technicianData.certifications || [],
      languages: technicianData.languages || ['English'],
      availability: technicianData.availability || {},
      profileDescription: technicianData.profileDescription,
      responseTime: technicianData.responseTime || 60,
      vehicleType: technicianData.vehicleType,
      vehicleMake: technicianData.vehicleMake,
      vehicleModel: technicianData.vehicleModel,
      vehicleYear: technicianData.vehicleYear,
      vehicleLicensePlate: technicianData.vehicleLicensePlate,
      backgroundCheckUrl: technicianData.backgroundCheckUrl,
      driverLicenseUrl: technicianData.driverLicenseUrl,
      insuranceUrl: technicianData.insuranceUrl
    };

    return await this.createTechnician(technicianInsert);
  }

  async getTechnician(id: number): Promise<Technician | undefined> {
    return this.technicians.get(id);
  }

  async getTechnicianByUserId(userId: number): Promise<Technician | undefined> {
    for (const technician of this.technicians.values()) {
      if (technician.userId === userId) {
        return technician;
      }
    }
    return undefined;
  }

  async updateTechnician(id: number, updates: Partial<Technician>): Promise<Technician> {
    const technician = this.technicians.get(id);
    if (!technician) {
      throw new Error("Technician not found");
    }

    const updatedTechnician: Technician = {
      ...technician,
      ...updates,
      updatedAt: new Date()
    };
    this.technicians.set(id, updatedTechnician);
    return updatedTechnician;
  }

  async searchTechnicians(criteria: {
    skills?: string[];
    location?: string;
    serviceRadius?: number;
    availability?: boolean;
  }): Promise<Technician[]> {
    const technicians = Array.from(this.technicians.values());
    
    return technicians.filter(tech => {
      // Filter by skills
      if (criteria.skills && criteria.skills.length > 0) {
        const hasMatchingSkills = criteria.skills.some(skill => 
          tech.skills?.includes(skill)
        );
        if (!hasMatchingSkills) return false;
      }
      
      // Filter by location
      if (criteria.location) {
        const techLocation = `${tech.city}, ${tech.state}`.toLowerCase();
        if (!techLocation.includes(criteria.location.toLowerCase())) {
          return false;
        }
      }
      
      // Filter by service radius
      if (criteria.serviceRadius && tech.serviceRadius && tech.serviceRadius < criteria.serviceRadius) {
        return false;
      }
      
      // Filter by availability
      if (criteria.availability && !tech.isActive) {
        return false;
      }
      
      return true;
    });
  }

  // FAQ management methods
  async getFAQs(type?: string): Promise<any[]> {
    const mockFAQs = [
      {
        id: 1,
        question: "How do I request technical support?",
        answer: "You can request technical support by clicking on the 'AI Support' button and describing your issue.",
        category: "General",
        type: "general",
        order: 1,
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
    return {
      id: Math.floor(Math.random() * 10000),
      ...faq,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      order: 1
    };
  }

  async updateFAQ(id: number, updates: any): Promise<any> {
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
    // Mock deletion - would actually remove from database
  }

  // Diagnostic tools management methods
  async getDiagnosticTools(): Promise<any[]> {
    return [
      {
        id: 1,
        name: "Network Connectivity Test",
        description: "Tests network connectivity and identifies connection issues",
        category: "Connectivity",
        type: "network",
        isActive: true,
        estimatedDuration: 45,
        successRate: 96.8,
        usageCount: 1247,
        lastUsed: "2025-01-20T10:30:00Z",
        createdAt: new Date("2024-12-15"),
        updatedAt: new Date("2025-01-18")
      }
    ];
  }

  async getDiagnosticAnalytics(): Promise<any> {
    return {
      totalTools: 6,
      totalUsage: 3847,
      averageSuccessRate: 94.2,
      averageDuration: 52,
      categoryBreakdown: {
        "Connectivity": 2,
        "Performance": 2,
        "Compatibility": 1,
        "Security": 1
      },
      recentActivity: []
    };
  }

  async createDiagnosticTool(tool: any): Promise<any> {
    return {
      id: Math.floor(Math.random() * 10000),
      ...tool,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      usageCount: 0,
      successRate: 0
    };
  }

  async updateDiagnosticTool(id: number, updates: any): Promise<any> {
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
    // Mock deletion - would actually remove from database
  }

  // Phone Support Logs methods
  async getPhoneSupportLogs(filters?: {
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
  }> {
    // Mock phone support logs data
    const mockLogs = [
      {
        id: "1",
        callId: "PSL-2025-001",
        customerName: "John Smith",
        customerEmail: "john.smith@email.com",
        customerPhone: "+1-555-0123",
        serviceProviderName: "Alex Johnson",
        serviceProviderEmail: "alex.johnson@techersproviders.com",
        adminName: null,
        callType: "customer",
        category: "Hardware Issues",
        issue: "Computer won't start after power outage, need immediate assistance",
        status: "completed",
        duration: 45,
        startTime: "2025-01-20T09:30:00Z",
        endTime: "2025-01-20T10:15:00Z",
        resolution: "Power supply failure identified and replaced. System restored to full functionality.",
        priority: "high",
        transferredTo: null,
        notes: "Customer very satisfied with quick resolution. Recommended backup power solution.",
        satisfaction: 5,
        recordings: ["PSL-2025-001-recording.mp3"],
        createdAt: "2025-01-20T09:30:00Z"
      },
      {
        id: "2",
        callId: "PSL-2025-002",
        customerName: "Sarah Wilson",
        customerEmail: "sarah.wilson@business.com",
        customerPhone: "+1-555-0456",
        serviceProviderName: "Emily Rodriguez",
        serviceProviderEmail: "emily.rodriguez@techersproviders.com",
        adminName: null,
        callType: "service_provider",
        category: "Network Troubleshooting",
        issue: "Office network intermittent connectivity affecting productivity",
        status: "active",
        duration: 25,
        startTime: "2025-01-20T11:00:00Z",
        endTime: null,
        resolution: "In progress - investigating router configuration",
        priority: "medium",
        transferredTo: null,
        notes: "Network analysis ongoing, potential router firmware issue identified",
        satisfaction: null,
        recordings: [],
        createdAt: "2025-01-20T11:00:00Z"
      },
      {
        id: "3",
        callId: "PSL-2025-003",
        customerName: "Michael Davis",
        customerEmail: "m.davis@company.org",
        customerPhone: "+1-555-0789",
        serviceProviderName: "David Kim",
        serviceProviderEmail: "david.kim@techersproviders.com",
        adminName: "Admin Sarah",
        callType: "admin",
        category: "Security Questions",
        issue: "Security breach concern, need immediate assessment and response",
        status: "transferred",
        duration: 15,
        startTime: "2025-01-20T08:15:00Z",
        endTime: "2025-01-20T08:30:00Z",
        resolution: "Transferred to senior security specialist for advanced assessment",
        priority: "urgent",
        transferredTo: "Senior Security Team",
        notes: "Escalated due to severity. Customer contacted within 30 minutes.",
        satisfaction: 4,
        recordings: ["PSL-2025-003-initial.mp3"],
        createdAt: "2025-01-20T08:15:00Z"
      },
      {
        id: "4",
        callId: "PSL-2025-004",
        customerName: "Lisa Brown",
        customerEmail: "lisa.brown@startup.io",
        customerPhone: "+1-555-0321",
        serviceProviderName: "Rachel Lee",
        serviceProviderEmail: "rachel.lee@techersproviders.com",
        adminName: null,
        callType: "customer",
        category: "Software Issues",
        issue: "Database connection errors preventing application access",
        status: "completed",
        duration: 35,
        startTime: "2025-01-20T13:45:00Z",
        endTime: "2025-01-20T14:20:00Z",
        resolution: "Database configuration updated and connection pool optimized. Application fully operational.",
        priority: "high",
        transferredTo: null,
        notes: "Provided documentation for database maintenance best practices.",
        satisfaction: 5,
        recordings: ["PSL-2025-004-session.mp3"],
        createdAt: "2025-01-20T13:45:00Z"
      },
      {
        id: "5",
        callId: "PSL-2025-005",
        customerName: "Robert Johnson",
        customerEmail: "rob.johnson@tech.com",
        customerPhone: "+1-555-0654",
        serviceProviderName: "Lisa Thompson",
        serviceProviderEmail: "lisa.thompson@techersproviders.com",
        adminName: null,
        callType: "service_provider",
        category: "Web Development",
        issue: "Website deployment issues and SSL certificate problems",
        status: "failed",
        duration: 20,
        startTime: "2025-01-20T16:00:00Z",
        endTime: "2025-01-20T16:20:00Z",
        resolution: "Call disconnected due to technical issues. Follow-up scheduled.",
        priority: "medium",
        transferredTo: null,
        notes: "Technical difficulties interrupted call. Customer will be contacted for rescheduling.",
        satisfaction: 2,
        recordings: [],
        createdAt: "2025-01-20T16:00:00Z"
      }
    ];

    let filteredLogs = [...mockLogs];

    // Apply filters
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.customerName.toLowerCase().includes(searchLower) ||
        log.customerEmail.toLowerCase().includes(searchLower) ||
        log.customerPhone.includes(searchLower) ||
        log.serviceProviderName.toLowerCase().includes(searchLower) ||
        log.callId.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.callType && filters.callType !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.callType === filters.callType);
    }

    if (filters?.status && filters.status !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.status === filters.status);
    }

    if (filters?.priority && filters.priority !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.priority === filters.priority);
    }

    if (filters?.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date(now);
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.createdAt) >= filterDate
      );
    }

    // Calculate stats
    const stats = {
      total: mockLogs.length,
      active: mockLogs.filter(log => log.status === 'active').length,
      completed: mockLogs.filter(log => log.status === 'completed').length,
      avgDuration: Math.round(mockLogs.reduce((sum, log) => sum + log.duration, 0) / mockLogs.length),
      customerCalls: mockLogs.filter(log => log.callType === 'customer').length,
      providerCalls: mockLogs.filter(log => log.callType === 'service_provider').length,
      adminCalls: mockLogs.filter(log => log.callType === 'admin').length
    };

    return {
      logs: filteredLogs,
      stats
    };
  }

  async getPhoneSupportLogById(id: string): Promise<any | undefined> {
    const { logs } = await this.getPhoneSupportLogs();
    return logs.find(log => log.id === id);
  }

  async createPhoneSupportLog(logData: any): Promise<any> {
    return {
      id: `${Date.now()}`,
      callId: `PSL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...logData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updatePhoneSupportLog(id: string, updates: any): Promise<any | undefined> {
    const log = await this.getPhoneSupportLogById(id);
    if (!log) {
      return undefined;
    }

    return {
      ...log,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }

  // Support Categories management using Supabase database
  async getAllSupportCategories(): Promise<any[]> {
    try {
      // Try database first - if fails, fall back to mock data
      if (process.env.DATABASE_URL) {
        const { db } = await import('./db');
        const { supportCategories } = await import('@shared/schema');
        const categories = await db.select().from(supportCategories);
        console.log('Fetched support categories from database:', categories.length);
        return categories;
      }
    } catch (error) {
      console.log('Database unavailable, using mock data for support categories:', error.message);
    }
    
    // Fallback to mock data
    return [
      {
        id: 1,
        name: "Network Configuration",
        description: "Setup and troubleshoot network settings, WiFi, and internet connectivity issues",
        icon: "Monitor",
        basePrice: 75.00,
        serviceType: "remote",
        estimatedDuration: 60,
        skillsRequired: ["networking", "troubleshooting", "cisco"],
        isActive: true,
        isPublic: true,
        adminId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Hardware Diagnostics", 
        description: "Identify and resolve hardware issues, component failures, and system performance problems",
        icon: "Wrench",
        basePrice: 120.00,
        serviceType: "onsite",
        estimatedDuration: 90,
        skillsRequired: ["hardware", "diagnostics", "repair"],
        isActive: true,
        isPublic: true,
        adminId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: "Software Support",
        description: "Installation, configuration, and troubleshooting of software applications",
        icon: "Settings",
        basePrice: 60.00,
        serviceType: "phone",
        estimatedDuration: 45,
        skillsRequired: ["software", "installation", "support"],
        isActive: true,
        isPublic: true,
        adminId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  async getSupportCategory(id: number): Promise<any | undefined> {
    try {
      if (process.env.DATABASE_URL) {
        const { db } = await import('./db');
        const { supportCategories } = await import('@shared/schema');
        const { eq } = await import('drizzle-orm');
        
        const [category] = await db.select().from(supportCategories).where(eq(supportCategories.id, id));
        return category;
      }
    } catch (error) {
      console.log('Database unavailable, using mock data fallback:', error.message);
    }
    
    // Fallback to mock data
    const categories = await this.getAllSupportCategories();
    return categories.find(cat => cat.id === id);
  }

  async createSupportCategory(category: any): Promise<any> {
    try {
      if (process.env.DATABASE_URL) {
        const { db } = await import('./db');
        const { supportCategories } = await import('@shared/schema');
        
        const [newCategory] = await db
          .insert(supportCategories)
          .values({
            ...category,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();
          
        console.log('Created support category in database:', newCategory);
        return newCategory;
      }
    } catch (error) {
      console.log('Database unavailable, using mock creation:', error.message);
    }
    
    // Fallback to mock data
    const newCategory = {
      id: Math.floor(Math.random() * 1000) + 4,
      ...category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newCategory;
  }

  async updateSupportCategory(id: number, updates: any): Promise<any | undefined> {
    try {
      if (process.env.DATABASE_URL) {
        const { db } = await import('./db');
        const { supportCategories } = await import('@shared/schema');
        const { eq } = await import('drizzle-orm');
        
        const [updatedCategory] = await db
          .update(supportCategories)
          .set({
            ...updates,
            updatedAt: new Date()
          })
          .where(eq(supportCategories.id, id))
          .returning();
          
        console.log('Updated support category in database:', updatedCategory);
        return updatedCategory;
      }
    } catch (error) {
      console.log('Database unavailable, using mock update:', error.message);
    }
    
    // Fallback to mock data
    const category = await this.getSupportCategory(id);
    if (!category) {
      return undefined;
    }
    
    return {
      ...category,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }

  async deleteSupportCategory(id: number): Promise<void> {
    try {
      if (process.env.DATABASE_URL) {
        const { db } = await import('./db');
        const { supportCategories } = await import('@shared/schema');
        const { eq } = await import('drizzle-orm');
        
        await db.delete(supportCategories).where(eq(supportCategories.id, id));
        console.log('Deleted support category from database:', id);
        return;
      }
    } catch (error) {
      console.log('Database unavailable, mock deletion:', error.message);
    }
    
    // Mock implementation for fallback
    return;
  }
}

// Customer persistent storage implementation
export class CustomerPersistentStorage implements ICustomerStorage {
  private customers: Map<number, Customer> = new Map();
  private nextCustomerId = 1;
  private passwordResetTokens: Map<string, {userId: number, expiresAt: Date, used: boolean, createdAt: Date}> = new Map();

  constructor() {
    this.loadCustomers();
  }

  private async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }

  private async loadCustomers() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(CUSTOMERS_FILE, 'utf8');
      const customersArray = JSON.parse(data);
      
      this.customers.clear();
      customersArray.forEach((customer: Customer) => {
        this.customers.set(customer.id, {
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt)
        });
        if (customer.id >= this.nextCustomerId) {
          this.nextCustomerId = customer.id + 1;
        }
      });
      
      console.log(`Loaded ${this.customers.size} customers from persistent storage`);
    } catch (error) {
      console.log('No existing customers file found, starting with empty storage');
    }
  }

  private async saveCustomers() {
    try {
      await this.ensureDataDir();
      const customersArray = Array.from(this.customers.values());
      await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customersArray, null, 2));
      console.log(`Saved ${customersArray.length} customers to persistent storage`);
    } catch (error) {
      console.error('Error saving customers:', error);
    }
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByUsername(username: string): Promise<Customer | undefined> {
    for (const customer of this.customers.values()) {
      if (customer.username === username) {
        return customer;
      }
    }
    return undefined;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    for (const customer of this.customers.values()) {
      if (customer.email === email) {
        return customer;
      }
    }
    return undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const customer: Customer = {
      id: this.nextCustomerId++,
      username: insertCustomer.username,
      password: insertCustomer.password || null,
      email: insertCustomer.email || null,
      fullName: insertCustomer.fullName || null,
      bio: insertCustomer.bio || null,
      avatar: insertCustomer.avatar || null,
      socialProviders: insertCustomer.socialProviders || null,
      authMethod: insertCustomer.authMethod || "email",
      lastLoginMethod: insertCustomer.lastLoginMethod || null,
      phone: insertCustomer.phone || null,
      street: insertCustomer.street || null,
      apartment: insertCustomer.apartment || null,
      city: insertCustomer.city || null,
      state: insertCustomer.state || null,
      zipCode: insertCustomer.zipCode || null,
      country: insertCustomer.country || "Canada",
      businessInfo: insertCustomer.businessInfo || null,
      paymentMethod: insertCustomer.paymentMethod || null,
      paymentMethods: insertCustomer.paymentMethods || null,
      paymentMethodSetup: insertCustomer.paymentMethodSetup || false,
      paymentDetails: insertCustomer.paymentDetails || null,
      emailVerified: insertCustomer.emailVerified || false,
      phoneVerified: insertCustomer.phoneVerified || false,
      identityVerified: insertCustomer.identityVerified || false,
      accountActive: insertCustomer.accountActive !== undefined ? insertCustomer.accountActive : true,
      emailNotifications: insertCustomer.emailNotifications !== undefined ? insertCustomer.emailNotifications : true,
      smsNotifications: insertCustomer.smsNotifications || false,
      marketingEmails: insertCustomer.marketingEmails !== undefined ? insertCustomer.marketingEmails : true,
      twoFactorEnabled: insertCustomer.twoFactorEnabled || false,
      twoFactorMethod: insertCustomer.twoFactorMethod || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.customers.set(customer.id, customer);
    await this.saveCustomers();
    return customer;
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;

    const updatedCustomer: Customer = {
      ...customer,
      ...updates,
      id: customer.id,
      updatedAt: new Date()
    };

    this.customers.set(id, updatedCustomer);
    await this.saveCustomers();
    return updatedCustomer;
  }

  async authenticateCustomer(emailOrUsername: string, password: string): Promise<Customer | undefined> {
    let customer = emailOrUsername.includes('@') 
      ? await this.getCustomerByEmail(emailOrUsername)
      : await this.getCustomerByUsername(emailOrUsername);

    if (!customer && emailOrUsername.includes('@')) {
      customer = await this.getCustomerByUsername(emailOrUsername);
    }

    if (!customer || !customer.password) {
      return undefined;
    }

    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      return undefined;
    }

    await this.updateCustomer(customer.id, {
      lastLoginMethod: "email",
      updatedAt: new Date()
    });

    return customer;
  }

  async getCustomerBySocialId(provider: string, socialId: string): Promise<Customer | undefined> {
    for (const customer of this.customers.values()) {
      if (customer.socialProviders && customer.socialProviders[provider]?.id === socialId) {
        return customer;
      }
    }
    return undefined;
  }

  async createOrUpdateSocialCustomer(provider: string, userData: any): Promise<Customer> {
    const existingCustomer = await this.getCustomerBySocialId(provider, userData.id);
    if (existingCustomer) {
      return await this.updateCustomer(existingCustomer.id, {
        lastLoginMethod: provider,
        updatedAt: new Date()
      }) || existingCustomer;
    }

    const username = this.generateUniqueUsername(userData.username || userData.name || `user_${provider}_${userData.id.slice(0, 8)}`);
    
    return await this.createCustomer({
      username,
      password: null,
      email: userData.email || null,
      fullName: userData.name || null,
      avatar: userData.avatar || null,
      socialProviders: {
        [provider]: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar
        }
      },
      authMethod: provider,
      lastLoginMethod: provider
    });
  }

  private generateUniqueUsername(baseUsername: string): string {
    let username = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (username.length < 3) {
      username = username + Math.random().toString(36).substring(2, 8);
    }
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${username}_${suffix}`;
  }

  // Password reset token methods
  async createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void> {
    this.passwordResetTokens.set(token, {
      userId,
      expiresAt,
      used: false,
      createdAt: new Date()
    });
  }

  async getPasswordResetToken(token: string): Promise<{userId: number, expiresAt: Date, used: boolean} | undefined> {
    return this.passwordResetTokens.get(token);
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    const tokenData = this.passwordResetTokens.get(token);
    if (tokenData) {
      tokenData.used = true;
      this.passwordResetTokens.set(token, tokenData);
    }
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    const customer = this.customers.get(userId);
    if (customer) {
      customer.password = newPassword;
      customer.updatedAt = new Date();
      this.customers.set(userId, customer);
      await this.saveCustomers();
    }
  }

  // Dashboard data methods
  async getServiceRequestsByCustomer(customerId: number): Promise<any[]> {
    return [];
  }

  async getJobsByCustomer(customerId: number): Promise<any[]> {
    return [];
  }

  async getServiceBookingsByCustomer(customerId: number): Promise<any[]> {
    return [];
  }
}

// Service Provider persistent storage implementation
export class ServiceProviderPersistentStorage implements IServiceProviderStorage {
  private serviceProviders: Map<number, ServiceProvider> = new Map();
  private nextServiceProviderId = 1;
  private passwordResetTokens: Map<string, {userId: number, expiresAt: Date, used: boolean, createdAt: Date}> = new Map();

  constructor() {
    this.loadServiceProviders();
  }

  private async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }

  private async loadServiceProviders() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(SERVICE_PROVIDERS_FILE, 'utf8');
      const serviceProvidersArray = JSON.parse(data);
      
      this.serviceProviders.clear();
      serviceProvidersArray.forEach((serviceProvider: ServiceProvider) => {
        this.serviceProviders.set(serviceProvider.id, {
          ...serviceProvider,
          createdAt: new Date(serviceProvider.createdAt),
          updatedAt: new Date(serviceProvider.updatedAt)
        });
        if (serviceProvider.id >= this.nextServiceProviderId) {
          this.nextServiceProviderId = serviceProvider.id + 1;
        }
      });
      
      console.log(`Loaded ${this.serviceProviders.size} service providers from persistent storage`);
    } catch (error) {
      console.log('No existing service providers file found, starting with empty storage');
    }
  }

  private async saveServiceProviders() {
    try {
      await this.ensureDataDir();
      const serviceProvidersArray = Array.from(this.serviceProviders.values());
      await fs.writeFile(SERVICE_PROVIDERS_FILE, JSON.stringify(serviceProvidersArray, null, 2));
      console.log(`Saved ${serviceProvidersArray.length} service providers to persistent storage`);
    } catch (error) {
      console.error('Error saving service providers:', error);
    }
  }

  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    return this.serviceProviders.get(id);
  }

  async getServiceProviderByUsername(username: string): Promise<ServiceProvider | undefined> {
    for (const serviceProvider of this.serviceProviders.values()) {
      if (serviceProvider.username === username) {
        return serviceProvider;
      }
    }
    return undefined;
  }

  async getServiceProviderByEmail(email: string): Promise<ServiceProvider | undefined> {
    for (const serviceProvider of this.serviceProviders.values()) {
      if (serviceProvider.email === email) {
        return serviceProvider;
      }
    }
    return undefined;
  }

  async createServiceProvider(insertServiceProvider: InsertServiceProvider): Promise<ServiceProvider> {
    const serviceProvider: ServiceProvider = {
      id: this.nextServiceProviderId++,
      username: insertServiceProvider.username,
      password: insertServiceProvider.password || null,
      email: insertServiceProvider.email || null,
      fullName: insertServiceProvider.fullName || null,
      bio: insertServiceProvider.bio || null,
      avatar: insertServiceProvider.avatar || null,
      socialProviders: insertServiceProvider.socialProviders || null,
      authMethod: insertServiceProvider.authMethod || "email",
      lastLoginMethod: insertServiceProvider.lastLoginMethod || null,
      phone: insertServiceProvider.phone || null,
      street: insertServiceProvider.street || null,
      apartment: insertServiceProvider.apartment || null,
      city: insertServiceProvider.city || null,
      state: insertServiceProvider.state || null,
      zipCode: insertServiceProvider.zipCode || null,
      country: insertServiceProvider.country || "Canada",
      businessInfo: insertServiceProvider.businessInfo || null,
      emailVerified: insertServiceProvider.emailVerified || false,
      phoneVerified: insertServiceProvider.phoneVerified || false,
      identityVerified: insertServiceProvider.identityVerified || false,
      backgroundCheckVerified: insertServiceProvider.backgroundCheckVerified || false,
      accountActive: insertServiceProvider.accountActive !== undefined ? insertServiceProvider.accountActive : true,
      accountApproved: insertServiceProvider.accountApproved || false,
      rating: insertServiceProvider.rating || "0.00",
      totalJobs: insertServiceProvider.totalJobs || 0,
      completedJobs: insertServiceProvider.completedJobs || 0,
      responseTime: insertServiceProvider.responseTime || 0,
      emailNotifications: insertServiceProvider.emailNotifications !== undefined ? insertServiceProvider.emailNotifications : true,
      smsNotifications: insertServiceProvider.smsNotifications || false,
      marketingEmails: insertServiceProvider.marketingEmails !== undefined ? insertServiceProvider.marketingEmails : true,
      twoFactorEnabled: insertServiceProvider.twoFactorEnabled || false,
      twoFactorMethod: insertServiceProvider.twoFactorMethod || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.serviceProviders.set(serviceProvider.id, serviceProvider);
    await this.saveServiceProviders();
    return serviceProvider;
  }

  async updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider | undefined> {
    const serviceProvider = this.serviceProviders.get(id);
    if (!serviceProvider) return undefined;

    const updatedServiceProvider: ServiceProvider = {
      ...serviceProvider,
      ...updates,
      id: serviceProvider.id,
      updatedAt: new Date()
    };

    this.serviceProviders.set(id, updatedServiceProvider);
    await this.saveServiceProviders();
    return updatedServiceProvider;
  }

  async authenticateServiceProvider(emailOrUsername: string, password: string): Promise<ServiceProvider | undefined> {
    let serviceProvider = emailOrUsername.includes('@') 
      ? await this.getServiceProviderByEmail(emailOrUsername)
      : await this.getServiceProviderByUsername(emailOrUsername);

    if (!serviceProvider && emailOrUsername.includes('@')) {
      serviceProvider = await this.getServiceProviderByUsername(emailOrUsername);
    }

    if (!serviceProvider || !serviceProvider.password) {
      return undefined;
    }

    const isValid = await bcrypt.compare(password, serviceProvider.password);
    if (!isValid) {
      return undefined;
    }

    await this.updateServiceProvider(serviceProvider.id, {
      lastLoginMethod: "email",
      updatedAt: new Date()
    });

    return serviceProvider;
  }

  async getServiceProviderBySocialId(provider: string, socialId: string): Promise<ServiceProvider | undefined> {
    for (const serviceProvider of this.serviceProviders.values()) {
      if (serviceProvider.socialProviders && serviceProvider.socialProviders[provider]?.id === socialId) {
        return serviceProvider;
      }
    }
    return undefined;
  }

  async createOrUpdateSocialServiceProvider(provider: string, userData: any): Promise<ServiceProvider> {
    const existingServiceProvider = await this.getServiceProviderBySocialId(provider, userData.id);
    if (existingServiceProvider) {
      return await this.updateServiceProvider(existingServiceProvider.id, {
        lastLoginMethod: provider,
        updatedAt: new Date()
      }) || existingServiceProvider;
    }

    const username = this.generateUniqueUsername(userData.username || userData.name || `provider_${provider}_${userData.id.slice(0, 8)}`);
    
    return await this.createServiceProvider({
      username,
      password: null,
      email: userData.email || null,
      fullName: userData.name || null,
      avatar: userData.avatar || null,
      socialProviders: {
        [provider]: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar
        }
      },
      authMethod: provider,
      lastLoginMethod: provider
    });
  }

  private generateUniqueUsername(baseUsername: string): string {
    let username = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (username.length < 3) {
      username = username + Math.random().toString(36).substring(2, 8);
    }
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${username}_${suffix}`;
  }

  // Password reset token methods
  async createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void> {
    this.passwordResetTokens.set(token, {
      userId,
      expiresAt,
      used: false,
      createdAt: new Date()
    });
  }

  async getPasswordResetToken(token: string): Promise<{userId: number, expiresAt: Date, used: boolean} | undefined> {
    return this.passwordResetTokens.get(token);
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    const tokenData = this.passwordResetTokens.get(token);
    if (tokenData) {
      tokenData.used = true;
      this.passwordResetTokens.set(token, tokenData);
    }
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    const serviceProvider = this.serviceProviders.get(userId);
    if (serviceProvider) {
      serviceProvider.password = newPassword;
      serviceProvider.updatedAt = new Date();
      this.serviceProviders.set(userId, serviceProvider);
      await this.saveServiceProviders();
    }
  }

  // Support Categories Management Methods
  private supportCategories: any[] = [];
  private serviceProviderServices: any[] = [];
  private aiChatFallbackLogs: any[] = [];

  async getAllSupportCategories(): Promise<any[]> {
    if (this.supportCategories.length === 0) {
      // Initialize with sample categories
      this.supportCategories = [
        {
          id: 1,
          name: "Network Configuration",
          description: "Setup and troubleshoot network settings, WiFi, and internet connectivity issues",
          icon: "Monitor",
          basePrice: 75.00,
          serviceType: "remote",
          estimatedDuration: 60,
          skillsRequired: ["networking", "troubleshooting", "cisco"],
          isActive: true,
          isPublic: true,
          adminId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Hardware Diagnostics",
          description: "Identify and resolve hardware issues, component failures, and system performance problems",
          icon: "Wrench",
          basePrice: 120.00,
          serviceType: "onsite",
          estimatedDuration: 90,
          skillsRequired: ["hardware", "diagnostics", "repair"],
          isActive: true,
          isPublic: true,
          adminId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Software Support",
          description: "Installation, configuration, and troubleshooting of software applications",
          icon: "Settings",
          basePrice: 60.00,
          serviceType: "phone",
          estimatedDuration: 45,
          skillsRequired: ["software", "installation", "support"],
          isActive: true,
          isPublic: true,
          adminId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
    return this.supportCategories;
  }

  async createSupportCategory(categoryData: any): Promise<any> {
    const newCategory = {
      id: this.supportCategories.length + 1,
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.supportCategories.push(newCategory);
    return newCategory;
  }

  async updateSupportCategory(id: number, updates: any): Promise<any> {
    const categoryIndex = this.supportCategories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    
    this.supportCategories[categoryIndex] = {
      ...this.supportCategories[categoryIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.supportCategories[categoryIndex];
  }

  async deleteSupportCategory(id: number): Promise<void> {
    const categoryIndex = this.supportCategories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    this.supportCategories.splice(categoryIndex, 1);
  }

  async getActiveServicesByCategory(categoryId: number): Promise<any[]> {
    if (this.serviceProviderServices.length === 0) {
      // Initialize with sample service provider services
      this.serviceProviderServices = [
        {
          id: 1,
          serviceProviderId: 1,
          categoryId: 1,
          customPrice: 85.00,
          isActive: true,
          experienceLevel: "Expert",
          providerName: "John Tech",
          categoryName: "Network Configuration"
        },
        {
          id: 2,
          serviceProviderId: 2,
          categoryId: 2,
          customPrice: null,
          isActive: true,
          experienceLevel: "Intermediate",
          providerName: "Sarah Fix",
          categoryName: "Hardware Diagnostics"
        },
        {
          id: 3,
          serviceProviderId: 3,
          categoryId: 3,
          customPrice: 55.00,
          isActive: true,
          experienceLevel: "Expert",
          providerName: "Mike Support",
          categoryName: "Software Support"
        }
      ];
    }
    
    if (categoryId === 0) {
      return this.serviceProviderServices;
    }
    
    return this.serviceProviderServices.filter(s => s.categoryId === categoryId && s.isActive);
  }

  async activateServiceForProvider(providerId: number, categoryId: number, serviceData: any): Promise<any> {
    const newService = {
      id: this.serviceProviderServices.length + 1,
      serviceProviderId: providerId,
      categoryId: categoryId,
      ...serviceData,
      isActive: true
    };
    this.serviceProviderServices.push(newService);
    return newService;
  }

  async checkServiceAvailability(categoryId: number): Promise<any> {
    const activeServices = this.serviceProviderServices.filter(s => 
      s.categoryId === categoryId && s.isActive
    );
    
    return {
      hasProviders: activeServices.length > 0,
      providerCount: activeServices.length,
      averagePrice: activeServices.length > 0 
        ? activeServices.reduce((sum, s) => sum + (s.customPrice || 0), 0) / activeServices.length
        : null
    };
  }

  async logAiChatFallback(fallbackData: any): Promise<any> {
    const log = {
      id: this.aiChatFallbackLogs.length + 1,
      ...fallbackData,
      timestamp: new Date().toISOString()
    };
    this.aiChatFallbackLogs.push(log);
    return log;
  }

  async getAiChatFallbackStats(): Promise<any> {
    return {
      totalFallbacks: this.aiChatFallbackLogs.length,
      recentFallbacks: this.aiChatFallbackLogs.slice(-10),
      categoriesWithoutProviders: this.supportCategories.filter(c => 
        !this.serviceProviderServices.some(s => s.categoryId === c.id && s.isActive)
      ).length
    };
  }

}

// Create storage instances
export const customerStorage = new CustomerPersistentStorage();
export const serviceProviderStorage = new ServiceProviderPersistentStorage();
export const storage = new PersistentStorage();