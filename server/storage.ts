import { 
  users, messages, technicians, serviceRequests, jobs, jobUpdates, supportCases, supportMessages,
  type User, type InsertUser, type UpdateProfile, type Message, type InsertMessage,
  type Technician, type InsertTechnician, type ServiceRequest, type InsertServiceRequest,
  type Job, type InsertJob, type JobUpdate, type InsertJobUpdate,
  type SupportCase, type InsertSupportCase, type SupportMessage, type InsertSupportMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateProfile(username: string, profile: UpdateProfile): Promise<User>;
  
  // Message management
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByUsername(username: string): Promise<Message[]>;
  
  // Technician management
  createTechnician(technician: InsertTechnician): Promise<Technician>;
  getTechnician(id: number): Promise<Technician | undefined>;
  getTechnicianByUserId(userId: number): Promise<Technician | undefined>;
  updateTechnician(id: number, updates: Partial<InsertTechnician>): Promise<Technician>;
  searchTechnicians(criteria: {
    skills?: string[];
    location?: string;
    serviceRadius?: number;
    availability?: boolean;
  }): Promise<Technician[]>;
  
  // Service request management
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  getServiceRequest(id: number): Promise<ServiceRequest | undefined>;
  getServiceRequestsByCustomer(customerId: number): Promise<ServiceRequest[]>;
  getServiceRequestsByTechnician(technicianId: number): Promise<ServiceRequest[]>;
  updateServiceRequestStatus(id: number, status: string, technicianId?: number): Promise<ServiceRequest>;
  
  // Job management
  createJob(job: InsertJob): Promise<Job>;
  getJob(id: number): Promise<Job | undefined>;
  getJobsByCustomer(customerId: number): Promise<Job[]>;
  getJobsByTechnician(technicianId: number): Promise<Job[]>;
  updateJobStatus(id: number, status: string, updates?: Partial<Job>): Promise<Job>;
  
  // Job updates
  createJobUpdate(update: InsertJobUpdate): Promise<JobUpdate>;
  getJobUpdates(jobId: number): Promise<JobUpdate[]>;

  // Live support chat
  createSupportCase(supportCase: InsertSupportCase): Promise<SupportCase>;
  getSupportCase(id: number): Promise<SupportCase | undefined>;
  getSupportCasesByCustomer(customerId: number): Promise<SupportCase[]>;
  getSupportCasesByTechnician(technicianId: number): Promise<SupportCase[]>;
  updateSupportCase(id: number, updates: Partial<SupportCase>): Promise<SupportCase>;
  assignTechnicianToCase(caseId: number, technicianId: number): Promise<SupportCase>;
  closeSupportCase(caseId: number, totalDuration: number): Promise<SupportCase>;
  
  // Support messages
  createSupportMessage(message: InsertSupportMessage): Promise<SupportMessage>;
  getSupportMessages(caseId: number): Promise<SupportMessage[]>;
  markMessageAsRead(messageId: number): Promise<void>;
  getUnreadMessageCount(caseId: number, userId: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User management
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

  // Message management
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessagesByUsername(username: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.username, username))
      .orderBy(messages.timestamp);
  }

  // Technician management
  async createTechnician(insertTechnician: InsertTechnician): Promise<Technician> {
    const [technician] = await db
      .insert(technicians)
      .values(insertTechnician)
      .returning();
    return technician;
  }

  async getTechnician(id: number): Promise<Technician | undefined> {
    const [technician] = await db.select().from(technicians).where(eq(technicians.id, id));
    return technician || undefined;
  }

  async getTechnicianByUserId(userId: number): Promise<Technician | undefined> {
    const [technician] = await db.select().from(technicians).where(eq(technicians.userId, userId));
    return technician || undefined;
  }

  async updateTechnician(id: number, updates: Partial<InsertTechnician>): Promise<Technician> {
    const [technician] = await db
      .update(technicians)
      .set(updates)
      .where(eq(technicians.id, id))
      .returning();
    return technician;
  }

  async searchTechnicians(criteria: {
    skills?: string[];
    location?: string;
    serviceRadius?: number;
    availability?: boolean;
  }): Promise<Technician[]> {
    let query = db.select().from(technicians).where(eq(technicians.isActive, true));
    
    if (criteria.skills && criteria.skills.length > 0) {
      // PostgreSQL JSONB array contains operator
      query = query.where(
        sql`${technicians.skills} ?| ${criteria.skills}`
      );
    }
    
    return await query;
  }

  // Service request management
  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const [request] = await db
      .insert(serviceRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
    return request || undefined;
  }

  async getServiceRequestsByCustomer(customerId: number): Promise<ServiceRequest[]> {
    return await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.customerId, customerId))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestsByTechnician(technicianId: number): Promise<ServiceRequest[]> {
    return await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.technicianId, technicianId))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async updateServiceRequestStatus(id: number, status: string, technicianId?: number): Promise<ServiceRequest> {
    const updates: any = { status };
    if (technicianId) {
      updates.technicianId = technicianId;
    }
    
    const [request] = await db
      .update(serviceRequests)
      .set(updates)
      .where(eq(serviceRequests.id, id))
      .returning();
    return request;
  }

  // Job management
  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getJobsByCustomer(customerId: number): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.customerId, customerId))
      .orderBy(desc(jobs.createdAt));
  }

  async getJobsByTechnician(technicianId: number): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.technicianId, technicianId))
      .orderBy(desc(jobs.createdAt));
  }

  async updateJobStatus(id: number, status: string, updates?: Partial<Job>): Promise<Job> {
    const jobUpdates: any = { status, ...updates };
    
    const [job] = await db
      .update(jobs)
      .set(jobUpdates)
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  // Job updates
  async createJobUpdate(insertUpdate: InsertJobUpdate): Promise<JobUpdate> {
    const [update] = await db
      .insert(jobUpdates)
      .values(insertUpdate)
      .returning();
    return update;
  }

  async getJobUpdates(jobId: number): Promise<JobUpdate[]> {
    return await db
      .select()
      .from(jobUpdates)
      .where(eq(jobUpdates.jobId, jobId))
      .orderBy(jobUpdates.timestamp);
  }

  // Live support chat methods
  async createSupportCase(insertCase: InsertSupportCase): Promise<SupportCase> {
    const [supportCase] = await db
      .insert(supportCases)
      .values(insertCase)
      .returning();
    return supportCase;
  }

  async getSupportCase(id: number): Promise<SupportCase | undefined> {
    const [supportCase] = await db.select().from(supportCases).where(eq(supportCases.id, id));
    return supportCase || undefined;
  }

  async getSupportCasesByCustomer(customerId: number): Promise<SupportCase[]> {
    return await db
      .select()
      .from(supportCases)
      .where(eq(supportCases.customerId, customerId))
      .orderBy(desc(supportCases.createdAt));
  }

  async getSupportCasesByTechnician(technicianId: number): Promise<SupportCase[]> {
    return await db
      .select()
      .from(supportCases)
      .where(eq(supportCases.technicianId, technicianId))
      .orderBy(desc(supportCases.createdAt));
  }

  async updateSupportCase(id: number, updates: Partial<SupportCase>): Promise<SupportCase> {
    const [supportCase] = await db
      .update(supportCases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportCases.id, id))
      .returning();
    return supportCase;
  }

  async assignTechnicianToCase(caseId: number, technicianId: number): Promise<SupportCase> {
    const [supportCase] = await db
      .update(supportCases)
      .set({ 
        technicianId, 
        status: "assigned",
        updatedAt: new Date()
      })
      .where(eq(supportCases.id, caseId))
      .returning();
    return supportCase;
  }

  async closeSupportCase(caseId: number, totalDuration: number): Promise<SupportCase> {
    const [supportCase] = await db
      .update(supportCases)
      .set({ 
        status: "closed",
        endTime: new Date(),
        totalDuration,
        isFreeSupport: totalDuration <= 10, // Free if 10 minutes or less
        updatedAt: new Date()
      })
      .where(eq(supportCases.id, caseId))
      .returning();
    return supportCase;
  }

  async createSupportMessage(insertMessage: InsertSupportMessage): Promise<SupportMessage> {
    const [message] = await db
      .insert(supportMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getSupportMessages(caseId: number): Promise<SupportMessage[]> {
    return await db
      .select()
      .from(supportMessages)
      .where(eq(supportMessages.caseId, caseId))
      .orderBy(supportMessages.timestamp);
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await db
      .update(supportMessages)
      .set({ isRead: true })
      .where(eq(supportMessages.id, messageId));
  }

  async getUnreadMessageCount(caseId: number, userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(supportMessages)
      .where(
        and(
          eq(supportMessages.caseId, caseId),
          eq(supportMessages.isRead, false),
          sql`${supportMessages.senderId} != ${userId}`
        )
      );
    return result[0]?.count || 0;
  }
}

export const storage = new DatabaseStorage();