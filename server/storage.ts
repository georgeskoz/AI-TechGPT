import { users, type User, type InsertUser, type UpdateProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export const storage = new DatabaseStorage();