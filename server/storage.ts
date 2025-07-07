import { users, type User, type InsertUser, messages, type Message, type InsertMessage, type UpdateProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateProfile(username: string, profile: UpdateProfile): Promise<User>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByUsername(username: string): Promise<Message[]>;
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
      .set(profile)
      .where(eq(users.username, username))
      .returning();
    return user;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    // Temporarily handle domain field by omitting it if the database doesn't support it
    const { domain, ...messageData } = insertMessage as any;
    
    try {
      const [message] = await db
        .insert(messages)
        .values(insertMessage)
        .returning();
      return message;
    } catch (error) {
      // If domain field causes error, try without it
      const [message] = await db
        .insert(messages)
        .values(messageData)
        .returning();
      return { ...message, domain } as Message;
    }
  }

  async getMessagesByUsername(username: string): Promise<Message[]> {
    const userMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.username, username))
      .orderBy(messages.timestamp);
    
    return userMessages;
  }
}

export const storage = new DatabaseStorage();
