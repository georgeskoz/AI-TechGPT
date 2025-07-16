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
  createUser(user: InsertUser): Promise<User>;
  updateProfile(username: string, profile: UpdateProfile): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Authentication
  authenticateUser(emailOrUsername: string, password: string): Promise<User | undefined>;
  getUserBySocialId(provider: string, socialId: string): Promise<User | undefined>;
  createOrUpdateSocialUser(provider: string, userData: any): Promise<User>;
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