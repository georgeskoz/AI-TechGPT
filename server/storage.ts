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
  getUserByEmail(email: string): Promise<User | undefined>;
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

  // Enhanced technician management
  registerTechnician(technicianData: any): Promise<any>;
  getTechnicianProfile(userId: number): Promise<any>;
  updateTechnicianAvailability(technicianId: number, isAvailable: boolean): Promise<any>;
  getTechnicianNotifications(technicianId: number): Promise<any[]>;
  acceptJob(technicianId: number, serviceRequestId: number): Promise<any>;
  declineJob(technicianId: number, serviceRequestId: number): Promise<any>;
  getTechnicianEarnings(technicianId: number): Promise<any[]>;

  // Admin dashboard methods
  getAdminDashboardStats(): Promise<any>;
  getAllUsers(): Promise<any[]>;
  getAllTechnicians(): Promise<any[]>;
  getAllJobs(): Promise<any[]>;
  getAllDisputes(): Promise<any[]>;
  updateUserStatus(userId: number, status: string): Promise<any>;
  updateTechnicianStatus(technicianId: number, status: string): Promise<any>;
  resolveDispute(disputeId: number, resolution: string): Promise<any>;

  // Technician earning settings management
  getTechnicianEarningSettings(): Promise<any[]>;
  getTechnicianEarningSetting(technicianId: number): Promise<any>;
  updateTechnicianEarningSettings(technicianId: number, settings: any): Promise<any>;
  bulkUpdateTechnicianEarningSettings(technicianIds: number[], settings: any): Promise<any>;

  // Technician approval system
  approveTechnician(technicianId: number, adminId: number, notes?: string): Promise<any>;
  rejectTechnician(technicianId: number, adminId: number, reason: string): Promise<any>;
  getTechnicianApprovalStatus(technicianId: number): Promise<any>;
  getPendingTechnicianApprovals(): Promise<any[]>;
  updateTechnicianApprovalStatus(technicianId: number, status: string, adminId: number, notes?: string): Promise<any>;

  // Complaint management
  createComplaint(complaint: any): Promise<any>;
  getComplaint(id: number): Promise<any>;
  getComplaintsByCustomer(customerId: number): Promise<any[]>;
  getComplaintsByTechnician(technicianId: number): Promise<any[]>;
  getAllComplaints(): Promise<any[]>;
  updateComplaintStatus(id: number, status: string, adminId: number, notes?: string): Promise<any>;
  assignComplaintInvestigator(id: number, investigatorId: number): Promise<any>;
  resolveComplaint(id: number, resolution: string, adminId: number): Promise<any>;

  // Transportation management
  addTechnicianTransportation(transportation: any): Promise<any>;
  getTechnicianTransportation(technicianId: number): Promise<any>;
  updateTechnicianTransportation(technicianId: number, updates: any): Promise<any>;
  verifyTechnicianTransportation(technicianId: number, adminId: number, notes?: string): Promise<any>;

  // Background check management
  createBackgroundCheck(backgroundCheck: any): Promise<any>;
  getBackgroundCheck(id: number): Promise<any>;
  getTechnicianBackgroundChecks(technicianId: number): Promise<any[]>;
  updateBackgroundCheckStatus(id: number, status: string, result?: string, adminId?: number): Promise<any>;
  getAllPendingBackgroundChecks(): Promise<any[]>;

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

  async getUserByEmail(email: string): Promise<User | undefined> {
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

// Temporary in-memory storage for support system
class MemoryStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private messages: Map<number, Message> = new Map();
  private technicians: Map<number, Technician> = new Map();
  private serviceRequests: Map<number, ServiceRequest> = new Map();
  private jobs: Map<number, Job> = new Map();
  private jobUpdates: Map<number, JobUpdate> = new Map();
  private supportCases: Map<number, SupportCase> = new Map();
  private supportMessages: Map<number, SupportMessage> = new Map();
  
  private nextId = 1;

  constructor() {
    // Initialize with sample data for demo
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    const sampleUsers = [
      { id: 1, username: "john_doe", email: "john@example.com", fullName: "John Doe", bio: "Tech enthusiast", avatar: null },
      { id: 2, username: "jane_smith", email: "jane@example.com", fullName: "Jane Smith", bio: "Software developer", avatar: null },
      { id: 3, username: "bob_wilson", email: "bob@example.com", fullName: "Bob Wilson", bio: "Hardware specialist", avatar: null },
      { id: 4, username: "alice_brown", email: "alice@example.com", fullName: "Alice Brown", bio: "Network admin", avatar: null }
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, user as User);
    });

    // Sample technicians
    const sampleTechnicians = [
      {
        id: 1, userId: 5, businessName: "TechFix Pro", companyName: "TechFix Solutions", 
        experience: "5+ years", hourlyRate: "85", location: "San Francisco, CA", 
        serviceRadius: 25, serviceAreas: ["San Francisco", "Oakland"], 
        skills: ["Hardware Repair", "Network Setup", "Software Installation"], 
        categories: ["Hardware Issues", "Network Troubleshooting"], 
        certifications: ["CompTIA A+", "Cisco CCNA"], languages: ["English", "Spanish"],
        availability: { monday: "9-17", tuesday: "9-17", wednesday: "9-17" },
        profileDescription: "Expert in hardware and network solutions", rating: "4.9",
        completedJobs: 245, totalEarnings: "18750", responseTime: 30, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        stripeAccountId: null, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 2, userId: 6, businessName: "Code Solutions", companyName: "Mike Chen Tech", 
        experience: "7+ years", hourlyRate: "95", location: "New York, NY", 
        serviceRadius: 30, serviceAreas: ["Manhattan", "Brooklyn"], 
        skills: ["Web Development", "Database Management", "System Administration"], 
        categories: ["Web Development", "Database Help"], 
        certifications: ["AWS Certified", "Microsoft Certified"], languages: ["English", "Mandarin"],
        availability: { monday: "8-18", tuesday: "8-18", wednesday: "8-18" },
        profileDescription: "Full-stack developer and system architect", rating: "4.8",
        completedJobs: 198, totalEarnings: "15840", responseTime: 45, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        stripeAccountId: null, createdAt: new Date(), updatedAt: new Date()
      }
    ];

    sampleTechnicians.forEach(tech => {
      this.technicians.set(tech.id, tech as Technician);
    });

    // Sample jobs
    const sampleJobs = [
      {
        id: 1, customerId: 1, technicianId: 1, serviceRequestId: 1,
        description: "Computer not starting up", status: "in_progress",
        scheduledTime: new Date(), estimatedDuration: 120, totalCost: "150.00",
        location: "123 Main St, San Francisco", completedAt: null,
        rating: null, feedback: null, createdAt: new Date()
      },
      {
        id: 2, customerId: 2, technicianId: 2, serviceRequestId: 2,
        description: "Website database optimization", status: "completed",
        scheduledTime: new Date(Date.now() - 86400000), estimatedDuration: 180, totalCost: "270.00",
        location: "Remote", completedAt: new Date(Date.now() - 3600000),
        rating: 5, feedback: "Excellent work!", createdAt: new Date(Date.now() - 86400000)
      },
      {
        id: 3, customerId: 3, technicianId: 1, serviceRequestId: 3,
        description: "Network setup for small office", status: "disputed",
        scheduledTime: new Date(Date.now() - 172800000), estimatedDuration: 240, totalCost: "320.00",
        location: "456 Business Ave, Oakland", completedAt: new Date(Date.now() - 86400000),
        rating: null, feedback: null, createdAt: new Date(Date.now() - 172800000)
      }
    ];

    sampleJobs.forEach(job => {
      this.jobs.set(job.id, job as Job);
    });

    this.nextId = 10; // Start IDs from 10 to avoid conflicts
  }
  
  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const user = { id: this.nextId++, ...insertUser } as User;
    this.users.set(user.id, user);
    return user;
  }
  
  async updateProfile(username: string, profile: UpdateProfile): Promise<User> {
    const user = await this.getUserByUsername(username);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...profile };
    this.users.set(user.id, updatedUser);
    return updatedUser;
  }
  
  // Message management
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message = { id: this.nextId++, ...insertMessage, timestamp: new Date() } as Message;
    this.messages.set(message.id, message);
    return message;
  }
  
  async getMessagesByUsername(username: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => m.username === username);
  }
  
  // Technician management
  async createTechnician(insertTechnician: InsertTechnician): Promise<Technician> {
    const technician = { id: this.nextId++, ...insertTechnician } as Technician;
    this.technicians.set(technician.id, technician);
    return technician;
  }
  
  async getTechnician(id: number): Promise<Technician | undefined> {
    return this.technicians.get(id);
  }
  
  async getTechnicianByUserId(userId: number): Promise<Technician | undefined> {
    for (const technician of this.technicians.values()) {
      if (technician.userId === userId) return technician;
    }
    return undefined;
  }
  
  async updateTechnician(id: number, updates: Partial<InsertTechnician>): Promise<Technician> {
    const technician = this.technicians.get(id);
    if (!technician) throw new Error("Technician not found");
    const updatedTechnician = { ...technician, ...updates };
    this.technicians.set(id, updatedTechnician);
    return updatedTechnician;
  }
  
  async searchTechnicians(criteria: {
    skills?: string[];
    location?: string;
    serviceRadius?: number;
    availability?: boolean;
  }): Promise<Technician[]> {
    return Array.from(this.technicians.values()).filter(technician => {
      if (criteria.skills && !criteria.skills.some(skill => technician.skills.includes(skill))) {
        return false;
      }
      if (criteria.location && technician.location !== criteria.location) {
        return false;
      }
      if (criteria.availability !== undefined && technician.availability !== criteria.availability) {
        return false;
      }
      return true;
    });
  }
  
  // Service request management
  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const request = { id: this.nextId++, ...insertRequest, createdAt: new Date(), updatedAt: new Date() } as ServiceRequest;
    this.serviceRequests.set(request.id, request);
    return request;
  }
  
  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    return this.serviceRequests.get(id);
  }
  
  async getServiceRequestsByCustomer(customerId: number): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values()).filter(r => r.customerId === customerId);
  }
  
  async getServiceRequestsByTechnician(technicianId: number): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values()).filter(r => r.technicianId === technicianId);
  }
  
  async updateServiceRequestStatus(id: number, status: string, technicianId?: number): Promise<ServiceRequest> {
    const request = this.serviceRequests.get(id);
    if (!request) throw new Error("Service request not found");
    const updatedRequest = { ...request, status, technicianId, updatedAt: new Date() };
    this.serviceRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  
  // Job management
  async createJob(insertJob: InsertJob): Promise<Job> {
    const job = { id: this.nextId++, ...insertJob, createdAt: new Date(), updatedAt: new Date() } as Job;
    this.jobs.set(job.id, job);
    return job;
  }
  
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }
  
  async getJobsByCustomer(customerId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(j => j.customerId === customerId);
  }
  
  async getJobsByTechnician(technicianId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(j => j.technicianId === technicianId);
  }
  
  async updateJobStatus(id: number, status: string, updates?: Partial<Job>): Promise<Job> {
    const job = this.jobs.get(id);
    if (!job) throw new Error("Job not found");
    const updatedJob = { ...job, status, ...updates, updatedAt: new Date() };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }
  
  // Job updates
  async createJobUpdate(insertUpdate: InsertJobUpdate): Promise<JobUpdate> {
    const update = { id: this.nextId++, ...insertUpdate, timestamp: new Date() } as JobUpdate;
    this.jobUpdates.set(update.id, update);
    return update;
  }
  
  async getJobUpdates(jobId: number): Promise<JobUpdate[]> {
    return Array.from(this.jobUpdates.values()).filter(u => u.jobId === jobId);
  }
  
  // Support case management
  async createSupportCase(insertCase: InsertSupportCase): Promise<SupportCase> {
    const supportCase = { 
      id: this.nextId++, 
      ...insertCase, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startTime: new Date().toISOString(),
      totalDuration: 0,
      isFreeSupport: true,
      status: 'open'
    } as SupportCase;
    this.supportCases.set(supportCase.id, supportCase);
    return supportCase;
  }
  
  async getSupportCase(id: number): Promise<SupportCase | undefined> {
    return this.supportCases.get(id);
  }
  
  async getSupportCasesByCustomer(customerId: number): Promise<SupportCase[]> {
    return Array.from(this.supportCases.values()).filter(c => c.customerId === customerId);
  }
  
  async getSupportCasesByTechnician(technicianId: number): Promise<SupportCase[]> {
    return Array.from(this.supportCases.values()).filter(c => c.technicianId === technicianId);
  }
  
  async updateSupportCase(id: number, updates: Partial<SupportCase>): Promise<SupportCase> {
    const supportCase = this.supportCases.get(id);
    if (!supportCase) throw new Error("Support case not found");
    const updatedCase = { ...supportCase, ...updates, updatedAt: new Date().toISOString() };
    this.supportCases.set(id, updatedCase);
    return updatedCase;
  }
  
  async assignTechnicianToCase(caseId: number, technicianId: number): Promise<SupportCase> {
    const supportCase = this.supportCases.get(caseId);
    if (!supportCase) throw new Error("Support case not found");
    const updatedCase = { ...supportCase, technicianId, status: 'assigned', updatedAt: new Date().toISOString() };
    this.supportCases.set(caseId, updatedCase);
    return updatedCase;
  }
  
  async closeSupportCase(caseId: number, totalDuration: number): Promise<SupportCase> {
    const supportCase = this.supportCases.get(caseId);
    if (!supportCase) throw new Error("Support case not found");
    const updatedCase = { 
      ...supportCase, 
      status: 'closed', 
      totalDuration,
      endTime: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    };
    this.supportCases.set(caseId, updatedCase);
    return updatedCase;
  }
  
  // Support messages
  async createSupportMessage(insertMessage: InsertSupportMessage): Promise<SupportMessage> {
    const message = { 
      id: this.nextId++, 
      ...insertMessage, 
      timestamp: new Date().toISOString(),
      isRead: false,
      messageType: 'text'
    } as SupportMessage;
    this.supportMessages.set(message.id, message);
    return message;
  }
  
  async getSupportMessages(caseId: number): Promise<SupportMessage[]> {
    return Array.from(this.supportMessages.values()).filter(m => m.caseId === caseId);
  }
  
  async markMessageAsRead(messageId: number): Promise<void> {
    const message = this.supportMessages.get(messageId);
    if (message) {
      message.isRead = true;
      this.supportMessages.set(messageId, message);
    }
  }
  
  async getUnreadMessageCount(caseId: number, userId: number): Promise<number> {
    return Array.from(this.supportMessages.values())
      .filter(m => m.caseId === caseId && m.senderId !== userId && !m.isRead)
      .length;
  }

  // Enhanced technician methods
  async registerTechnician(technicianData: any): Promise<any> {
    const id = this.nextId++;
    const technician = {
      id,
      userId: technicianData.userId || 1, // Default for demo
      businessName: technicianData.businessName,
      companyName: technicianData.companyName,
      experience: technicianData.experience,
      hourlyRate: (technicianData.hourlyRatePercentage || technicianData.hourlyRate || 85).toString(),
      // Geographic location
      country: technicianData.country,
      state: technicianData.state,
      city: technicianData.city,
      location: technicianData.location, // Combined location string
      serviceRadius: technicianData.serviceRadius,
      serviceAreas: technicianData.serviceAreas || [],
      skills: technicianData.skills || [],
      categories: technicianData.categories || [],
      certifications: technicianData.certifications || [],
      languages: technicianData.languages || ["English"],
      availability: technicianData.availability || {},
      profileDescription: technicianData.profileDescription,
      rating: "5.00",
      completedJobs: 0,
      totalEarnings: "0.00",
      responseTime: technicianData.responseTime || 60,
      isActive: true,
      isVerified: false,
      verificationStatus: "pending",
      stripeAccountId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.technicians.set(id, technician);
    return technician;
  }

  async getTechnicianProfile(userId: number): Promise<any> {
    const technician = Array.from(this.technicians.values()).find(t => t.userId === userId);
    return technician || null;
  }

  async updateTechnicianAvailability(technicianId: number, isAvailable: boolean): Promise<any> {
    const technician = this.technicians.get(technicianId);
    if (technician) {
      technician.isActive = isAvailable;
      technician.updatedAt = new Date();
      this.technicians.set(technicianId, technician);
      return technician;
    }
    throw new Error("Technician not found");
  }

  async getTechnicianNotifications(technicianId: number): Promise<any[]> {
    // Mock notifications for demo
    return [
      {
        id: 1,
        title: "New Job Opportunity",
        message: "Hardware repair needed in your area",
        type: "new_job",
        isRead: false,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        serviceRequest: {
          id: 123,
          category: "Hardware Issues",
          serviceType: "onsite",
          location: "San Francisco, CA",
          budget: 150,
          urgency: "medium"
        }
      }
    ];
  }

  async acceptJob(technicianId: number, serviceRequestId: number): Promise<any> {
    // Mock job acceptance
    return { success: true, message: "Job accepted successfully" };
  }

  async declineJob(technicianId: number, serviceRequestId: number): Promise<any> {
    // Mock job decline
    return { success: true, message: "Job declined successfully" };
  }

  async getTechnicianEarnings(technicianId: number): Promise<any[]> {
    // Mock earnings data
    return [
      { month: "November", amount: 1200, jobs: 8 },
      { month: "December", amount: 1650, jobs: 11 },
      { month: "January", amount: 850, jobs: 5 }
    ];
  }

  // Admin dashboard methods
  async getAdminDashboardStats(): Promise<any> {
    const totalUsers = this.users.size;
    const totalTechnicians = this.technicians.size;
    const totalJobs = this.jobs.size;
    const activeJobs = Array.from(this.jobs.values()).filter(job => job.status === "in_progress").length;
    const completedJobs = Array.from(this.jobs.values()).filter(job => job.status === "completed").length;
    const totalRevenue = Array.from(this.jobs.values()).reduce((sum, job) => sum + parseFloat(job.totalCost || "0"), 0);
    
    return {
      totalUsers,
      totalTechnicians,
      activeJobs,
      completedJobs,
      totalRevenue: Math.round(totalRevenue),
      disputesClosed: 23,
      avgRating: 4.7
    };
  }

  async getAllUsers(): Promise<any[]> {
    return Array.from(this.users.values()).map(user => ({
      ...user,
      type: "customer",
      status: "active",
      totalSpent: Math.floor(Math.random() * 1000) + 100
    }));
  }

  async getAllTechnicians(): Promise<any[]> {
    return Array.from(this.technicians.values()).map(tech => ({
      ...tech,
      status: tech.isVerified ? "verified" : "pending",
      earnings: Math.floor(Math.random() * 20000) + 5000
    }));
  }

  async getAllJobs(): Promise<any[]> {
    return Array.from(this.jobs.values()).map(job => ({
      ...job,
      customer: "Customer Name",
      technician: "Technician Name",
      service: job.description || "General Support",
      amount: parseFloat(job.totalCost || "100"),
      created: job.createdAt?.toISOString() || new Date().toISOString()
    }));
  }

  async getAllDisputes(): Promise<any[]> {
    // Mock disputes data
    return [
      {
        id: 1,
        jobId: 3,
        customer: "Bob Wilson",
        technician: "Emma Wilson",
        reason: "Service not completed",
        status: "open",
        created: new Date().toISOString()
      },
      {
        id: 2,
        jobId: 15,
        customer: "Tom Johnson",
        technician: "Sarah Johnson",
        reason: "Billing issue",
        status: "resolved",
        created: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  async updateUserStatus(userId: number, status: string): Promise<any> {
    const user = this.users.get(userId);
    if (user) {
      // In a real implementation, you'd update the user status
      return { success: true, message: "User status updated" };
    }
    throw new Error("User not found");
  }

  async updateTechnicianStatus(technicianId: number, status: string): Promise<any> {
    const technician = this.technicians.get(technicianId);
    if (technician) {
      technician.isVerified = status === "verified";
      technician.updatedAt = new Date();
      this.technicians.set(technicianId, technician);
      return technician;
    }
    throw new Error("Technician not found");
  }

  async resolveDispute(disputeId: number, resolution: string): Promise<any> {
    // Mock dispute resolution
    return { success: true, message: "Dispute resolved", resolution };
  }

  async getTechnicianEarningSettings(): Promise<any[]> {
    // Mock data with realistic earning percentages
    return [
      {
        id: 1,
        technicianId: 1,
        technicianName: "John Smith",
        remoteEarningPercentage: 85.00,
        phoneEarningPercentage: 85.00,
        onsiteEarningPercentage: 85.00,
        performanceBonus: 5.00,
        loyaltyBonus: 2.00,
        premiumServiceRate: 0.00,
        adminNotes: "High performer, increased rates due to excellent reviews",
        effectiveDate: "2025-01-01",
        lastModifiedBy: 1,
        isActive: true,
        totalEarnings: 12500.00,
        completedJobs: 45,
        rating: 4.9
      },
      {
        id: 2,
        technicianId: 2,
        technicianName: "Sarah Johnson",
        remoteEarningPercentage: 80.00,
        phoneEarningPercentage: 82.00,
        onsiteEarningPercentage: 87.00,
        performanceBonus: 0.00,
        loyaltyBonus: 1.00,
        premiumServiceRate: 3.00,
        adminNotes: "Specialized in premium on-site services",
        effectiveDate: "2025-01-01",
        isActive: true,
        totalEarnings: 8750.00,
        completedJobs: 32,
        rating: 4.7
      },
      {
        id: 3,
        technicianId: 3,
        technicianName: "Mike Davis",
        remoteEarningPercentage: 85.00,
        phoneEarningPercentage: 85.00,
        onsiteEarningPercentage: 85.00,
        performanceBonus: 0.00,
        loyaltyBonus: 0.00,
        premiumServiceRate: 0.00,
        adminNotes: "",
        effectiveDate: "2025-01-01",
        isActive: true,
        totalEarnings: 5200.00,
        completedJobs: 18,
        rating: 4.5
      }
    ];
  }

  async getTechnicianEarningSetting(technicianId: number): Promise<any> {
    const settings = await this.getTechnicianEarningSettings();
    return settings.find(s => s.technicianId === technicianId);
  }

  async updateTechnicianEarningSettings(technicianId: number, settings: any): Promise<any> {
    // In real implementation, this would update the database
    console.log(`Updating earning settings for technician ${technicianId}:`, settings);
    
    return {
      id: technicianId,
      ...settings,
      effectiveDate: new Date().toISOString(),
      lastModifiedBy: 1, // Current admin user
      updatedAt: new Date().toISOString()
    };
  }

  async bulkUpdateTechnicianEarningSettings(technicianIds: number[], settings: any): Promise<any> {
    // In real implementation, this would update multiple records
    console.log(`Bulk updating earning settings for technicians ${technicianIds.join(", ")}:`, settings);
    
    return {
      updatedCount: technicianIds.length,
      technicianIds,
      settings,
      effectiveDate: new Date().toISOString(),
      lastModifiedBy: 1
    };
  }

  // Technician approval methods
  async approveTechnician(technicianId: number, adminId: number, notes?: string): Promise<any> {
    const technician = this.technicians.get(technicianId);
    if (!technician) {
      throw new Error("Technician not found");
    }

    technician.isVerified = true;
    technician.updatedAt = new Date();
    this.technicians.set(technicianId, technician);

    return {
      id: technicianId,
      technicianId,
      status: "approved",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      approvalNotes: notes,
      success: true
    };
  }

  async rejectTechnician(technicianId: number, adminId: number, reason: string): Promise<any> {
    const technician = this.technicians.get(technicianId);
    if (!technician) {
      throw new Error("Technician not found");
    }

    technician.isVerified = false;
    technician.updatedAt = new Date();
    this.technicians.set(technicianId, technician);

    return {
      id: technicianId,
      technicianId,
      status: "rejected",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      rejectionReason: reason,
      success: true
    };
  }

  async getTechnicianApprovalStatus(technicianId: number): Promise<any> {
    const technician = this.technicians.get(technicianId);
    if (!technician) {
      throw new Error("Technician not found");
    }

    return {
      technicianId,
      status: technician.isVerified ? "approved" : "pending",
      technician
    };
  }

  async getPendingTechnicianApprovals(): Promise<any[]> {
    const pending = [];
    for (const [id, technician] of this.technicians) {
      if (!technician.isVerified) {
        pending.push({
          technicianId: id,
          technician,
          status: "pending",
          createdAt: technician.createdAt
        });
      }
    }
    return pending;
  }

  async updateTechnicianApprovalStatus(technicianId: number, status: string, adminId: number, notes?: string): Promise<any> {
    if (status === "approved") {
      return this.approveTechnician(technicianId, adminId, notes);
    } else if (status === "rejected") {
      return this.rejectTechnician(technicianId, adminId, notes || "No reason provided");
    }
    throw new Error("Invalid status");
  }

  // Complaint management methods
  async createComplaint(complaint: any): Promise<any> {
    const id = Date.now();
    const newComplaint = {
      id,
      ...complaint,
      status: "pending",
      reportedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return newComplaint;
  }

  async getComplaint(id: number): Promise<any> {
    return {
      id,
      customerId: 1,
      technicianId: 1,
      jobId: 1,
      category: "behavior",
      title: "Unprofessional behavior",
      description: "Technician was rude and unprofessional during the service call.",
      severity: "medium",
      status: "investigating",
      priority: "high",
      reportedAt: new Date(Date.now() - 86400000),
      assignedTo: 1,
      investigationNotes: "Initial investigation started. Gathering evidence.",
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date()
    };
  }

  async getComplaintsByCustomer(customerId: number): Promise<any[]> {
    return [
      {
        id: 1,
        customerId,
        technicianId: 1,
        jobId: 1,
        category: "behavior",
        title: "Unprofessional behavior",
        status: "investigating",
        severity: "medium",
        reportedAt: new Date(Date.now() - 86400000)
      }
    ];
  }

  async getComplaintsByTechnician(technicianId: number): Promise<any[]> {
    return [
      {
        id: 1,
        customerId: 1,
        technicianId,
        jobId: 1,
        category: "behavior",
        title: "Unprofessional behavior",
        status: "investigating",
        severity: "medium",
        reportedAt: new Date(Date.now() - 86400000)
      }
    ];
  }

  async getAllComplaints(): Promise<any[]> {
    return [
      {
        id: 1,
        customerId: 1,
        technicianId: 1,
        jobId: 1,
        category: "behavior",
        title: "Unprofessional behavior",
        description: "Technician was rude during service",
        severity: "medium",
        status: "investigating",
        priority: "high",
        reportedAt: new Date(Date.now() - 86400000),
        assignedTo: 1,
        customerName: "John Doe",
        technicianName: "Tech Services Inc"
      },
      {
        id: 2,
        customerId: 2,
        technicianId: 2,
        jobId: 2,
        category: "quality",
        title: "Poor service quality",
        description: "Work was not completed properly",
        severity: "high",
        status: "pending",
        priority: "urgent",
        reportedAt: new Date(Date.now() - 172800000),
        customerName: "Jane Smith",
        technicianName: "Pro Tech Solutions"
      }
    ];
  }

  async updateComplaintStatus(id: number, status: string, adminId: number, notes?: string): Promise<any> {
    return {
      id,
      status,
      updatedBy: adminId,
      investigationNotes: notes,
      updatedAt: new Date()
    };
  }

  async assignComplaintInvestigator(id: number, investigatorId: number): Promise<any> {
    return {
      id,
      assignedTo: investigatorId,
      status: "investigating",
      updatedAt: new Date()
    };
  }

  async resolveComplaint(id: number, resolution: string, adminId: number): Promise<any> {
    return {
      id,
      status: "resolved",
      resolution,
      resolvedAt: new Date(),
      updatedBy: adminId,
      updatedAt: new Date()
    };
  }

  // Transportation management methods
  async addTechnicianTransportation(transportation: any): Promise<any> {
    const id = Date.now();
    const newTransportation = {
      id,
      ...transportation,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return newTransportation;
  }

  async getTechnicianTransportation(technicianId: number): Promise<any> {
    return {
      id: 1,
      technicianId,
      transportationMethod: "vehicle",
      vehicleType: "car",
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
      vehicleYear: 2020,
      vehicleColor: "Blue",
      licensePlate: "ABC123",
      insuranceProvider: "State Farm",
      insurancePolicyNumber: "SF123456789",
      insuranceExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      driversLicenseNumber: "DL123456789",
      driversLicenseExpiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateTechnicianTransportation(technicianId: number, updates: any): Promise<any> {
    return {
      technicianId,
      ...updates,
      updatedAt: new Date()
    };
  }

  async verifyTechnicianTransportation(technicianId: number, adminId: number, notes?: string): Promise<any> {
    return {
      technicianId,
      isVerified: true,
      verificationDate: new Date(),
      verificationNotes: notes,
      verifiedBy: adminId,
      updatedAt: new Date()
    };
  }

  // Background check methods
  async createBackgroundCheck(backgroundCheck: any): Promise<any> {
    const id = Date.now();
    const newCheck = {
      id,
      ...backgroundCheck,
      status: "pending",
      requestedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return newCheck;
  }

  async getBackgroundCheck(id: number): Promise<any> {
    return {
      id,
      technicianId: 1,
      checkType: "criminal",
      provider: "BackgroundCheck.com",
      status: "completed",
      result: "passed",
      score: 95,
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      details: {
        criminalRecord: "None found",
        creditCheck: "Excellent",
        employmentHistory: "Verified"
      },
      reviewedBy: 1,
      reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
  }

  async getTechnicianBackgroundChecks(technicianId: number): Promise<any[]> {
    return [
      {
        id: 1,
        technicianId,
        checkType: "criminal",
        status: "completed",
        result: "passed",
        score: 95,
        requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        technicianId,
        checkType: "employment",
        status: "pending",
        requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  async updateBackgroundCheckStatus(id: number, status: string, result?: string, adminId?: number): Promise<any> {
    return {
      id,
      status,
      result,
      reviewedBy: adminId,
      reviewedAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getAllPendingBackgroundChecks(): Promise<any[]> {
    return [
      {
        id: 1,
        technicianId: 1,
        technicianName: "Tech Services Inc",
        checkType: "criminal",
        status: "pending",
        requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        technicianId: 2,
        technicianName: "Pro Tech Solutions",
        checkType: "employment",
        status: "in_progress",
        requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];
  }
}

export const storage = new MemoryStorage();