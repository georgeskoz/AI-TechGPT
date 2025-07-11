import { 
  users, messages, technicians, serviceRequests, jobs, jobUpdates, supportCases, supportMessages, issueCategories,
  bookingSettings, serviceBookings, disputes, disputeMessages, disputeAttachments, diagnosticTools, announcements,
  type User, type InsertUser, type UpdateProfile, type Message, type InsertMessage,
  type Technician, type InsertTechnician, type ServiceRequest, type InsertServiceRequest,
  type Job, type InsertJob, type JobUpdate, type InsertJobUpdate,
  type SupportCase, type InsertSupportCase, type SupportMessage, type InsertSupportMessage,
  type IssueCategory, type InsertIssueCategory, type BookingSettings, type InsertBookingSettings,
  type ServiceBooking, type InsertServiceBooking, type Dispute, type InsertDispute,
  type DisputeMessage, type InsertDisputeMessage, type DisputeAttachment, type InsertDisputeAttachment,
  type DiagnosticTool, type InsertDiagnosticTool, type Announcement, type InsertAnnouncement
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

  // Diagnostic tools management
  getAllDiagnosticTools(): Promise<DiagnosticTool[]>;
  getDiagnosticTool(id: string): Promise<DiagnosticTool | undefined>;
  createDiagnosticTool(tool: InsertDiagnosticTool): Promise<DiagnosticTool>;
  updateDiagnosticTool(id: string, updates: Partial<InsertDiagnosticTool>): Promise<DiagnosticTool>;
  deleteDiagnosticTool(id: string): Promise<void>;
  toggleDiagnosticTool(id: string, isActive: boolean): Promise<DiagnosticTool>;

  // Regional announcements management
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement>;
  deleteAnnouncement(id: number): Promise<void>;
  toggleAnnouncementStatus(id: number, isActive: boolean): Promise<Announcement>;
  getActiveAnnouncementsByRegion(region: string): Promise<Announcement[]>;

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
  
  // Support ticket management
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTicket(id: number): Promise<SupportTicket | undefined>;
  getSupportTicketsByUser(userId: number): Promise<SupportTicket[]>;
  updateSupportTicketStatus(id: number, status: string): Promise<SupportTicket>;
  
  // Support ticket message management
  createSupportTicketMessage(message: InsertSupportTicketMessage): Promise<SupportTicketMessage>;
  getSupportTicketMessages(ticketId: number): Promise<SupportTicketMessage[]>;
  
  // Support ticket attachment management
  createSupportTicketAttachment(attachment: InsertSupportTicketAttachment): Promise<SupportTicketAttachment>;
  getSupportTicketAttachments(ticketId: number): Promise<SupportTicketAttachment[]>;
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

  // Platform management console methods
  
  // Platform Settings
  getPlatformSettings(): Promise<any[]>;
  updatePlatformSetting(id: number, data: any): Promise<any>;
  
  // Tax Jurisdictions
  getTaxJurisdictions(): Promise<any[]>;
  createTaxJurisdiction(data: any): Promise<any>;
  updateTaxJurisdiction(id: number, data: any): Promise<any>;
  
  // Admin Panel Configuration
  getAdminPanelConfig(): Promise<any[]>;
  updateAdminPanelConfig(id: number, data: any): Promise<any>;

  // Notification management
  getNotifications(filters: {
    category?: string;
    priority?: string;
    read?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  createNotification(notification: any): Promise<any>;
  markNotificationAsRead(notificationId: string): Promise<any>;
  archiveNotification(notificationId: string): Promise<any>;
  deleteNotification(notificationId: string): Promise<void>;
  bulkUpdateNotifications(action: string, notificationIds: string[]): Promise<any>;
  getNotificationStats(): Promise<any>;
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
  private supportTickets: Map<number, SupportTicket> = new Map();
  private supportTicketMessages: Map<number, SupportTicketMessage> = new Map();
  private supportTicketAttachments: Map<number, SupportTicketAttachment> = new Map();
  private serviceBookings: Map<number, ServiceBooking> = new Map();
  private diagnosticTools: Map<string, DiagnosticTool> = new Map();
  
  private nextId = 1;

  constructor() {
    // Initialize with sample data for demo
    console.log("MemoryStorage constructor called - initializing sample data...");
    this.initializeSampleData();
    this.initializePaymentGateways();
    this.initializeNotifications();
    this.initializeDiagnosticTools();
    this.initializeAnnouncements();
    console.log(`After initialization: ${this.technicians.size} technicians loaded`);
  }

  private initializeSampleData() {
    // Sample users
    const sampleUsers = [
      { id: 1, username: "john_doe", email: "john@example.com", fullName: "John Doe", bio: "Tech enthusiast", avatar: null },
      { id: 2, username: "jane_smith", email: "jane@example.com", fullName: "Jane Smith", bio: "Software developer", avatar: null },
      { id: 3, username: "bob_wilson", email: "bob@example.com", fullName: "Bob Wilson", bio: "Hardware specialist", avatar: null },
      { id: 4, username: "alice_brown", email: "alice@example.com", fullName: "Alice Brown", bio: "Network admin", avatar: null },
      { id: 5, username: "sarah_johnson", email: "sarah@example.com", fullName: "Sarah Johnson", bio: "Full-stack developer", avatar: null },
      { id: 6, username: "mike_chen", email: "mike@example.com", fullName: "Mike Chen", bio: "Mobile support specialist", avatar: null },
      { id: 7, username: "emily_rodriguez", email: "emily@example.com", fullName: "Emily Rodriguez", bio: "Cloud security expert", avatar: null },
      { id: 8, username: "david_kim", email: "david@example.com", fullName: "David Kim", bio: "Phone support specialist", avatar: null },
      { id: 9, username: "lisa_thompson", email: "lisa@example.com", fullName: "Lisa Thompson", bio: "Database administrator", avatar: null },
      { id: 10, username: "alex_martinez", email: "alex@example.com", fullName: "Alex Martinez", bio: "Remote support expert", avatar: null },
      { id: 11, username: "rachel_lee", email: "rachel@example.com", fullName: "Rachel Lee", bio: "Software troubleshooting specialist", avatar: null }
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
      },
      {
        id: 4, userId: 7, firstName: "Emily", lastName: "Rodriguez", email: "emily@example.com",
        phoneNumber: "+1-555-456-7890", address: "321 Remote St, Denver, CO 80202",
        businessName: "CloudTech Support", companyName: "Rodriguez Tech", 
        experience: "6+ years", hourlyRate: "90", 
        country: "United States", state: "Colorado", city: "Denver",
        location: "Denver, CO", 
        serviceRadius: 35, serviceAreas: ["Denver", "Boulder"], 
        skills: ["Cloud Computing", "Remote Support", "System Administration", "Security"], 
        categories: ["System Administration", "Security Questions"], 
        certifications: ["AWS Solutions Architect", "CompTIA Security+"], languages: ["English", "Spanish"],
        availability: { monday: "8-20", tuesday: "8-20", wednesday: "8-20", thursday: "8-20", friday: "8-20" },
        profileDescription: "Cloud security specialist with remote support expertise", rating: "4.9",
        completedJobs: 276, totalEarnings: "24840", responseTime: 15, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        remoteEarningPercentage: "87.00", phoneEarningPercentage: "87.00", onsiteEarningPercentage: "87.00",
        stripeAccountId: null, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 5, userId: 8, firstName: "David", lastName: "Kim", email: "david@example.com",
        phoneNumber: "+1-555-567-8901", address: "654 Phone Ave, Seattle, WA 98101",
        businessName: "TechCall Pro", companyName: "Kim Solutions", 
        experience: "4+ years", hourlyRate: "70", 
        country: "United States", state: "Washington", city: "Seattle",
        location: "Seattle, WA", 
        serviceRadius: 25, serviceAreas: ["Seattle", "Bellevue"], 
        skills: ["Phone Support", "Software Troubleshooting", "Network Troubleshooting"], 
        categories: ["Software Issues", "Network Troubleshooting"], 
        certifications: ["Microsoft Certified Professional", "Cisco CCENT"], languages: ["English", "Korean"],
        availability: { monday: "9-21", tuesday: "9-21", wednesday: "9-21", thursday: "9-21", friday: "9-21" },
        profileDescription: "Phone support specialist for software and network issues", rating: "4.8",
        completedJobs: 189, totalEarnings: "13230", responseTime: 20, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        remoteEarningPercentage: "85.00", phoneEarningPercentage: "88.00", onsiteEarningPercentage: "85.00",
        stripeAccountId: null, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 6, userId: 9, firstName: "Lisa", lastName: "Thompson", email: "lisa@example.com",
        phoneNumber: "+1-555-678-9012", address: "987 Support Lane, Chicago, IL 60601",
        businessName: "RemoteHelp Plus", companyName: "Thompson Tech", 
        experience: "8+ years", hourlyRate: "100", 
        country: "United States", state: "Illinois", city: "Chicago",
        location: "Chicago, IL", 
        serviceRadius: 40, serviceAreas: ["Chicago", "Evanston"], 
        skills: ["Remote Desktop", "Database Management", "Web Development", "System Administration"], 
        categories: ["Database Help", "Web Development"], 
        certifications: ["Oracle Certified", "Red Hat Certified"], languages: ["English", "German"],
        availability: { monday: "7-19", tuesday: "7-19", wednesday: "7-19", thursday: "7-19", friday: "7-19" },
        profileDescription: "Senior database administrator and web development expert", rating: "4.9",
        completedJobs: 312, totalEarnings: "31200", responseTime: 12, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        remoteEarningPercentage: "90.00", phoneEarningPercentage: "90.00", onsiteEarningPercentage: "90.00",
        stripeAccountId: null, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 7, userId: 10, firstName: "Alex", lastName: "Martinez", email: "alex@example.com",
        phoneNumber: "+1-555-789-0123", address: "147 Tech Circle, Miami, FL 33101",
        businessName: "QuickFix Remote", companyName: "Martinez Solutions", 
        experience: "5+ years", hourlyRate: "80", 
        country: "United States", state: "Florida", city: "Miami",
        location: "Miami, FL", 
        serviceRadius: 30, serviceAreas: ["Miami", "Fort Lauderdale"], 
        skills: ["Remote Support", "Hardware Troubleshooting", "Mobile Device Support"], 
        categories: ["Hardware Issues", "Mobile Devices"], 
        certifications: ["CompTIA A+", "Apple Certified Mac Technician"], languages: ["English", "Spanish", "Portuguese"],
        availability: { monday: "8-18", tuesday: "8-18", wednesday: "8-18", thursday: "8-18", friday: "8-18", saturday: "10-16" },
        profileDescription: "Bilingual remote support specialist for hardware and mobile devices", rating: "4.7",
        completedJobs: 167, totalEarnings: "13360", responseTime: 22, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        remoteEarningPercentage: "85.00", phoneEarningPercentage: "85.00", onsiteEarningPercentage: "85.00",
        stripeAccountId: null, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 8, userId: 11, firstName: "Rachel", lastName: "Lee", email: "rachel@example.com",
        phoneNumber: "+1-555-890-1234", address: "258 Remote Blvd, Phoenix, AZ 85001",
        businessName: "PhoneSupport Pro", companyName: "Lee Tech Services", 
        experience: "3+ years", hourlyRate: "65", 
        country: "United States", state: "Arizona", city: "Phoenix",
        location: "Phoenix, AZ", 
        serviceRadius: 25, serviceAreas: ["Phoenix", "Scottsdale"], 
        skills: ["Phone Support", "Software Installation", "System Troubleshooting"], 
        categories: ["Software Issues", "System Administration"], 
        certifications: ["Microsoft Office Specialist", "CompTIA Network+"], languages: ["English", "Japanese"],
        availability: { monday: "9-17", tuesday: "9-17", wednesday: "9-17", thursday: "9-17", friday: "9-17" },
        profileDescription: "Phone support expert specializing in software and system issues", rating: "4.6",
        completedJobs: 98, totalEarnings: "6370", responseTime: 18, 
        isActive: true, isVerified: true, verificationStatus: "verified",
        remoteEarningPercentage: "85.00", phoneEarningPercentage: "87.00", onsiteEarningPercentage: "85.00",
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
    console.log('Searching technicians with criteria:', criteria);
    console.log('Available technicians:', this.technicians.size);
    
    const results = Array.from(this.technicians.values()).filter(technician => {
      // Log each technician for debugging
      console.log(`Checking technician ${technician.firstName} ${technician.lastName}:`, {
        skills: technician.skills,
        location: technician.location,
        isActive: technician.isActive,
        isVerified: technician.isVerified
      });
      
      // Check if technician is active and verified
      if (!technician.isActive || !technician.isVerified) {
        console.log(`Filtered out ${technician.firstName} - not active or verified`);
        return false;
      }
      
      // Enhanced skill matching - more flexible
      if (criteria.skills && criteria.skills.length > 0) {
        const hasMatchingSkill = criteria.skills.some(searchSkill => {
          const normalizedSearchSkill = searchSkill.toLowerCase();
          return technician.skills.some(techSkill => {
            const normalizedTechSkill = techSkill.toLowerCase();
            // Check for exact match or partial match
            return normalizedTechSkill.includes(normalizedSearchSkill) || 
                   normalizedSearchSkill.includes(normalizedTechSkill) ||
                   this.skillsMatch(normalizedSearchSkill, normalizedTechSkill);
          });
        });
        
        if (!hasMatchingSkill) {
          console.log(`Filtered out ${technician.firstName} - no matching skills`);
          return false;
        }
      }
      
      // Location matching - more flexible
      if (criteria.location && criteria.location.trim()) {
        const searchLocation = criteria.location.toLowerCase();
        const techLocation = technician.location.toLowerCase();
        const techState = technician.state?.toLowerCase() || '';
        const techCity = technician.city?.toLowerCase() || '';
        
        const locationMatch = techLocation.includes(searchLocation) || 
                             searchLocation.includes(techLocation) ||
                             techState.includes(searchLocation) ||
                             techCity.includes(searchLocation);
        
        if (!locationMatch) {
          console.log(`Filtered out ${technician.firstName} - location mismatch`);
          return false;
        }
      }
      
      console.log(`${technician.firstName} ${technician.lastName} matches criteria`);
      return true;
    });
    
    console.log(`Found ${results.length} matching technicians`);
    return results;
  }
  
  private skillsMatch(searchSkill: string, techSkill: string): boolean {
    // Define skill synonyms and related terms
    const skillMappings: { [key: string]: string[] } = {
      'remote': ['remote support', 'remote desktop', 'remote troubleshooting', 'remote assistance'],
      'remote support': ['remote', 'remote desktop', 'remote troubleshooting', 'remote assistance'],
      'remote_support': ['remote support', 'remote', 'remote desktop', 'remote troubleshooting', 'remote assistance'],
      'screen sharing': ['remote support', 'remote desktop', 'remote assistance'],
      'phone': ['phone support', 'phone troubleshooting', 'phone assistance'],
      'phone support': ['phone', 'phone troubleshooting', 'phone assistance'],
      'phone_support': ['phone support', 'phone', 'phone troubleshooting', 'phone assistance'],
      'hardware': ['hardware repair', 'hardware troubleshooting', 'hardware issues'],
      'hardware_repair': ['hardware repair', 'hardware', 'hardware troubleshooting', 'hardware issues'],
      'hardware repair': ['hardware', 'hardware_repair', 'hardware troubleshooting', 'hardware issues'],
      'software': ['software troubleshooting', 'software installation', 'software issues'],
      'software_troubleshooting': ['software troubleshooting', 'software', 'software installation', 'software issues'],
      'network': ['network setup', 'network troubleshooting', 'network issues'],
      'network_setup': ['network setup', 'network', 'network troubleshooting', 'network issues'],
      'network setup': ['network', 'network_setup', 'network troubleshooting', 'network issues'],
      'web': ['web development', 'web design', 'web programming'],
      'web_development': ['web development', 'web', 'web design', 'web programming'],
      'database': ['database management', 'database administration', 'database help'],
      'database_management': ['database management', 'database', 'database administration', 'database help'],
      'mobile': ['mobile device repair', 'mobile device support', 'mobile troubleshooting'],
      'mobile_device_repair': ['mobile device repair', 'mobile', 'mobile device support', 'mobile troubleshooting'],
      'security': ['security questions', 'security setup', 'cybersecurity'],
      'system': ['system administration', 'system management', 'system troubleshooting'],
      'system_administration': ['system administration', 'system', 'system management', 'system troubleshooting'],
      
      // Add format conversions (snake_case to proper case)
      'hardware_repair': ['hardware repair', 'hardware', 'hardware troubleshooting'],
      'network_setup': ['network setup', 'network', 'network troubleshooting'],
      'software_installation': ['software installation', 'software', 'software troubleshooting'],
      'mobile_device_support': ['mobile device support', 'mobile device repair', 'mobile'],
      'remote_desktop': ['remote desktop', 'remote support', 'remote'],
      'phone_troubleshooting': ['phone troubleshooting', 'phone support', 'phone'],
      'web_development': ['web development', 'web', 'web design'],
      'database_administration': ['database administration', 'database management', 'database'],
      'system_management': ['system management', 'system administration', 'system']
    };
    
    // Check if search skill maps to tech skill
    const searchMappings = skillMappings[searchSkill] || [];
    const techMappings = skillMappings[techSkill] || [];
    
    // Format conversion: snake_case to proper case
    const convertSnakeToProper = (skill: string) => {
      return skill.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    };
    
    const convertProperToSnake = (skill: string) => {
      return skill.toLowerCase().replace(/ /g, '_');
    };
    
    // Check various matching conditions
    return searchMappings.includes(techSkill) || 
           techMappings.includes(searchSkill) ||
           searchMappings.some(mapping => techSkill.includes(mapping)) ||
           techMappings.some(mapping => searchSkill.includes(mapping)) ||
           convertSnakeToProper(searchSkill) === techSkill ||
           convertProperToSnake(techSkill) === searchSkill ||
           convertSnakeToProper(searchSkill).toLowerCase() === techSkill.toLowerCase() ||
           convertProperToSnake(techSkill).toLowerCase() === searchSkill.toLowerCase();
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

  // Payment Gateway Management Methods
  private paymentGateways: Map<string, any> = new Map();
  private paymentTransactions: Map<string, any> = new Map();
  private serviceProviderPayouts: Map<string, any> = new Map();
  private payoutSettings: any = {
    minimumPayout: 50,
    processingFee: 2.5,
    schedule: 'weekly',
    autoPayoutEnabled: true,
    nextPayoutDate: 'Friday'
  };



  private initializePaymentGateways() {
    // Add mock payment gateways
    const mockGateways = [
      {
        id: '1',
        name: 'Stripe Production',
        type: 'stripe',
        status: 'active',
        isEnabled: true,
        apiKey: 'pk_live_51J**********************',
        secretKey: 'sk_live_51J**********************',
        webhookUrl: 'https://api.techgpt.com/webhooks/stripe',
        fees: { percentage: 2.9, fixed: 0.30 },
        supportedCurrencies: ['USD', 'CAD', 'EUR', 'GBP'],
        supportedCountries: ['US', 'CA', 'GB', 'DE', 'FR'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2025-01-08'),
        lastSync: new Date('2025-01-08'),
        totalTransactions: 2847,
        totalVolume: 284750,
        monthlyVolume: 45200,
        config: {
          webhookSecret: 'whsec_**********************',
          accountId: 'acct_**********************'
        }
      },
      {
        id: '2',
        name: 'PayPal Business',
        type: 'paypal',
        status: 'active',
        isEnabled: true,
        apiKey: 'AYr**********************',
        secretKey: 'EHt**********************',
        webhookUrl: 'https://api.techgpt.com/webhooks/paypal',
        fees: { percentage: 3.49, fixed: 0.49 },
        supportedCurrencies: ['USD', 'CAD', 'EUR', 'GBP', 'AUD'],
        supportedCountries: ['US', 'CA', 'GB', 'DE', 'FR', 'AU'],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2025-01-07'),
        lastSync: new Date('2025-01-07'),
        totalTransactions: 1523,
        totalVolume: 152300,
        monthlyVolume: 28400,
        config: {
          clientId: 'AYr**********************',
          environment: 'production'
        }
      },
      {
        id: '3',
        name: 'Apple Pay',
        type: 'apple_pay',
        status: 'pending',
        isEnabled: false,
        apiKey: 'merchant.com.techgpt.payments',
        secretKey: '',
        webhookUrl: 'https://api.techgpt.com/webhooks/apple',
        fees: { percentage: 2.9, fixed: 0.30 },
        supportedCurrencies: ['USD', 'CAD', 'EUR', 'GBP'],
        supportedCountries: ['US', 'CA', 'GB', 'DE', 'FR'],
        createdAt: new Date('2024-12-15'),
        updatedAt: new Date('2025-01-05'),
        lastSync: new Date('2025-01-05'),
        totalTransactions: 0,
        totalVolume: 0,
        monthlyVolume: 0,
        config: {
          merchantId: 'merchant.com.techgpt.payments',
          certificateId: 'cert_**********************'
        }
      }
    ];

    mockGateways.forEach(gateway => {
      this.paymentGateways.set(gateway.id, gateway);
    });

    // Add mock transactions
    const mockTransactions = [
      {
        id: 'txn_001',
        gatewayId: '1',
        gatewayName: 'Stripe',
        transactionId: 'pi_3O**********************',
        amount: 125.50,
        currency: 'USD',
        status: 'completed',
        type: 'payment',
        customerId: 101,
        technicianId: 201,
        jobId: 301,
        fees: 3.94,
        netAmount: 121.56,
        createdAt: new Date('2025-01-08T10:30:00Z'),
        completedAt: new Date('2025-01-08T10:32:15Z'),
        failureReason: null,
        metadata: { service: 'Hardware Support', duration: '2 hours' }
      },
      {
        id: 'txn_002',
        gatewayId: '2',
        gatewayName: 'PayPal',
        transactionId: 'PAYID-MXXXXXXXXXXXXXXXX',
        amount: 85.00,
        currency: 'USD',
        status: 'completed',
        type: 'payment',
        customerId: 102,
        technicianId: 202,
        jobId: 302,
        fees: 3.46,
        netAmount: 81.54,
        createdAt: new Date('2025-01-08T09:15:00Z'),
        completedAt: new Date('2025-01-08T09:17:30Z'),
        failureReason: null,
        metadata: { service: 'Network Setup', duration: '1.5 hours' }
      },
      {
        id: 'txn_003',
        gatewayId: '1',
        gatewayName: 'Stripe',
        transactionId: 'pi_3P**********************',
        amount: 200.00,
        currency: 'USD',
        status: 'pending',
        type: 'payment',
        customerId: 103,
        technicianId: 203,
        jobId: 303,
        fees: 6.10,
        netAmount: 193.90,
        createdAt: new Date('2025-01-08T11:45:00Z'),
        completedAt: null,
        failureReason: null,
        metadata: { service: 'System Administration', duration: '3 hours' }
      },
      {
        id: 'txn_004',
        gatewayId: '1',
        gatewayName: 'Stripe',
        transactionId: 'pi_3Q**********************',
        amount: 75.00,
        currency: 'USD',
        status: 'failed',
        type: 'payment',
        customerId: 104,
        technicianId: 204,
        jobId: 304,
        fees: 0,
        netAmount: 0,
        createdAt: new Date('2025-01-08T08:20:00Z'),
        completedAt: null,
        failureReason: 'Insufficient funds',
        metadata: { service: 'Software Installation', duration: '1 hour' }
      },
      {
        id: 'txn_005',
        gatewayId: '2',
        gatewayName: 'PayPal',
        transactionId: 'PAYID-NXXXXXXXXXXXXXXXX',
        amount: 150.00,
        currency: 'USD',
        status: 'refunded',
        type: 'refund',
        customerId: 105,
        technicianId: 205,
        jobId: 305,
        fees: 5.74,
        netAmount: 144.26,
        createdAt: new Date('2025-01-07T14:30:00Z'),
        completedAt: new Date('2025-01-07T14:32:00Z'),
        failureReason: null,
        metadata: { service: 'Database Migration', duration: '2.5 hours', refundReason: 'Service cancelled by customer' }
      }
    ];

    mockTransactions.forEach(transaction => {
      this.paymentTransactions.set(transaction.id, transaction);
    });

    // Initialize with mock payout history
    const mockPayouts = [
      {
        id: 'payout_001',
        providerId: 1,
        providerName: 'John Doe',
        amount: 127.50,
        processingFee: 3.19,
        netAmount: 124.31,
        method: 'stripe_transfer',
        status: 'completed',
        note: 'Weekly automatic payout',
        processedBy: 'system',
        createdAt: new Date('2025-01-03T12:00:00Z'),
        completedAt: new Date('2025-01-03T12:05:00Z')
      },
      {
        id: 'payout_002',
        providerId: 2,
        providerName: 'Sarah Johnson',
        amount: 195.00,
        processingFee: 4.88,
        netAmount: 190.12,
        method: 'paypal_transfer',
        status: 'completed',
        note: 'Weekly automatic payout',
        processedBy: 'system',
        createdAt: new Date('2025-01-03T12:00:00Z'),
        completedAt: new Date('2025-01-03T12:07:00Z')
      },
      {
        id: 'payout_003',
        providerId: 3,
        providerName: 'Mike Chen',
        amount: 89.75,
        processingFee: 2.24,
        netAmount: 87.51,
        method: 'bank_transfer',
        status: 'pending',
        note: 'Manual payout - bonus payment',
        processedBy: 'admin',
        createdAt: new Date('2025-01-08T10:30:00Z'),
        completedAt: null
      }
    ];

    mockPayouts.forEach(payout => {
      this.serviceProviderPayouts.set(payout.id, payout);
    });
  }

  async getAllPaymentGateways(): Promise<any[]> {
    return Array.from(this.paymentGateways.values());
  }

  async createPaymentGateway(gatewayData: any): Promise<any> {
    const id = Date.now().toString();
    const gateway = {
      id,
      ...gatewayData,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSync: new Date(),
      totalTransactions: 0,
      totalVolume: 0,
      monthlyVolume: 0,
      config: gatewayData.config || {}
    };
    
    this.paymentGateways.set(id, gateway);
    return gateway;
  }

  async updatePaymentGateway(id: string, updateData: any): Promise<any> {
    const gateway = this.paymentGateways.get(id);
    if (!gateway) {
      throw new Error('Payment gateway not found');
    }
    
    const updatedGateway = {
      ...gateway,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.paymentGateways.set(id, updatedGateway);
    return updatedGateway;
  }

  async deletePaymentGateway(id: string): Promise<void> {
    if (!this.paymentGateways.has(id)) {
      throw new Error('Payment gateway not found');
    }
    
    this.paymentGateways.delete(id);
  }

  async togglePaymentGateway(id: string, isEnabled: boolean): Promise<any> {
    const gateway = this.paymentGateways.get(id);
    if (!gateway) {
      throw new Error('Payment gateway not found');
    }
    
    gateway.isEnabled = isEnabled;
    gateway.status = isEnabled ? 'active' : 'inactive';
    gateway.updatedAt = new Date();
    
    this.paymentGateways.set(id, gateway);
    return gateway;
  }

  async syncPaymentGateway(id: string): Promise<any> {
    const gateway = this.paymentGateways.get(id);
    if (!gateway) {
      throw new Error('Payment gateway not found');
    }
    
    // Simulate sync process
    gateway.lastSync = new Date();
    gateway.updatedAt = new Date();
    
    this.paymentGateways.set(id, gateway);
    return { success: true, lastSync: gateway.lastSync };
  }

  async getPaymentTransactions(filters: { search?: string; status?: string; range?: string }): Promise<any[]> {
    let transactions = Array.from(this.paymentTransactions.values());
    
    if (filters.search) {
      transactions = transactions.filter(t => 
        t.transactionId.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.gatewayName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      transactions = transactions.filter(t => t.status === filters.status);
    }
    
    if (filters.range) {
      const days = parseInt(filters.range.replace('d', ''));
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      transactions = transactions.filter(t => new Date(t.createdAt) >= cutoff);
    }
    
    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPaymentAnalytics(range: string): Promise<any> {
    const transactions = Array.from(this.paymentTransactions.values());
    const gateways = Array.from(this.paymentGateways.values());
    
    const totalTransactions = transactions.length;
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const successRate = totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 0;
    const averageTransactionValue = totalTransactions > 0 ? totalVolume / totalTransactions : 0;
    
    const gatewayBreakdown = gateways.reduce((acc, gateway) => {
      const gatewayTransactions = transactions.filter(t => t.gatewayId === gateway.id);
      acc[gateway.type] = {
        volume: gatewayTransactions.reduce((sum, t) => sum + t.amount, 0),
        count: gatewayTransactions.length,
        fees: gatewayTransactions.reduce((sum, t) => sum + t.fees, 0)
      };
      return acc;
    }, {});
    
    const topGateway = Object.entries(gatewayBreakdown).reduce((max, [name, data]: [string, any]) => 
      data.volume > (max.volume || 0) ? { name, ...data } : max, { name: '', volume: 0 }
    );
    
    return {
      totalTransactions,
      totalVolume,
      successRate,
      averageTransactionValue,
      monthlyGrowth: 15.5, // Mock growth percentage
      topGateway: topGateway.name,
      gatewayBreakdown,
      recentTransactions: transactions.slice(0, 10)
    };
  }

  async processRefund(transactionId: string, amount: number, reason: string): Promise<any> {
    const transaction = this.paymentTransactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    const refundId = Date.now().toString();
    const refund = {
      id: refundId,
      transactionId,
      amount,
      reason,
      status: 'completed',
      createdAt: new Date(),
      gatewayId: transaction.gatewayId,
      gatewayName: transaction.gatewayName
    };
    
    // Update original transaction
    transaction.status = 'refunded';
    transaction.refundAmount = amount;
    transaction.refundReason = reason;
    transaction.refundedAt = new Date();
    
    this.paymentTransactions.set(transactionId, transaction);
    
    return refund;
  }

  // Service Provider Payout Management Methods
  async getPayoutDashboard(): Promise<any> {
    const payouts = Array.from(this.serviceProviderPayouts.values());
    const technicians = Array.from(this.technicians.values());
    
    // Calculate pending payouts for each technician
    const pendingPayouts = technicians.map(tech => {
      const pendingEarnings = parseFloat(tech.totalEarnings) * 0.1; // Mock 10% pending
      return { 
        id: tech.id,
        name: `${tech.firstName} ${tech.lastName}`,
        pendingEarnings: pendingEarnings >= 50 ? pendingEarnings : 0
      };
    }).filter(p => p.pendingEarnings > 0);

    const totalPendingPayouts = pendingPayouts.reduce((sum, p) => sum + p.pendingEarnings, 0);
    const eligibleProviders = pendingPayouts.length;

    // Calculate weekly payouts
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyPayouts = payouts.filter(p => new Date(p.createdAt) >= weekAgo);
    const weeklyPayoutAmount = weeklyPayouts.reduce((sum, p) => sum + p.amount, 0);

    // Calculate processing fees
    const processingFees = payouts.reduce((sum, p) => sum + p.processingFee, 0);

    return {
      totalPendingPayouts,
      eligibleProviders,
      weeklyPayouts: weeklyPayoutAmount,
      weeklyPayoutCount: weeklyPayouts.length,
      processingFees,
      feePercentage: this.payoutSettings.processingFee,
      nextPayoutDate: this.payoutSettings.nextPayoutDate
    };
  }

  async getServiceProvidersWithEarnings(): Promise<any[]> {
    const technicians = Array.from(this.technicians.values());
    
    return technicians.map(tech => ({
      id: tech.id,
      name: `${tech.firstName} ${tech.lastName}`,
      email: tech.email,
      avatar: null,
      totalEarnings: parseFloat(tech.totalEarnings),
      pendingEarnings: parseFloat(tech.totalEarnings) * 0.1, // Mock 10% pending
      completedJobs: tech.completedJobs,
      rating: tech.rating,
      payoutMethod: 'stripe_transfer',
      lastPayoutDate: new Date('2025-01-03'),
      isActive: tech.isActive
    }));
  }

  async getPayoutHistory(page: number = 1, limit: number = 50): Promise<any[]> {
    const payouts = Array.from(this.serviceProviderPayouts.values());
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return payouts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(startIndex, endIndex);
  }

  async getPayoutSettings(): Promise<any> {
    return this.payoutSettings;
  }

  async updatePayoutSettings(settings: any): Promise<any> {
    this.payoutSettings = { ...this.payoutSettings, ...settings };
    return this.payoutSettings;
  }

  async processPayout(payoutData: any): Promise<any> {
    const { providerId, amount, note, method, processedBy } = payoutData;
    
    // Get technician info
    const technician = this.technicians.get(providerId);
    if (!technician) {
      throw new Error('Service provider not found');
    }

    // Calculate processing fee
    const processingFee = amount * (this.payoutSettings.processingFee / 100);
    const netAmount = amount - processingFee;

    // Create payout record
    const payout = {
      id: `payout_${Date.now()}`,
      providerId,
      providerName: `${technician.firstName} ${technician.lastName}`,
      amount,
      processingFee,
      netAmount,
      method,
      status: 'completed', // In real implementation, this would be 'pending' initially
      note,
      processedBy,
      createdAt: new Date(),
      completedAt: new Date() // Mock immediate completion
    };

    this.serviceProviderPayouts.set(payout.id, payout);
    
    // Update technician's earnings (reduce pending amount)
    const currentEarnings = parseFloat(technician.totalEarnings);
    const newEarnings = Math.max(0, currentEarnings - amount);
    technician.totalEarnings = newEarnings.toString();
    this.technicians.set(providerId, technician);

    return payout;
  }

  async processBulkPayout(providers: any[]): Promise<any> {
    const results = [];
    let totalProcessed = 0;
    let totalFees = 0;

    for (const provider of providers) {
      try {
        const payout = await this.processPayout({
          providerId: provider.providerId,
          amount: provider.amount,
          note: 'Bulk automatic payout',
          method: provider.method,
          processedBy: 'system'
        });
        
        results.push({ success: true, payout });
        totalProcessed += provider.amount;
        totalFees += payout.processingFee;
      } catch (error) {
        results.push({ success: false, error: error.message, providerId: provider.providerId });
      }
    }

    return {
      totalProcessed: results.filter(r => r.success).length,
      totalAmount: totalProcessed,
      totalFees,
      results
    };
  }

  async scheduleAutomaticPayouts(): Promise<any> {
    const providers = await this.getServiceProvidersWithEarnings();
    const eligibleProviders = providers.filter(p => p.pendingEarnings >= this.payoutSettings.minimumPayout);

    if (eligibleProviders.length === 0) {
      return { message: 'No eligible providers for automatic payout', count: 0 };
    }

    const payoutRequests = eligibleProviders.map(provider => ({
      providerId: provider.id,
      amount: provider.pendingEarnings,
      method: 'stripe_transfer'
    }));

    const result = await this.processBulkPayout(payoutRequests);
    
    return {
      message: 'Automatic payouts scheduled',
      count: result.totalProcessed,
      totalAmount: result.totalAmount,
      totalFees: result.totalFees
    };
  }

  async getPayoutAnalytics(range: string): Promise<any> {
    const payouts = Array.from(this.serviceProviderPayouts.values());
    
    // Filter by date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const filteredPayouts = payouts.filter(p => new Date(p.createdAt) >= startDate);
    
    const totalPayouts = filteredPayouts.length;
    const totalAmount = filteredPayouts.reduce((sum, p) => sum + p.amount, 0);
    const totalFees = filteredPayouts.reduce((sum, p) => sum + p.processingFee, 0);
    const averageAmount = totalPayouts > 0 ? totalAmount / totalPayouts : 0;

    // Group by method
    const methodBreakdown = filteredPayouts.reduce((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + p.amount;
      return acc;
    }, {});

    // Group by status
    const statusBreakdown = filteredPayouts.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPayouts,
      totalAmount,
      totalFees,
      averageAmount,
      methodBreakdown,
      statusBreakdown,
      successRate: statusBreakdown.completed ? (statusBreakdown.completed / totalPayouts) * 100 : 0
    };
  }

  // Platform Management Console Methods
  
  // Mock platform settings data
  private platformSettings = new Map<number, any>([
    [1, {
      id: 1,
      category: 'general',
      key: 'platform_name',
      value: 'TechGPT',
      dataType: 'string',
      description: 'Platform name displayed to users',
      isRequired: true,
      isSecret: false,
      lastUpdated: new Date('2025-01-01'),
      updatedBy: 'system',
      createdAt: new Date('2025-01-01')
    }],
    [2, {
      id: 2,
      category: 'general',
      key: 'maintenance_mode',
      value: 'false',
      dataType: 'boolean',
      description: 'Enable/disable maintenance mode',
      isRequired: false,
      isSecret: false,
      lastUpdated: new Date('2025-01-01'),
      updatedBy: 'admin',
      createdAt: new Date('2025-01-01')
    }],
    [3, {
      id: 3,
      category: 'payments',
      key: 'stripe_webhook_secret',
      value: 'whsec_test_secret_key',
      dataType: 'string',
      description: 'Stripe webhook endpoint secret',
      isRequired: true,
      isSecret: true,
      lastUpdated: new Date('2025-01-01'),
      updatedBy: 'admin',
      createdAt: new Date('2025-01-01')
    }],
    [4, {
      id: 4,
      category: 'taxes',
      key: 'default_tax_rate',
      value: '13.00',
      dataType: 'number',
      description: 'Default tax rate percentage',
      isRequired: true,
      isSecret: false,
      lastUpdated: new Date('2025-01-01'),
      updatedBy: 'admin',
      createdAt: new Date('2025-01-01')
    }],
    [5, {
      id: 5,
      category: 'notifications',
      key: 'email_notifications_enabled',
      value: 'true',
      dataType: 'boolean',
      description: 'Enable email notifications',
      isRequired: false,
      isSecret: false,
      lastUpdated: new Date('2025-01-01'),
      updatedBy: 'admin',
      createdAt: new Date('2025-01-01')
    }],
    [6, {
      id: 6,
      category: 'security',
      key: 'session_timeout',
      value: '3600',
      dataType: 'number',
      description: 'Session timeout in seconds',
      isRequired: true,
      isSecret: false,
      lastUpdated: new Date('2025-01-01'),
      updatedBy: 'admin',
      createdAt: new Date('2025-01-01')
    }],
    [7, {
      id: 7,
      category: 'api',
      key: 'rate_limit_requests',
      value: '100',
      dataType: 'number',
      description: 'API rate limit requests per minute',
      isRequired: true,
      isSecret: false,
      lastUpdated: new Date('2025-01-01'),
      updatedBy: 'admin',
      createdAt: new Date('2025-01-01')
    }],
    [8, {
      id: 8,
      category: 'integration',
      key: 'openai_model',
      value: 'gpt-4o',
      dataType: 'string',
      description: 'OpenAI model for AI responses',
      isRequired: true,
      isSecret: false,
      lastUpdated: new Date('2025-01-01'),
      updatedBy: 'admin',
      createdAt: new Date('2025-01-01')
    }]
  ]);

  // Mock tax jurisdictions data
  private taxJurisdictions = new Map<number, any>([
    [1, {
      id: 1,
      country: 'Canada',
      countryCode: 'CA',
      state: null,
      stateCode: null,
      province: 'Ontario',
      provinceCode: 'ON',
      taxType: 'HST',
      taxRate: 13.00,
      isActive: true,
      appliesTo: ['customers', 'service_providers'],
      exemptions: [],
      effectiveDate: new Date('2025-01-01'),
      lastUpdated: new Date('2025-01-01'),
      description: 'Ontario HST rate',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }],
    [2, {
      id: 2,
      country: 'Canada',
      countryCode: 'CA',
      state: null,
      stateCode: null,
      province: 'British Columbia',
      provinceCode: 'BC',
      taxType: 'GST',
      taxRate: 5.00,
      isActive: true,
      appliesTo: ['customers', 'service_providers'],
      exemptions: [],
      effectiveDate: new Date('2025-01-01'),
      lastUpdated: new Date('2025-01-01'),
      description: 'British Columbia GST rate',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }],
    [3, {
      id: 3,
      country: 'United States',
      countryCode: 'US',
      state: 'California',
      stateCode: 'CA',
      province: null,
      provinceCode: null,
      taxType: 'Sales Tax',
      taxRate: 7.50,
      isActive: true,
      appliesTo: ['customers'],
      exemptions: ['service_providers'],
      effectiveDate: new Date('2025-01-01'),
      lastUpdated: new Date('2025-01-01'),
      description: 'California state sales tax',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }],
    [4, {
      id: 4,
      country: 'United States',
      countryCode: 'US',
      state: 'New York',
      stateCode: 'NY',
      province: null,
      provinceCode: null,
      taxType: 'Sales Tax',
      taxRate: 8.00,
      isActive: true,
      appliesTo: ['customers'],
      exemptions: [],
      effectiveDate: new Date('2025-01-01'),
      lastUpdated: new Date('2025-01-01'),
      description: 'New York state sales tax',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }],
    [5, {
      id: 5,
      country: 'United Kingdom',
      countryCode: 'UK',
      state: null,
      stateCode: null,
      province: null,
      provinceCode: null,
      taxType: 'VAT',
      taxRate: 20.00,
      isActive: true,
      appliesTo: ['customers', 'service_providers'],
      exemptions: [],
      effectiveDate: new Date('2025-01-01'),
      lastUpdated: new Date('2025-01-01'),
      description: 'UK VAT rate',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }]
  ]);

  // Mock admin panel configuration data
  private adminPanelConfig = new Map<number, any>([
    [1, {
      id: 1,
      section: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Main dashboard with key metrics and statistics',
      isEnabled: true,
      permissions: ['admin', 'super_admin'],
      icon: 'LayoutDashboard',
      order: 1,
      settings: {
        showMetrics: true,
        showActivity: true,
        showQuickActions: true
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }],
    [2, {
      id: 2,
      section: 'users',
      title: 'User Management',
      description: 'Manage platform users and customers',
      isEnabled: true,
      permissions: ['admin', 'super_admin', 'manager'],
      icon: 'Users',
      order: 2,
      settings: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canExport: true
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }],
    [3, {
      id: 3,
      section: 'service_providers',
      title: 'Service Provider Management',
      description: 'Manage service providers and technicians',
      isEnabled: true,
      permissions: ['admin', 'super_admin', 'manager'],
      icon: 'UserCheck',
      order: 3,
      settings: {
        canApprove: true,
        canSuspend: true,
        canViewEarnings: true
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }],
    [4, {
      id: 4,
      section: 'payments',
      title: 'Payment Management',
      description: 'Manage payments, gateways, and transactions',
      isEnabled: true,
      permissions: ['admin', 'super_admin'],
      icon: 'CreditCard',
      order: 4,
      settings: {
        canProcessRefunds: true,
        canViewTransactions: true,
        canManageGateways: true
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }],
    [5, {
      id: 5,
      section: 'disputes',
      title: 'Dispute Resolution',
      description: 'Handle customer and service provider disputes',
      isEnabled: true,
      permissions: ['admin', 'super_admin', 'support'],
      icon: 'AlertTriangle',
      order: 5,
      settings: {
        canAssign: true,
        canResolve: true,
        canEscalate: true
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }],
    [6, {
      id: 6,
      section: 'platform',
      title: 'Platform Settings',
      description: 'Configure platform-wide settings and preferences',
      isEnabled: true,
      permissions: ['super_admin'],
      icon: 'Settings',
      order: 6,
      settings: {
        canModifySettings: true,
        canViewSecrets: true,
        canManageTaxes: true
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }]
  ]);

  async getPlatformSettings(): Promise<any[]> {
    return Array.from(this.platformSettings.values());
  }

  async updatePlatformSetting(id: number, data: any): Promise<any> {
    const setting = this.platformSettings.get(id);
    if (!setting) {
      throw new Error('Platform setting not found');
    }

    const updatedSetting = {
      ...setting,
      ...data,
      lastUpdated: new Date(),
      updatedBy: data.updatedBy || 'admin'
    };

    this.platformSettings.set(id, updatedSetting);
    return updatedSetting;
  }

  async getTaxJurisdictions(): Promise<any[]> {
    return Array.from(this.taxJurisdictions.values());
  }

  async createTaxJurisdiction(data: any): Promise<any> {
    const id = Math.max(...Array.from(this.taxJurisdictions.keys()), 0) + 1;
    const jurisdiction = {
      id,
      ...data,
      effectiveDate: new Date(data.effectiveDate || new Date()),
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.taxJurisdictions.set(id, jurisdiction);
    return jurisdiction;
  }

  async updateTaxJurisdiction(id: number, data: any): Promise<any> {
    const jurisdiction = this.taxJurisdictions.get(id);
    if (!jurisdiction) {
      throw new Error('Tax jurisdiction not found');
    }

    const updatedJurisdiction = {
      ...jurisdiction,
      ...data,
      lastUpdated: new Date(),
      updatedAt: new Date()
    };

    this.taxJurisdictions.set(id, updatedJurisdiction);
    return updatedJurisdiction;
  }

  async getAdminPanelConfig(): Promise<any[]> {
    return Array.from(this.adminPanelConfig.values());
  }

  async updateAdminPanelConfig(id: number, data: any): Promise<any> {
    const config = this.adminPanelConfig.get(id);
    if (!config) {
      throw new Error('Admin panel config not found');
    }

    const updatedConfig = {
      ...config,
      ...data,
      updatedAt: new Date()
    };

    this.adminPanelConfig.set(id, updatedConfig);
    return updatedConfig;
  }

  // Notification management
  private notifications = new Map<string, any>();
  
  private initializeNotifications() {
    const initialNotifications = [
      {
        id: "1",
        title: "System Maintenance Scheduled",
        message: "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST. Services may be temporarily unavailable.",
        priority: "high",
        category: "system",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: false,
        isArchived: false,
        metadata: { severity: "high" }
      },
      {
        id: "2",
        title: "New User Registration",
        message: "John Smith has registered for a new account and requires approval.",
        priority: "medium",
        category: "user",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        isRead: false,
        isArchived: false,
        metadata: { userId: "user123" }
      },
      {
        id: "3",
        title: "Payment Failed",
        message: "Payment of $299.99 failed for order #12345. Customer has been notified.",
        priority: "high",
        category: "payment",
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        isRead: true,
        isArchived: false,
        metadata: { amount: 299.99, orderId: "12345" }
      },
      {
        id: "4",
        title: "Support Ticket Created",
        message: "New support ticket #456 has been created for technical assistance.",
        priority: "medium",
        category: "support",
        timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        isRead: false,
        isArchived: false,
        metadata: { ticketId: "456" }
      },
      {
        id: "5",
        title: "Security Alert",
        message: "Multiple failed login attempts detected for admin account. Account has been temporarily locked.",
        priority: "urgent",
        category: "security",
        timestamp: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
        isRead: false,
        isArchived: false,
        metadata: { severity: "urgent" }
      },
      {
        id: "6",
        title: "Performance Alert",
        message: "Server response time has exceeded 2 seconds. Performance monitoring is active.",
        priority: "medium",
        category: "performance",
        timestamp: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        isRead: true,
        isArchived: false,
        metadata: { responseTime: "2.3s" }
      }
    ];
    
    initialNotifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
    });
  }
  
  async getNotifications(filters: {
    category?: string;
    priority?: string;
    read?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    let notifications = Array.from(this.notifications.values());
    
    // Apply filters
    if (filters.category) {
      notifications = notifications.filter(n => n.category === filters.category);
    }
    
    if (filters.priority) {
      notifications = notifications.filter(n => n.priority === filters.priority);
    }
    
    if (filters.read !== undefined) {
      notifications = notifications.filter(n => n.isRead === filters.read);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      notifications = notifications.filter(n => 
        n.title.toLowerCase().includes(searchTerm) || 
        n.message.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Apply pagination
    const limit = filters.limit || 100;
    const offset = filters.offset || 0;
    
    return notifications.slice(offset, offset + limit);
  }

  async createNotification(notification: any): Promise<any> {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date().toISOString(),
      isRead: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(notificationId: string): Promise<any> {
    const notification = this.notifications.get(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    const updatedNotification = {
      ...notification,
      isRead: true,
      updatedAt: new Date()
    };
    
    this.notifications.set(notificationId, updatedNotification);
    return updatedNotification;
  }

  async archiveNotification(notificationId: string): Promise<any> {
    const notification = this.notifications.get(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    const updatedNotification = {
      ...notification,
      isArchived: true,
      updatedAt: new Date()
    };
    
    this.notifications.set(notificationId, updatedNotification);
    return updatedNotification;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    if (!this.notifications.has(notificationId)) {
      throw new Error('Notification not found');
    }
    
    this.notifications.delete(notificationId);
  }

  async bulkUpdateNotifications(action: string, notificationIds: string[]): Promise<any> {
    const updatedNotifications = [];
    
    for (const id of notificationIds) {
      const notification = this.notifications.get(id);
      if (!notification) continue;
      
      let updatedNotification = { ...notification };
      
      switch (action) {
        case 'markAsRead':
          updatedNotification.isRead = true;
          break;
        case 'markAsUnread':
          updatedNotification.isRead = false;
          break;
        case 'archive':
          updatedNotification.isArchived = true;
          break;
        case 'unarchive':
          updatedNotification.isArchived = false;
          break;
        case 'delete':
          this.notifications.delete(id);
          continue;
      }
      
      updatedNotification.updatedAt = new Date();
      this.notifications.set(id, updatedNotification);
      updatedNotifications.push(updatedNotification);
    }
    
    return {
      success: true,
      updated: updatedNotifications.length,
      action
    };
  }

  async getNotificationStats(): Promise<any> {
    const notifications = Array.from(this.notifications.values());
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const archived = notifications.filter(n => n.isArchived).length;
    
    // Count by priority
    const priorityStats = {
      low: notifications.filter(n => n.priority === 'low').length,
      medium: notifications.filter(n => n.priority === 'medium').length,
      high: notifications.filter(n => n.priority === 'high').length,
      urgent: notifications.filter(n => n.priority === 'urgent').length
    };
    
    // Count by category
    const categoryStats = {
      system: notifications.filter(n => n.category === 'system').length,
      user: notifications.filter(n => n.category === 'user').length,
      payment: notifications.filter(n => n.category === 'payment').length,
      support: notifications.filter(n => n.category === 'support').length,
      security: notifications.filter(n => n.category === 'security').length,
      performance: notifications.filter(n => n.category === 'performance').length
    };
    
    return {
      total,
      unread,
      archived,
      priorityStats,
      categoryStats
    };
  }

  // Support ticket management
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      id: this.nextId++,
      ticketNumber: ticket.ticketNumber,
      userId: ticket.userId,
      assignedTo: ticket.assignedTo || null,
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status || 'open',
      source: ticket.source || 'chat',
      chatConversation: ticket.chatConversation || null,
      resolution: ticket.resolution || null,
      resolvedBy: ticket.resolvedBy || null,
      resolvedAt: ticket.resolvedAt || null,
      customerRating: ticket.customerRating || null,
      customerFeedback: ticket.customerFeedback || null,
      firstResponseAt: ticket.firstResponseAt || null,
      lastResponseAt: ticket.lastResponseAt || null,
      tags: ticket.tags || [],
      internalNotes: ticket.internalNotes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.supportTickets.set(newTicket.id, newTicket);
    return newTicket;
  }

  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    return this.supportTickets.get(id);
  }

  async getSupportTicketsByUser(userId: number): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values()).filter(ticket => ticket.userId === userId);
  }

  async updateSupportTicketStatus(id: number, status: string): Promise<SupportTicket> {
    const ticket = this.supportTickets.get(id);
    if (!ticket) {
      throw new Error(`Support ticket with id ${id} not found`);
    }
    
    ticket.status = status;
    ticket.updatedAt = new Date();
    
    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = new Date();
    }
    
    this.supportTickets.set(id, ticket);
    return ticket;
  }

  // Support ticket message management
  async createSupportTicketMessage(message: InsertSupportTicketMessage): Promise<SupportTicketMessage> {
    const newMessage: SupportTicketMessage = {
      id: this.nextId++,
      ticketId: message.ticketId,
      senderId: message.senderId,
      senderType: message.senderType,
      content: message.content,
      messageType: message.messageType || 'text',
      attachments: message.attachments || [],
      isInternal: message.isInternal || false,
      createdAt: new Date(),
    };
    
    this.supportTicketMessages.set(newMessage.id, newMessage);
    return newMessage;
  }

  async getSupportTicketMessages(ticketId: number): Promise<SupportTicketMessage[]> {
    return Array.from(this.supportTicketMessages.values())
      .filter(msg => msg.ticketId === ticketId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  // Support ticket attachment management
  async createSupportTicketAttachment(attachment: InsertSupportTicketAttachment): Promise<SupportTicketAttachment> {
    const newAttachment: SupportTicketAttachment = {
      id: this.nextId++,
      ticketId: attachment.ticketId,
      messageId: attachment.messageId || null,
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      fileSize: attachment.fileSize || null,
      fileType: attachment.fileType,
      uploadedBy: attachment.uploadedBy,
      createdAt: new Date(),
    };
    
    this.supportTicketAttachments.set(newAttachment.id, newAttachment);
    return newAttachment;
  }

  async getSupportTicketAttachments(ticketId: number): Promise<SupportTicketAttachment[]> {
    return Array.from(this.supportTicketAttachments.values())
      .filter(attachment => attachment.ticketId === ticketId);
  }

  // Diagnostic tools methods
  async getAllDiagnosticTools(): Promise<DiagnosticTool[]> {
    return Array.from(this.diagnosticTools.values());
  }

  async getDiagnosticTool(id: string): Promise<DiagnosticTool | undefined> {
    return this.diagnosticTools.get(id);
  }

  async createDiagnosticTool(tool: InsertDiagnosticTool): Promise<DiagnosticTool> {
    const newTool = {
      ...tool,
      createdAt: new Date(),
      updatedAt: new Date()
    } as DiagnosticTool;
    
    this.diagnosticTools.set(tool.id, newTool);
    return newTool;
  }

  async updateDiagnosticTool(id: string, updates: Partial<InsertDiagnosticTool>): Promise<DiagnosticTool> {
    const existingTool = this.diagnosticTools.get(id);
    if (!existingTool) {
      throw new Error("Diagnostic tool not found");
    }

    const updatedTool = {
      ...existingTool,
      ...updates,
      updatedAt: new Date()
    };

    this.diagnosticTools.set(id, updatedTool);
    return updatedTool;
  }

  async deleteDiagnosticTool(id: string): Promise<void> {
    if (!this.diagnosticTools.has(id)) {
      throw new Error("Diagnostic tool not found");
    }
    this.diagnosticTools.delete(id);
  }

  async toggleDiagnosticTool(id: string, isActive: boolean): Promise<DiagnosticTool> {
    const tool = this.diagnosticTools.get(id);
    if (!tool) {
      throw new Error("Diagnostic tool not found");
    }

    const updatedTool = {
      ...tool,
      isActive,
      updatedAt: new Date()
    };

    this.diagnosticTools.set(id, updatedTool);
    return updatedTool;
  }

  private initializeDiagnosticTools() {
    // Initialize with sample diagnostic tools for demo
    const sampleTools = [
      {
        id: "network-speed-test",
        title: "Network Speed Test",
        description: "Test your internet connection speed to diagnose slow browsing or streaming issues",
        category: "network",
        icon: "Wifi",
        isActive: true,
        steps: [
          {
            id: "step1",
            title: "Close all applications",
            description: "Close all running applications and browser tabs to get accurate results",
            order: 1
          },
          {
            id: "step2",
            title: "Run speed test",
            description: "Visit speedtest.net or fast.com and run the speed test",
            order: 2
          },
          {
            id: "step3",
            title: "Check results",
            description: "Compare your results with your internet plan speed. If significantly lower, contact your ISP",
            order: 3
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "computer-restart",
        title: "Computer Restart Fix",
        description: "Resolve common computer issues by performing a proper restart",
        category: "hardware",
        icon: "RotateCcw",
        isActive: true,
        steps: [
          {
            id: "step1",
            title: "Save your work",
            description: "Save all open documents and close all applications",
            order: 1
          },
          {
            id: "step2",
            title: "Restart computer",
            description: "Click Start menu > Power > Restart (not Shut down)",
            order: 2
          },
          {
            id: "step3",
            title: "Wait for full startup",
            description: "Allow the computer to fully boot up before opening applications",
            order: 3
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "printer-connection",
        title: "Printer Connection Check",
        description: "Diagnose and fix printer connectivity issues",
        category: "hardware",
        icon: "Printer",
        isActive: true,
        steps: [
          {
            id: "step1",
            title: "Check power and cables",
            description: "Ensure printer is powered on and all cables are securely connected",
            order: 1
          },
          {
            id: "step2",
            title: "Check printer status",
            description: "Go to Settings > Printers & Scanners and verify printer appears in the list",
            order: 2
          },
          {
            id: "step3",
            title: "Print test page",
            description: "Right-click on your printer and select 'Print test page'",
            order: 3
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "browser-cleanup",
        title: "Browser Cleanup",
        description: "Clear browser cache and cookies to fix loading issues",
        category: "software",
        icon: "Globe",
        isActive: true,
        steps: [
          {
            id: "step1",
            title: "Open browser settings",
            description: "Click on the three dots menu and select Settings",
            order: 1
          },
          {
            id: "step2",
            title: "Clear browsing data",
            description: "Find 'Clear browsing data' or 'Privacy and security' section",
            order: 2
          },
          {
            id: "step3",
            title: "Select data to clear",
            description: "Check 'Cookies' and 'Cached images and files', then click Clear data",
            order: 3
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "password-reset",
        title: "Password Reset Guide",
        description: "Safely reset forgotten passwords for common services",
        category: "security",
        icon: "Key",
        isActive: true,
        steps: [
          {
            id: "step1",
            title: "Go to login page",
            description: "Visit the official login page for the service you need to reset",
            order: 1
          },
          {
            id: "step2",
            title: "Click 'Forgot Password'",
            description: "Look for 'Forgot Password' or 'Reset Password' link",
            order: 2
          },
          {
            id: "step3",
            title: "Check your email",
            description: "Check your email for reset instructions and follow the link provided",
            order: 3
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "create-support-ticket",
        title: "How to Create a Support Ticket",
        description: "Step-by-step guide for creating support tickets from chat conversations for priority help",
        category: "support",
        icon: "Ticket",
        isActive: true,
        steps: [
          {
            id: "step1",
            title: "Start a chat conversation",
            description: "Begin by chatting with our AI assistant about your technical issue to gather initial troubleshooting steps",
            order: 1
          },
          {
            id: "step2",
            title: "Look for the ticket button",
            description: "After your chat conversation, look for the 'Create Support Ticket' button at the bottom of the chat area",
            order: 2
          },
          {
            id: "step3",
            title: "Fill out ticket details",
            description: "Click the button to open the ticket form, add a subject, select category (Technical, Billing, Account, General), choose priority level, and add any additional details",
            order: 3
          },
          {
            id: "step4",
            title: "Review and submit",
            description: "Your chat conversation will be automatically attached to the ticket. Review all details and click 'Create Support Ticket' to submit",
            order: 4
          },
          {
            id: "step5",
            title: "Track your ticket",
            description: "You'll receive a ticket number and email updates. The support team will review your case within 24 hours and provide priority assistance",
            order: 5
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleTools.forEach(tool => {
      this.diagnosticTools.set(tool.id, tool as DiagnosticTool);
    });
  }

  // Regional announcements storage
  private regionAnnouncements = new Map<number, Announcement>();

  private initializeAnnouncements() {
    const sampleAnnouncements = [
      {
        id: 1,
        title: "On-Site Services Available in Ottawa-Gatineau",
        content: "We're excited to announce that our on-site technical support services are now available in the Ottawa-Gatineau region. Our certified technicians can visit your location for hardware repairs, network setup, and other technical services.",
        region: "Ottawa-Gatineau",
        isActive: true,
        priority: "high" as const,
        createdBy: 1,
        createdAt: new Date("2025-01-10T09:00:00Z").toISOString(),
        updatedAt: new Date("2025-01-10T09:00:00Z").toISOString(),
        expiresAt: new Date("2025-03-10T09:00:00Z").toISOString()
      },
      {
        id: 2,
        title: "Extended Support Hours for Holiday Season",
        content: "During the holiday season, our support team will be available with extended hours to help you with any technical issues. Chat support available 24/7, phone support available until 10 PM EST.",
        region: "Canada",
        isActive: true,
        priority: "medium" as const,
        createdBy: 1,
        createdAt: new Date("2025-01-08T14:30:00Z").toISOString(),
        updatedAt: new Date("2025-01-08T14:30:00Z").toISOString(),
        expiresAt: new Date("2025-02-01T14:30:00Z").toISOString()
      },
      {
        id: 3,
        title: "New Mobile App Available",
        content: "Download our new mobile app for iOS and Android to access technical support on the go. Get instant chat support, schedule appointments, and track your service requests from your mobile device.",
        region: "Global",
        isActive: false,
        priority: "low" as const,
        createdBy: 1,
        createdAt: new Date("2025-01-05T11:15:00Z").toISOString(),
        updatedAt: new Date("2025-01-05T11:15:00Z").toISOString(),
        expiresAt: new Date("2025-04-05T11:15:00Z").toISOString()
      }
    ];

    sampleAnnouncements.forEach(announcement => {
      this.regionAnnouncements.set(announcement.id, announcement as Announcement);
    });
  }

  // Regional announcements management methods
  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.regionAnnouncements.values());
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.regionAnnouncements.get(id);
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const id = Math.max(...Array.from(this.regionAnnouncements.keys()), 0) + 1;
    const newAnnouncement = {
      id,
      ...announcement,
      createdBy: 1, // Default admin user ID for demo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Announcement;

    this.regionAnnouncements.set(id, newAnnouncement);
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement> {
    const announcement = this.regionAnnouncements.get(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }

    const updatedAnnouncement = { ...announcement, ...updates } as Announcement;
    this.regionAnnouncements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<void> {
    this.regionAnnouncements.delete(id);
  }

  async toggleAnnouncementStatus(id: number, isActive: boolean): Promise<Announcement> {
    const announcement = this.regionAnnouncements.get(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }

    const updatedAnnouncement = { ...announcement, isActive } as Announcement;
    this.regionAnnouncements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async getActiveAnnouncementsByRegion(region: string): Promise<Announcement[]> {
    const announcements = Array.from(this.regionAnnouncements.values());
    return announcements.filter(announcement => 
      announcement.isActive && 
      (announcement.region === region || announcement.region === "Global")
    );
  }
}

export const storage = new MemoryStorage();