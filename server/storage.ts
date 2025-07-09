import { 
  users, messages, technicians, serviceRequests, jobs, jobUpdates, supportCases, supportMessages, issueCategories,
  bookingSettings, serviceBookings, disputes, disputeMessages, disputeAttachments,
  type User, type InsertUser, type UpdateProfile, type Message, type InsertMessage,
  type Technician, type InsertTechnician, type ServiceRequest, type InsertServiceRequest,
  type Job, type InsertJob, type JobUpdate, type InsertJobUpdate,
  type SupportCase, type InsertSupportCase, type SupportMessage, type InsertSupportMessage,
  type IssueCategory, type InsertIssueCategory, type BookingSettings, type InsertBookingSettings,
  type ServiceBooking, type InsertServiceBooking, type Dispute, type InsertDispute,
  type DisputeMessage, type InsertDisputeMessage, type DisputeAttachment, type InsertDisputeAttachment
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

  // Enhanced job management methods
  getJobsWithFilters(filters: {
    timeframe?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<any>;
  getCategorizedJobs(): Promise<any>;
  getJobById(jobId: number): Promise<any>;
  updateJobStatus(jobId: number, status: string, adminNotes?: string): Promise<any>;
  createComplaint(complaint: any): Promise<any>;
  createInvestigation(investigation: any): Promise<any>;
  processRefund(refund: any): Promise<any>;
  createCoupon(coupon: any): Promise<any>;
  createPenalty(penalty: any): Promise<any>;
  updateJobCase(jobId: number, caseAction: string, caseNotes?: string): Promise<any>;

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

  // Booking settings management
  getBookingSettings(): Promise<BookingSettings>;
  updateBookingSettings(settings: Partial<InsertBookingSettings>): Promise<BookingSettings>;

  // Service bookings management
  createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking>;
  getServiceBooking(id: number): Promise<ServiceBooking | undefined>;
  getServiceBookingsByCustomer(customerId: number): Promise<ServiceBooking[]>;
  updateServiceBooking(id: number, updates: Partial<ServiceBooking>): Promise<ServiceBooking>;

  // Dispute management
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  getDispute(id: number): Promise<Dispute | undefined>;
  getDisputesByStatus(status: string): Promise<Dispute[]>;
  getDisputesByCustomer(customerId: number): Promise<Dispute[]>;
  getDisputesByTechnician(technicianId: number): Promise<Dispute[]>;
  updateDisputeStatus(id: number, status: string, adminId?: number): Promise<Dispute>;
  assignDisputeToAdmin(id: number, adminId: number): Promise<Dispute>;
  getAllDisputes(): Promise<Dispute[]>;
  getDisputeAnalytics(): Promise<any>;
  
  // Dispute messages
  createDisputeMessage(message: InsertDisputeMessage): Promise<DisputeMessage>;
  getDisputeMessages(disputeId: number): Promise<DisputeMessage[]>;
  markDisputeMessageAsRead(messageId: number): Promise<void>;
  
  // Dispute attachments
  createDisputeAttachment(attachment: InsertDisputeAttachment): Promise<DisputeAttachment>;
  getDisputeAttachments(disputeId: number): Promise<DisputeAttachment[]>;
  deleteDisputeAttachment(id: number): Promise<void>;
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
  private serviceBookings: Map<number, ServiceBooking> = new Map();
  
  private nextId = 1;

  constructor() {
    // Initialize with sample data for demo
    console.log("MemoryStorage constructor called - initializing sample data...");
    this.initializeSampleData();
    console.log(`After initialization: ${this.technicians.size} technicians loaded`);
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
        id: 1, userId: 1, firstName: "John", lastName: "Doe", email: "john@example.com", 
        phoneNumber: "+1-555-123-4567", address: "123 Main St, San Francisco, CA 94105",
        businessName: "TechFix Pro", companyName: "TechFix Solutions", 
        experience: "5+ years", hourlyRate: "85", 
        country: "United States", state: "California", city: "San Francisco",
        location: "San Francisco, CA", 
        serviceRadius: 25, serviceAreas: ["San Francisco", "Oakland"], 
        skills: ["Hardware Repair", "Network Setup", "Software Installation"], 
        categories: ["Hardware Issues", "Network Troubleshooting"], 
        certifications: ["CompTIA A+", "Cisco CCNA"], languages: ["English", "Spanish"],
        availability: { monday: "9-17", tuesday: "9-17", wednesday: "9-17" },
        profileDescription: "Expert in hardware and network solutions", rating: "4.9",
        completedJobs: 245, totalEarnings: "18750", responseTime: 30, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        remoteEarningPercentage: "85.00", phoneEarningPercentage: "85.00", onsiteEarningPercentage: "85.00",
        stripeAccountId: null, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 2, userId: 5, firstName: "Sarah", lastName: "Johnson", email: "sarah@example.com",
        phoneNumber: "+1-555-234-5678", address: "456 Tech Ave, New York, NY 10001",
        businessName: "Code Solutions", companyName: "Mike Chen Tech", 
        experience: "7+ years", hourlyRate: "95", 
        country: "United States", state: "New York", city: "New York",
        location: "New York, NY", 
        serviceRadius: 30, serviceAreas: ["Manhattan", "Brooklyn"], 
        skills: ["Web Development", "Database Management", "System Administration"], 
        categories: ["Web Development", "Database Help"], 
        certifications: ["AWS Certified", "Microsoft Certified"], languages: ["English", "Mandarin"],
        availability: { monday: "8-18", tuesday: "8-18", wednesday: "8-18" },
        profileDescription: "Full-stack developer and system architect", rating: "4.8",
        completedJobs: 198, totalEarnings: "15840", responseTime: 45, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        remoteEarningPercentage: "85.00", phoneEarningPercentage: "85.00", onsiteEarningPercentage: "85.00",
        stripeAccountId: null, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 3, userId: 6, firstName: "Mike", lastName: "Chen", email: "mike@example.com",
        phoneNumber: "+1-555-345-6789", address: "789 Support Blvd, Austin, TX 78701",
        businessName: "TechSupport Plus", companyName: "Chen Solutions", 
        experience: "3+ years", hourlyRate: "75", 
        country: "United States", state: "Texas", city: "Austin",
        location: "Austin, TX", 
        serviceRadius: 20, serviceAreas: ["Austin", "Round Rock"], 
        skills: ["Mobile Device Repair", "Software Troubleshooting", "Network Setup"], 
        categories: ["Mobile Devices", "Software Issues"], 
        certifications: ["Apple Certified", "Android Certified"], languages: ["English"],
        availability: { monday: "10-18", tuesday: "10-18", wednesday: "10-18" },
        profileDescription: "Mobile device specialist and software expert", rating: "4.7",
        completedJobs: 125, totalEarnings: "9375", responseTime: 40, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        remoteEarningPercentage: "85.00", phoneEarningPercentage: "85.00", onsiteEarningPercentage: "85.00",
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
    const technician: Technician = {
      id: this.nextId++,
      userId: insertTechnician.userId,
      // Personal Information
      firstName: insertTechnician.firstName,
      lastName: insertTechnician.lastName,
      email: insertTechnician.email,
      phoneNumber: insertTechnician.phoneNumber,
      address: insertTechnician.address,
      // Business Information
      businessName: insertTechnician.businessName || "",
      companyName: insertTechnician.companyName || "",
      experience: insertTechnician.experience,
      hourlyRate: insertTechnician.hourlyRate || "0",
      // Geographic location
      country: insertTechnician.country || "",
      state: insertTechnician.state || "",
      city: insertTechnician.city || "",
      location: insertTechnician.location || "",
      serviceRadius: insertTechnician.serviceRadius || 25,
      serviceAreas: insertTechnician.serviceAreas || [],
      // Vehicle Information
      vehicleType: insertTechnician.vehicleType || null,
      vehicleMake: insertTechnician.vehicleMake || null,
      vehicleModel: insertTechnician.vehicleModel || null,
      vehicleYear: insertTechnician.vehicleYear || null,
      vehicleLicensePlate: insertTechnician.vehicleLicensePlate || null,
      // Document URLs
      backgroundCheckUrl: insertTechnician.backgroundCheckUrl || null,
      driverLicenseUrl: insertTechnician.driverLicenseUrl || null,
      insuranceUrl: insertTechnician.insuranceUrl || null,
      // Skills and certifications
      skills: insertTechnician.skills || [],
      categories: insertTechnician.categories || [],
      certifications: insertTechnician.certifications || [],
      languages: insertTechnician.languages || ["English"],
      availability: insertTechnician.availability || {},
      profileDescription: insertTechnician.profileDescription || "",
      responseTime: insertTechnician.responseTime || 60,
      rating: "5.00",
      completedJobs: 0,
      totalEarnings: "0.00",
      // Status and verification - default to false until admin approval
      isActive: false,
      isVerified: false,
      verificationStatus: "pending",
      adminNotes: null,
      verifiedBy: null,
      verifiedAt: null,
      stripeAccountId: null,
      remoteEarningPercentage: "85.00",
      phoneEarningPercentage: "85.00",
      onsiteEarningPercentage: "85.00",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
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

  // Booking settings management
  async getBookingSettings(): Promise<BookingSettings> {
    // Return default settings if not configured
    return {
      id: 1,
      sameDayFee: "20.00",
      futureDayFee: "30.00",
      immediateWorkAllowed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateBookingSettings(settings: Partial<InsertBookingSettings>): Promise<BookingSettings> {
    const existing = await this.getBookingSettings();
    return {
      ...existing,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
  }

  // Service bookings management
  async createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking> {
    const newBooking: ServiceBooking = {
      id: this.nextId++,
      customerId: booking.customerId,
      technicianId: booking.technicianId || null,
      categoryId: booking.categoryId,
      description: booking.description,
      deviceType: booking.deviceType || null,
      previousAttempts: booking.previousAttempts || null,
      expectedBehavior: booking.expectedBehavior || null,
      urgency: booking.urgency || "medium",
      serviceType: booking.serviceType || "onsite",
      scheduledDate: booking.scheduledDate || null,
      location: booking.location || null,
      status: "pending",
      bookingFee: booking.bookingFee || "0.00",
      estimatedCost: booking.estimatedCost || null,
      actualCost: null,
      aiAnalysis: booking.aiAnalysis || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.serviceBookings.set(newBooking.id, newBooking);
    return newBooking;
  }

  async getServiceBooking(id: number): Promise<ServiceBooking | undefined> {
    return this.serviceBookings.get(id);
  }

  async getServiceBookingsByCustomer(customerId: number): Promise<ServiceBooking[]> {
    return Array.from(this.serviceBookings.values()).filter(
      booking => booking.customerId === customerId
    );
  }

  async updateServiceBooking(id: number, updates: Partial<ServiceBooking>): Promise<ServiceBooking> {
    const existing = this.serviceBookings.get(id);
    if (!existing) {
      throw new Error("Booking not found");
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.serviceBookings.set(id, updated);
    return updated;
  }

  // Enhanced technician methods
  async registerTechnician(technicianData: any): Promise<any> {
    const id = this.nextId++;
    const technician = {
      id,
      userId: technicianData.userId || 1, // Default for demo
      // Personal Information
      firstName: technicianData.firstName,
      lastName: technicianData.lastName,
      email: technicianData.email,
      phoneNumber: technicianData.phoneNumber,
      address: technicianData.address,
      // Business Information
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
      // Vehicle Information
      vehicleType: technicianData.vehicleType,
      vehicleMake: technicianData.vehicleMake,
      vehicleModel: technicianData.vehicleModel,
      vehicleYear: technicianData.vehicleYear,
      vehicleLicensePlate: technicianData.vehicleLicensePlate,
      // Document URLs
      backgroundCheckUrl: technicianData.backgroundCheckUrl,
      driverLicenseUrl: technicianData.driverLicenseUrl,
      insuranceUrl: technicianData.insuranceUrl,
      // Skills and certifications
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
      // Status and verification - default to inactive until admin approval
      isActive: false,
      isVerified: false,
      verificationStatus: "pending",
      stripeAccountId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.technicians.set(id, technician);
    console.log(`Registered new technician with ID ${id}:`, technician);
    console.log(`Total technicians now: ${this.technicians.size}`);
    return technician;
  }

  async getTechnicianProfile(userId: number): Promise<any> {
    return await this.getTechnicianByUserId(userId);
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
    const allTechnicians = Array.from(this.technicians.values()).map(tech => ({
      ...tech,
      status: tech.isVerified ? "verified" : "pending",
      earnings: Math.floor(Math.random() * 20000) + 5000
    }));
    console.log(`getAllTechnicians called, returning ${allTechnicians.length} technicians:`, allTechnicians.map(t => ({ id: t.id, businessName: t.businessName, location: t.location })));
    return allTechnicians;
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

  // Issue categories management
  async getIssueCategories(): Promise<IssueCategory[]> {
    return [
      { 
        id: 1, 
        name: 'Hardware Issues', 
        description: 'Computer, laptop, and device hardware problems', 
        subcategories: ['Computer not starting', 'Overheating', 'Hardware failure', 'Peripheral issues', 'Memory problems', 'Hard drive issues', 'Graphics card problems'],
        commonSymptoms: ['Blue screen', 'Slow performance', 'Overheating', 'Strange noises', 'Hardware not recognized', 'System crashes', 'Boot failures'],
        estimatedDuration: '1-3 hours',
        difficulty: 'intermediate',
        basePrice: '$50-150',
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 2, 
        name: 'Software Problems', 
        description: 'Application and software troubleshooting', 
        subcategories: ['Software installation', 'Application crashes', 'Performance issues', 'Compatibility problems', 'License issues', 'Updates failing', 'Configuration problems'],
        commonSymptoms: ['Application crashes', 'Slow performance', 'Error messages', 'Installation failures', 'Compatibility issues', 'Update problems', 'Settings not saving'],
        estimatedDuration: '30 minutes - 2 hours',
        difficulty: 'basic',
        basePrice: '$30-80',
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 3, 
        name: 'Network Issues', 
        description: 'Internet, WiFi, and network connectivity problems', 
        subcategories: ['WiFi connection', 'Internet slow', 'Network setup', 'Router problems', 'VPN issues', 'Firewall configuration', 'Network sharing'],
        commonSymptoms: ['No internet connection', 'Slow speeds', 'Connection drops', 'Cannot connect to WiFi', 'Network not found', 'DNS errors', 'Timeout errors'],
        estimatedDuration: '30 minutes - 2 hours',
        difficulty: 'intermediate',
        basePrice: '$40-100',
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 4, 
        name: 'Security Questions', 
        description: 'Cybersecurity and data protection issues', 
        subcategories: ['Virus removal', 'Malware cleanup', 'Password recovery', 'Security setup', 'Data encryption', 'Privacy settings', 'Identity protection'],
        commonSymptoms: ['Slow performance', 'Pop-up ads', 'Suspicious activity', 'Account compromised', 'Files encrypted', 'Unusual network activity', 'Security warnings'],
        estimatedDuration: '1-4 hours',
        difficulty: 'advanced',
        basePrice: '$60-200',
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 5, 
        name: 'Mobile Device Help', 
        description: 'Smartphone and tablet support', 
        subcategories: ['Device setup', 'App problems', 'Battery issues', 'Storage full', 'Update problems', 'Sync issues', 'Performance optimization'],
        commonSymptoms: ['Battery draining fast', 'Apps crashing', 'Storage full', 'Slow performance', 'Sync problems', 'Update failures', 'Connection issues'],
        estimatedDuration: '30 minutes - 1 hour',
        difficulty: 'basic',
        basePrice: '$25-60',
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 6, 
        name: 'Email & Communication', 
        description: 'Email setup and communication tools', 
        subcategories: ['Email setup', 'Email not working', 'Spam issues', 'Calendar sync', 'Contacts sync', 'Video calling', 'Messaging apps'],
        commonSymptoms: ['Cannot send emails', 'Not receiving emails', 'Sync problems', 'Login issues', 'Spam emails', 'Calendar not updating', 'Connection problems'],
        estimatedDuration: '30 minutes - 1 hour',
        difficulty: 'basic',
        basePrice: '$30-70',
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 7, 
        name: 'Printer Support', 
        description: 'Printer setup and troubleshooting', 
        subcategories: ['Printer setup', 'Print quality issues', 'Connection problems', 'Driver installation', 'Paper jams', 'Ink/toner issues', 'Wireless printing'],
        commonSymptoms: ['Printer not found', 'Poor print quality', 'Paper jams', 'Ink errors', 'Connection issues', 'Driver problems', 'Print jobs stuck'],
        estimatedDuration: '30 minutes - 1.5 hours',
        difficulty: 'basic',
        basePrice: '$35-80',
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 8, 
        name: 'Data Recovery', 
        description: 'File recovery and data backup assistance', 
        subcategories: ['Deleted files', 'Corrupted files', 'Hard drive failure', 'Backup setup', 'Cloud storage', 'File transfer', 'Data migration'],
        commonSymptoms: ['Files missing', 'Cannot access files', 'Corrupted data', 'Hard drive not recognized', 'Backup failures', 'Cloud sync issues', 'Data loss'],
        estimatedDuration: '1-6 hours',
        difficulty: 'advanced',
        basePrice: '$80-300',
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 9, 
        name: 'General Tech Support', 
        description: 'Other technical issues and questions', 
        subcategories: ['General questions', 'Device recommendations', 'Software recommendations', 'Setup assistance', 'Training', 'Consultation', 'Other issues'],
        commonSymptoms: ['Need guidance', 'Want recommendations', 'Setup help needed', 'Training required', 'General questions', 'Consultation needed', 'Other problems'],
        estimatedDuration: '30 minutes - 2 hours',
        difficulty: 'basic',
        basePrice: '$25-100',
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      }
    ];
  }

  async createIssueCategory(category: InsertIssueCategory): Promise<IssueCategory> {
    const newCategory = {
      id: this.nextId++,
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    } as IssueCategory;
    return newCategory;
  }

  async updateIssueCategory(id: number, category: Partial<InsertIssueCategory>): Promise<IssueCategory> {
    const categories = await this.getIssueCategories();
    const existingCategory = categories.find(c => c.id === id);
    if (!existingCategory) throw new Error('Category not found');
    
    const updatedCategory = {
      ...existingCategory,
      ...category,
      updatedAt: new Date()
    };
    return updatedCategory;
  }

  async deleteIssueCategory(id: number): Promise<boolean> {
    return true; // Mock implementation
  }

  // Enhanced job management methods
  async getJobsWithFilters(filters: {
    timeframe?: string;
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const mockJobs = this.generateMockJobs();
    let filteredJobs = mockJobs;

    // Apply timeframe filter
    if (filters.timeframe && filters.timeframe !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (filters.timeframe) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          startDate.setDate(now.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'yearly':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredJobs = filteredJobs.filter(job => 
        new Date(job.createdAt) >= startDate
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === filters.status);
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.category === filters.category);
    }

    // Apply search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredJobs = filteredJobs.filter(job => 
        job.jobNumber.toLowerCase().includes(searchTerm) ||
        job.customer.toLowerCase().includes(searchTerm) ||
        job.technician.toLowerCase().includes(searchTerm) ||
        job.category.toLowerCase().includes(searchTerm) ||
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      jobs: filteredJobs.slice(startIndex, endIndex),
      totalCount: filteredJobs.length,
      page,
      limit,
      totalPages: Math.ceil(filteredJobs.length / limit)
    };
  }

  async getCategorizedJobs(): Promise<any> {
    const mockJobs = this.generateMockJobs();
    const now = new Date();
    
    const categorizeByTime = (jobs: any[]) => {
      const today = jobs.filter(job => {
        const jobDate = new Date(job.createdAt);
        return jobDate.toDateString() === now.toDateString();
      });

      const yesterday = jobs.filter(job => {
        const jobDate = new Date(job.createdAt);
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(now.getDate() - 1);
        return jobDate.toDateString() === yesterdayDate.toDateString();
      });

      const weekly = jobs.filter(job => {
        const jobDate = new Date(job.createdAt);
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return jobDate >= weekAgo && jobDate < now;
      });

      const monthly = jobs.filter(job => {
        const jobDate = new Date(job.createdAt);
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return jobDate >= monthAgo && jobDate < now;
      });

      const yearly = jobs.filter(job => {
        const jobDate = new Date(job.createdAt);
        const yearAgo = new Date(now);
        yearAgo.setFullYear(now.getFullYear() - 1);
        return jobDate >= yearAgo && jobDate < now;
      });

      return { today, yesterday, weekly, monthly, yearly };
    };

    return categorizeByTime(mockJobs);
  }

  async getJobById(jobId: number): Promise<any> {
    const mockJobs = this.generateMockJobs();
    const job = mockJobs.find(j => j.id === jobId);
    
    if (!job) {
      throw new Error("Job not found");
    }

    return {
      ...job,
      details: {
        timeline: [
          { event: "Job Created", timestamp: job.createdAt, status: "info" },
          { event: "Technician Assigned", timestamp: job.assignedAt, status: "success" },
          { event: "Work Started", timestamp: job.startedAt, status: "info" },
          { event: "Work Completed", timestamp: job.completedAt, status: "success" }
        ],
        payments: [
          { type: "Service Fee", amount: job.amount, status: "paid" },
          { type: "Platform Fee", amount: job.amount * 0.15, status: "processed" }
        ],
        communications: [
          { type: "Initial Contact", timestamp: job.createdAt, from: "customer" },
          { type: "Job Acceptance", timestamp: job.assignedAt, from: "technician" },
          { type: "Status Update", timestamp: job.startedAt, from: "technician" }
        ]
      }
    };
  }

  async updateJobStatus(jobId: number, status: string, adminNotes?: string): Promise<any> {
    return {
      id: jobId,
      status,
      adminNotes,
      updatedAt: new Date(),
      success: true
    };
  }

  async createInvestigation(investigation: any): Promise<any> {
    const id = Date.now();
    return {
      id,
      ...investigation,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "open"
    };
  }

  async processRefund(refund: any): Promise<any> {
    const id = Date.now();
    return {
      id,
      ...refund,
      processedAt: new Date(),
      status: "pending",
      refundReference: `REF-${id}`
    };
  }

  async createCoupon(coupon: any): Promise<any> {
    const id = Date.now();
    return {
      id,
      ...coupon,
      createdAt: new Date(),
      isActive: true,
      usageCount: 0
    };
  }

  async createPenalty(penalty: any): Promise<any> {
    const id = Date.now();
    return {
      id,
      ...penalty,
      createdAt: new Date(),
      status: "pending",
      penaltyReference: `PEN-${id}`
    };
  }

  async updateJobCase(jobId: number, caseAction: string, caseNotes?: string): Promise<any> {
    return {
      jobId,
      caseAction,
      caseNotes,
      updatedAt: new Date(),
      success: true
    };
  }

  // Dispute management methods
  private disputes = new Map<number, Dispute>();
  private disputeMessages = new Map<number, DisputeMessage[]>();
  private disputeAttachments = new Map<number, DisputeAttachment[]>();
  private disputeIdCounter = 1;

  async createDispute(dispute: InsertDispute): Promise<Dispute> {
    const id = this.disputeIdCounter++;
    const newDispute: Dispute = {
      id,
      ...dispute,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: dispute.status || 'new',
      priority: dispute.priority || 'medium',
      assignedAdminId: dispute.assignedAdminId || null,
      resolutionNotes: dispute.resolutionNotes || null,
      resolvedAt: dispute.resolvedAt || null,
      escalatedAt: dispute.escalatedAt || null,
      estimatedResolutionTime: dispute.estimatedResolutionTime || null,
      attachmentCount: dispute.attachmentCount || 0,
      lastResponseAt: dispute.lastResponseAt || null,
      responseTime: dispute.responseTime || null,
      satisfactionRating: dispute.satisfactionRating || null,
      tags: dispute.tags || null,
      internalNotes: dispute.internalNotes || null,
      requiresManagerApproval: dispute.requiresManagerApproval || false,
      isPublic: dispute.isPublic || true,
      metadata: dispute.metadata || null
    };
    
    this.disputes.set(id, newDispute);
    this.disputeMessages.set(id, []);
    this.disputeAttachments.set(id, []);
    
    return newDispute;
  }

  async getDispute(id: number): Promise<Dispute | undefined> {
    return this.disputes.get(id);
  }

  async getDisputesByStatus(status: string): Promise<Dispute[]> {
    return Array.from(this.disputes.values()).filter(dispute => dispute.status === status);
  }

  async getDisputesByCustomer(customerId: number): Promise<Dispute[]> {
    return Array.from(this.disputes.values()).filter(dispute => dispute.customerId === customerId);
  }

  async getDisputesByTechnician(technicianId: number): Promise<Dispute[]> {
    return Array.from(this.disputes.values()).filter(dispute => dispute.technicianId === technicianId);
  }

  async updateDisputeStatus(id: number, status: string, adminId?: number): Promise<Dispute> {
    const dispute = this.disputes.get(id);
    if (!dispute) {
      throw new Error('Dispute not found');
    }
    
    const updatedDispute = {
      ...dispute,
      status,
      updatedAt: new Date(),
      assignedAdminId: adminId || dispute.assignedAdminId,
      resolvedAt: status === 'resolved' ? new Date() : dispute.resolvedAt
    };
    
    this.disputes.set(id, updatedDispute);
    return updatedDispute;
  }

  async assignDisputeToAdmin(id: number, adminId: number): Promise<Dispute> {
    const dispute = this.disputes.get(id);
    if (!dispute) {
      throw new Error('Dispute not found');
    }
    
    const updatedDispute = {
      ...dispute,
      assignedAdminId: adminId,
      updatedAt: new Date()
    };
    
    this.disputes.set(id, updatedDispute);
    return updatedDispute;
  }

  async getAllDisputes(): Promise<Dispute[]> {
    return Array.from(this.disputes.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getDisputeAnalytics(): Promise<any> {
    const disputes = Array.from(this.disputes.values());
    const total = disputes.length;
    const byStatus = disputes.reduce((acc, dispute) => {
      acc[dispute.status] = (acc[dispute.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const averageResolutionTime = disputes
      .filter(d => d.resolvedAt)
      .reduce((acc, d) => acc + (new Date(d.resolvedAt!).getTime() - new Date(d.createdAt).getTime()), 0) / 
      disputes.filter(d => d.resolvedAt).length;
    
    return {
      total,
      byStatus,
      averageResolutionTime: averageResolutionTime || 0,
      recentDisputes: disputes.slice(0, 5)
    };
  }

  // Dispute messages
  async createDisputeMessage(message: InsertDisputeMessage): Promise<DisputeMessage> {
    const id = Date.now() + Math.random();
    const newMessage: DisputeMessage = {
      id,
      ...message,
      createdAt: new Date(),
      isRead: false,
      messageType: message.messageType || 'text',
      priority: message.priority || 'normal',
      isInternal: message.isInternal || false,
      parentMessageId: message.parentMessageId || null,
      attachments: message.attachments || null,
      metadata: message.metadata || null
    };
    
    const messages = this.disputeMessages.get(message.disputeId) || [];
    messages.push(newMessage);
    this.disputeMessages.set(message.disputeId, messages);
    
    return newMessage;
  }

  async getDisputeMessages(disputeId: number): Promise<DisputeMessage[]> {
    return this.disputeMessages.get(disputeId) || [];
  }

  async markDisputeMessageAsRead(messageId: number): Promise<void> {
    for (const messages of this.disputeMessages.values()) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.isRead = true;
        break;
      }
    }
  }

  // Dispute attachments
  async createDisputeAttachment(attachment: InsertDisputeAttachment): Promise<DisputeAttachment> {
    const id = Date.now() + Math.random();
    const newAttachment: DisputeAttachment = {
      id,
      ...attachment,
      createdAt: new Date(),
      isPublic: attachment.isPublic || true,
      metadata: attachment.metadata || null
    };
    
    const attachments = this.disputeAttachments.get(attachment.disputeId) || [];
    attachments.push(newAttachment);
    this.disputeAttachments.set(attachment.disputeId, attachments);
    
    return newAttachment;
  }

  async getDisputeAttachments(disputeId: number): Promise<DisputeAttachment[]> {
    return this.disputeAttachments.get(disputeId) || [];
  }

  async deleteDisputeAttachment(id: number): Promise<void> {
    for (const [disputeId, attachments] of this.disputeAttachments.entries()) {
      const index = attachments.findIndex(a => a.id === id);
      if (index !== -1) {
        attachments.splice(index, 1);
        this.disputeAttachments.set(disputeId, attachments);
        break;
      }
    }
  }

  private generateMockJobs(): any[] {
    const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    const categories = ['Hardware Issues', 'Software Issues', 'Network Troubleshooting', 'Web Development', 'Database Help'];
    const jobs = [];

    for (let i = 1; i <= 100; i++) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 365));
      
      const job = {
        id: i,
        jobNumber: `JOB-${String(i).padStart(4, '0')}`,
        customer: `Customer ${i}`,
        technician: `Technician ${Math.floor(Math.random() * 10) + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        title: `Job ${i} - Technical Support`,
        description: `Technical support job for ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
        amount: Math.floor(Math.random() * 500) + 50,
        duration: Math.floor(Math.random() * 240) + 30,
        createdAt: createdAt.toISOString(),
        assignedAt: new Date(createdAt.getTime() + 3600000).toISOString(),
        startedAt: new Date(createdAt.getTime() + 7200000).toISOString(),
        completedAt: new Date(createdAt.getTime() + 14400000).toISOString(),
        customerEmail: `customer${i}@example.com`,
        technicianEmail: `technician${Math.floor(Math.random() * 10) + 1}@example.com`,
        rating: Math.floor(Math.random() * 5) + 1,
        feedback: `Feedback for job ${i}`,
        location: `Location ${i}`,
        serviceType: ['remote', 'phone', 'onsite'][Math.floor(Math.random() * 3)]
      };
      
      jobs.push(job);
    }

    return jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const storage = new MemoryStorage();