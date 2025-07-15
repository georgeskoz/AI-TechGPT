import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import { type User, type InsertUser, type UpdateProfile } from "@shared/schema";

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Interface for storage operations
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

export class PersistentStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private nextUserId = 1;

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
}

export const storage = new PersistentStorage();