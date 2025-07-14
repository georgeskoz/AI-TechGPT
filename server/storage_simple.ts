import { 
  users, messages, technicians, serviceRequests, jobs, jobUpdates, supportCases, supportMessages, 
  issueCategories, bookingSettings, serviceBookings, disputes, disputeMessages, disputeAttachments, 
  diagnosticTools, announcements, supportTickets, supportTicketMessages, supportTicketAttachments,
  type User, type InsertUser, type UpdateProfile, type Message, type InsertMessage,
  type Technician, type InsertTechnician, type ServiceRequest, type InsertServiceRequest,
  type Job, type InsertJob, type JobUpdate, type InsertJobUpdate,
  type SupportCase, type InsertSupportCase, type SupportMessage, type InsertSupportMessage,
  type IssueCategory, type InsertIssueCategory, type BookingSettings, type InsertBookingSettings,
  type ServiceBooking, type InsertServiceBooking, type Dispute, type InsertDispute,
  type DisputeMessage, type InsertDisputeMessage, type DisputeAttachment, type InsertDisputeAttachment,
  type DiagnosticTool, type InsertDiagnosticTool, type Announcement, type InsertAnnouncement,
  type SupportTicket, type InsertSupportTicket, type SupportTicketMessage, type InsertSupportTicketMessage,
  type SupportTicketAttachment, type InsertSupportTicketAttachment
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateProfile(username: string, profile: UpdateProfile): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Message management
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByUsername(username: string): Promise<Message[]>;
  
  // Technician management
  createTechnician(technician: InsertTechnician): Promise<Technician>;
  getTechnician(id: number): Promise<Technician | undefined>;
  getTechnicianByUserId(userId: number): Promise<Technician | undefined>;
  updateTechnician(id: number, updates: Partial<Technician>): Promise<Technician>;
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

  // Additional methods for admin and advanced features
  getAdminDashboardStats(): Promise<any>;
  getAllUsers(): Promise<User[]>;
  getAllTechnicians(): Promise<Technician[]>;
  getAllJobs(): Promise<Job[]>;
  getAllServiceRequests(): Promise<ServiceRequest[]>;
  getAllDisputes(): Promise<Dispute[]>;
  
  // Support features
  createSupportCase(supportCase: InsertSupportCase): Promise<SupportCase>;
  getSupportCase(id: number): Promise<SupportCase | undefined>;
  getSupportCasesByCustomer(customerId: number): Promise<SupportCase[]>;
  updateSupportCaseStatus(id: number, status: string, technicianId?: number): Promise<SupportCase>;
  
  createSupportMessage(message: InsertSupportMessage): Promise<SupportMessage>;
  getSupportMessages(caseId: number): Promise<SupportMessage[]>;
  
  // Business Information
  updateBusinessInfo(userId: number, businessInfo: any): Promise<User>;
  getBusinessInfo(userId: number): Promise<any>;
  
  // Service Booking Management
  createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking>;
  getServiceBooking(id: number): Promise<ServiceBooking | undefined>;
  getServiceBookingsByCustomer(customerId: number): Promise<ServiceBooking[]>;
  updateServiceBooking(id: number, updates: Partial<ServiceBooking>): Promise<ServiceBooking>;
  
  // Cross-Role Integration Methods
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserLastLogin(userId: number): Promise<void>;
  updateUserRole(userId: number, role: string): Promise<User>;
  getCustomerProfile(userId: number): Promise<any>;
  getJobsByCustomer(customerId: number): Promise<Job[]>;
  getJobsByServiceProvider(serviceProviderId: number): Promise<Job[]>;
  getTicketsByUser(userId: number): Promise<SupportTicket[]>;
  getServiceProviderProfile(userId: number): Promise<any>;
  getServiceProviderEarnings(userId: number): Promise<any>;
  getPlatformStats(): Promise<any>;
  getUserNotifications(userId: number): Promise<any[]>;
  getSystemMessages(): Promise<any[]>;
  createNotification(notification: any): Promise<any>;
  createSupportTicket(ticketData: any): Promise<SupportTicket>;
  updateJobStatus(jobId: number, status: string, notes?: string): Promise<Job>;
}

export class MemoryStorage implements IStorage {
  private users = new Map<number, User>();
  private messages = new Map<number, Message>();
  private technicians = new Map<number, Technician>();
  private serviceRequests = new Map<number, ServiceRequest>();
  private jobs = new Map<number, Job>();
  private jobUpdates = new Map<number, JobUpdate>();
  private supportCases = new Map<number, SupportCase>();
  private supportMessages = new Map<number, SupportMessage>();
  private issueCategories = new Map<number, IssueCategory>();
  private bookingSettings = new Map<number, BookingSettings>();
  private serviceBookings = new Map<number, ServiceBooking>();
  private disputes = new Map<number, Dispute>();
  private disputeMessages = new Map<number, DisputeMessage>();
  private disputeAttachments = new Map<number, DisputeAttachment>();
  private diagnosticTools = new Map<number, DiagnosticTool>();
  private announcements = new Map<number, Announcement>();
  private supportTickets = new Map<number, SupportTicket>();
  private supportTicketMessages = new Map<number, SupportTicketMessage>();
  private supportTicketAttachments = new Map<number, SupportTicketAttachment>();
  
  private nextId = 1;
  private nextUserId = 1;
  private nextTechnicianId = 1;
  private nextServiceRequestId = 1;
  private nextJobId = 1;
  private nextJobUpdateId = 1;
  private nextSupportCaseId = 1;
  private nextSupportMessageId = 1;
  private nextIssueCategoryId = 1;
  private nextBookingSettingsId = 1;
  private nextServiceBookingId = 1;
  private nextDisputeId = 1;
  private nextDisputeMessageId = 1;
  private nextDisputeAttachmentId = 1;
  private nextDiagnosticToolId = 1;
  private nextAnnouncementId = 1;
  private nextSupportTicketId = 1;
  private nextSupportTicketMessageId = 1;
  private nextSupportTicketAttachmentId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create some sample users
    const sampleUsers: InsertUser[] = [
      {
        username: "john_doe",
        password: "password123",
        email: "john@example.com",
        fullName: "John Doe",
        userType: "customer",
        phone: "555-0123",
        address: "123 Main St, Toronto, ON"
      },
      {
        username: "jane_smith",
        password: "password123",
        email: "jane@example.com",
        fullName: "Jane Smith",
        userType: "technician",
        phone: "555-0124",
        address: "456 Oak Ave, Vancouver, BC"
      },
      {
        username: "admin_user",
        password: "admin123",
        email: "admin@techgpt.com",
        fullName: "Admin User",
        userType: "admin",
        phone: "555-0125",
        address: "789 Admin Blvd, Ottawa, ON"
      }
    ];

    // Initialize users
    sampleUsers.forEach(user => {
      const newUser: User = {
        id: this.nextUserId++,
        ...user,
        bio: null,
        avatar: null,
        city: null,
        state: null,
        country: "Canada",
        timezone: "America/Toronto",
        language: "en",
        newsletter: true,
        lastLogin: null,
        isActive: true,
        emailVerified: true,
        phoneVerified: false,
        twoFactorEnabled: false,
        paymentMethod: null,
        paymentMethodSetup: false,
        paymentDetails: null,
        businessInfo: null,
        preferences: null,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(newUser.id, newUser);
    });

    // Initialize some sample messages
    const sampleMessages: InsertMessage[] = [
      {
        content: "Hello! I need help with my computer setup.",
        username: "john_doe",
        isFromUser: true,
        domain: "Hardware Issues"
      },
      {
        content: "I'd be happy to help you with your computer setup. What specific issues are you experiencing?",
        username: "john_doe",
        isFromUser: false,
        domain: "Hardware Issues"
      }
    ];

    // Initialize messages
    sampleMessages.forEach(message => {
      const newMessage: Message = {
        id: this.nextId++,
        ...message,
        timestamp: new Date(),
        metadata: null
      };
      this.messages.set(newMessage.id, newMessage);
    });

    // Initialize some sample technicians
    const sampleTechnicians: InsertTechnician[] = [
      {
        userId: 2, // jane_smith
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phoneNumber: "555-0124",
        address: "456 Oak Ave, Vancouver, BC",
        businessName: "Smith Tech Solutions",
        companyName: "Smith Tech Solutions",
        experience: "5 years",
        hourlyRate: "85",
        country: "Canada",
        state: "BC",
        city: "Vancouver",
        postalCode: "V6B 1A1",
        skills: ["Hardware Repair", "Network Setup", "Software Installation"],
        certifications: ["CompTIA A+", "Network+"],
        specializations: ["PC Hardware", "Networking"],
        availableHours: ["9AM-5PM"],
        serviceRadius: 25,
        vehicleType: "Car",
        isAvailable: true,
        isVerified: true,
        rating: 4.8,
        totalJobs: 127,
        completedJobs: 125,
        cancelledJobs: 2,
        bio: "Experienced technician specializing in hardware and networking solutions.",
        profileImage: null,
        languages: ["English", "French"],
        emergencyService: true,
        weekendService: true,
        insuranceVerified: true,
        backgroundCheckVerified: true,
        location: "Vancouver, BC",
        coordinates: null,
        serviceTypes: ["remote", "onsite", "phone"],
        priceRange: "$70-$100",
        responseTime: "< 1 hour",
        availability: "Monday-Friday 9AM-5PM",
        portfolioImages: null,
        reviews: null,
        verificationDocuments: null,
        businessLicense: null,
        insuranceCertificate: null,
        backgroundCheck: null,
        adminNotes: null,
        verifiedBy: null,
        verifiedAt: null,
        remoteEarningPercentage: "85",
        phoneEarningPercentage: "85",
        onsiteEarningPercentage: "85"
      }
    ];

    // Initialize technicians
    sampleTechnicians.forEach(technician => {
      const newTechnician: Technician = {
        id: this.nextTechnicianId++,
        ...technician,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.technicians.set(newTechnician.id, newTechnician);
    });
  }

  // User methods
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
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.nextUserId++,
      ...user,
      bio: null,
      avatar: null,
      city: null,
      state: null,
      country: "Canada",
      timezone: "America/Toronto",
      language: "en",
      newsletter: true,
      lastLogin: null,
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      paymentMethod: null,
      paymentMethodSetup: false,
      paymentDetails: null,
      businessInfo: null,
      preferences: null,
      metadata: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async updateProfile(username: string, profile: UpdateProfile): Promise<User> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      ...profile,
      updatedAt: new Date()
    };
    this.users.set(user.id, updatedUser);
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
    return updatedUser;
  }

  // Message methods
  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = {
      id: this.nextId++,
      ...message,
      timestamp: new Date(),
      metadata: null
    };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }

  async getMessagesByUsername(username: string): Promise<Message[]> {
    const messages = Array.from(this.messages.values());
    return messages.filter(message => message.username === username);
  }

  // Customer Profile methods
  async getCustomerProfile(userId: number): Promise<any> {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      phoneCountryCode: '+1',
      country: user.country || 'CA',
      province: user.state || '',
      city: user.city || '',
      address: user.address || '',
      postalCode: user.postalCode || '',
      preferences: user.preferences || {
        notifications: true,
        newsletter: false,
        sms: false,
        emailSupport: true,
      },
      businessInfo: user.businessInfo || {
        isBusinessCustomer: false,
        businessName: '',
        businessType: '',
        taxId: '',
        billingAddress: '',
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async updateCustomerProfile(userId: number, profileData: any): Promise<any> {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }

    const updatedUser: User = {
      ...user,
      fullName: profileData.fullName || user.fullName,
      email: profileData.email || user.email,
      phoneNumber: profileData.phoneNumber || user.phoneNumber,
      country: profileData.country || user.country,
      state: profileData.province || user.state,
      city: profileData.city || user.city,
      address: profileData.address || user.address,
      postalCode: profileData.postalCode || user.postalCode,
      preferences: profileData.preferences || user.preferences,
      businessInfo: profileData.businessInfo || user.businessInfo,
      updatedAt: new Date()
    };

    this.users.set(userId, updatedUser);
    return this.getCustomerProfile(userId);
  }

  async createCustomerProfile(profileData: any): Promise<any> {
    const newUser: User = {
      id: this.nextUserId++,
      username: profileData.email || `user${this.nextUserId}`,
      fullName: profileData.fullName,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber,
      address: profileData.address,
      bio: null,
      avatar: null,
      city: profileData.city,
      state: profileData.province,
      country: profileData.country,
      postalCode: profileData.postalCode,
      timezone: "America/Toronto",
      language: "en",
      newsletter: true,
      lastLogin: null,
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      paymentMethod: null,
      paymentMethodSetup: false,
      paymentDetails: null,
      businessInfo: profileData.businessInfo,
      preferences: profileData.preferences,
      metadata: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(newUser.id, newUser);
    return this.getCustomerProfile(newUser.id);
  }

  // Technician methods
  async createTechnician(technician: InsertTechnician): Promise<Technician> {
    const newTechnician: Technician = {
      id: this.nextTechnicianId++,
      ...technician,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.technicians.set(newTechnician.id, newTechnician);
    return newTechnician;
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
    
    return technicians.filter(technician => {
      if (criteria.availability !== undefined && technician.isAvailable !== criteria.availability) {
        return false;
      }
      
      if (criteria.skills && criteria.skills.length > 0) {
        const technicianSkills = technician.skills || [];
        const hasMatchingSkills = criteria.skills.some(skill => 
          technicianSkills.includes(skill)
        );
        if (!hasMatchingSkills) {
          return false;
        }
      }
      
      if (criteria.location && technician.location) {
        if (!technician.location.toLowerCase().includes(criteria.location.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });
  }

  // Service request methods
  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const newRequest: ServiceRequest = {
      id: this.nextServiceRequestId++,
      ...request,
      status: "pending",
      technicianId: null,
      scheduledAt: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.serviceRequests.set(newRequest.id, newRequest);
    return newRequest;
  }

  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    return this.serviceRequests.get(id);
  }

  async getServiceRequestsByCustomer(customerId: number): Promise<ServiceRequest[]> {
    const requests = Array.from(this.serviceRequests.values());
    return requests.filter(request => request.customerId === customerId);
  }

  async getServiceRequestsByTechnician(technicianId: number): Promise<ServiceRequest[]> {
    const requests = Array.from(this.serviceRequests.values());
    return requests.filter(request => request.technicianId === technicianId);
  }

  async updateServiceRequestStatus(id: number, status: string, technicianId?: number): Promise<ServiceRequest> {
    const request = this.serviceRequests.get(id);
    if (!request) {
      throw new Error("Service request not found");
    }

    const updatedRequest: ServiceRequest = {
      ...request,
      status,
      technicianId: technicianId || request.technicianId,
      updatedAt: new Date()
    };
    this.serviceRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Job methods
  async createJob(job: InsertJob): Promise<Job> {
    const newJob: Job = {
      id: this.nextJobId++,
      ...job,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.jobs.set(newJob.id, newJob);
    return newJob;
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getJobsByCustomer(customerId: number): Promise<Job[]> {
    const jobs = Array.from(this.jobs.values());
    return jobs.filter(job => job.customerId === customerId);
  }

  async getJobsByTechnician(technicianId: number): Promise<Job[]> {
    const jobs = Array.from(this.jobs.values());
    return jobs.filter(job => job.technicianId === technicianId);
  }

  async updateJobStatus(id: number, status: string, updates?: Partial<Job>): Promise<Job> {
    const job = this.jobs.get(id);
    if (!job) {
      throw new Error("Job not found");
    }

    const updatedJob: Job = {
      ...job,
      ...updates,
      status,
      updatedAt: new Date()
    };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  // Job update methods
  async createJobUpdate(update: InsertJobUpdate): Promise<JobUpdate> {
    const newUpdate: JobUpdate = {
      id: this.nextJobUpdateId++,
      ...update,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.jobUpdates.set(newUpdate.id, newUpdate);
    return newUpdate;
  }

  async getJobUpdates(jobId: number): Promise<JobUpdate[]> {
    const updates = Array.from(this.jobUpdates.values());
    return updates.filter(update => update.jobId === jobId);
  }

  // Support methods
  async createSupportCase(supportCase: InsertSupportCase): Promise<SupportCase> {
    const newCase: SupportCase = {
      id: this.nextSupportCaseId++,
      ...supportCase,
      endTime: null,
      totalDuration: null,
      isFreeSupport: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.supportCases.set(newCase.id, newCase);
    return newCase;
  }

  async getSupportCase(id: number): Promise<SupportCase | undefined> {
    return this.supportCases.get(id);
  }

  async getSupportCasesByCustomer(customerId: number): Promise<SupportCase[]> {
    const cases = Array.from(this.supportCases.values());
    return cases.filter(case_ => case_.customerId === customerId);
  }

  async updateSupportCaseStatus(id: number, status: string, technicianId?: number): Promise<SupportCase> {
    const case_ = this.supportCases.get(id);
    if (!case_) {
      throw new Error("Support case not found");
    }

    const updatedCase: SupportCase = {
      ...case_,
      status,
      technicianId: technicianId || case_.technicianId,
      updatedAt: new Date()
    };
    this.supportCases.set(id, updatedCase);
    return updatedCase;
  }

  async createSupportMessage(message: InsertSupportMessage): Promise<SupportMessage> {
    const newMessage: SupportMessage = {
      id: this.nextSupportMessageId++,
      ...message,
      isRead: null,
      timestamp: new Date()
    };
    this.supportMessages.set(newMessage.id, newMessage);
    return newMessage;
  }

  async getSupportMessages(caseId: number): Promise<SupportMessage[]> {
    const messages = Array.from(this.supportMessages.values());
    return messages.filter(message => message.caseId === caseId);
  }

  // Business info methods
  async updateBusinessInfo(userId: number, businessInfo: any): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      businessInfo,
      updatedAt: new Date()
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getBusinessInfo(userId: number): Promise<any> {
    const user = this.users.get(userId);
    return user?.businessInfo || null;
  }

  // Admin methods
  async getAdminDashboardStats(): Promise<any> {
    return {
      totalUsers: this.users.size,
      totalTechnicians: this.technicians.size,
      totalJobs: this.jobs.size,
      totalServiceRequests: this.serviceRequests.size,
      totalSupportCases: this.supportCases.size,
      totalDisputes: this.disputes.size,
      activeJobs: Array.from(this.jobs.values()).filter(job => job.status === "active").length,
      completedJobs: Array.from(this.jobs.values()).filter(job => job.status === "completed").length,
      pendingRequests: Array.from(this.serviceRequests.values()).filter(req => req.status === "pending").length,
      revenue: 0, // Mock value
      avgRating: 4.5, // Mock value
      uptime: 99.9 // Mock value
    };
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllTechnicians(): Promise<Technician[]> {
    return Array.from(this.technicians.values());
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getAllServiceRequests(): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values());
  }

  async getAllDisputes(): Promise<Dispute[]> {
    return Array.from(this.disputes.values());
  }

  // Cross-Role Integration Methods Implementation
  async updateUserLastLogin(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.updatedAt = new Date();
      this.users.set(userId, user);
    }
  }

  async updateUserRole(userId: number, role: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser: User = {
      ...user,
      userType: role as any,
      updatedAt: new Date()
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getCustomerProfile(userId: number): Promise<any> {
    const user = this.users.get(userId);
    if (!user) return null;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      country: user.country,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      accountActive: user.accountActive,
      paymentMethod: user.paymentMethod,
      paymentMethodSetup: user.paymentMethodSetup,
      createdAt: user.createdAt
    };
  }

  async getJobsByServiceProvider(serviceProviderId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.technicianId === serviceProviderId);
  }

  async getTicketsByUser(userId: number): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values()).filter(ticket => ticket.userId === userId);
  }

  async getServiceProviderProfile(userId: number): Promise<any> {
    const user = this.users.get(userId);
    const technician = Array.from(this.technicians.values()).find(t => t.userId === userId);
    
    if (!user || !technician) return null;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      bio: user.bio,
      avatar: user.avatar,
      specialties: technician.specialties,
      serviceTypes: technician.serviceTypes,
      hourlyRate: technician.hourlyRate,
      availability: technician.availability,
      rating: technician.rating,
      completedJobs: technician.completedJobs,
      responseTimeMinutes: technician.responseTimeMinutes,
      location: technician.location,
      serviceRadius: technician.serviceRadius,
      verified: technician.verified,
      createdAt: technician.createdAt
    };
  }

  async getServiceProviderEarnings(userId: number): Promise<any> {
    const providerJobs = await this.getJobsByServiceProvider(userId);
    const completedJobs = providerJobs.filter(job => job.status === 'completed');
    const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.totalCost || 0), 0);
    const pendingJobs = providerJobs.filter(job => job.status === 'in_progress');
    const pendingEarnings = pendingJobs.reduce((sum, job) => sum + (job.totalCost || 0), 0);
    
    return {
      totalEarnings,
      pendingEarnings,
      completedJobs: completedJobs.length,
      activeJobs: pendingJobs.length,
      monthlyEarnings: Math.floor(totalEarnings / 3), // Mock monthly calculation
      averageJobValue: completedJobs.length > 0 ? totalEarnings / completedJobs.length : 0
    };
  }

  async getPlatformStats(): Promise<any> {
    return {
      totalUsers: this.users.size,
      totalServiceProviders: this.technicians.size,
      totalJobs: this.jobs.size,
      completedJobs: Array.from(this.jobs.values()).filter(job => job.status === 'completed').length,
      activeJobs: Array.from(this.jobs.values()).filter(job => job.status === 'in_progress').length,
      totalRevenue: Array.from(this.jobs.values())
        .filter(job => job.status === 'completed')
        .reduce((sum, job) => sum + (job.totalCost || 0), 0),
      averageRating: 4.5,
      customerSatisfaction: 95,
      supportTickets: this.supportTickets.size,
      openTickets: Array.from(this.supportTickets.values()).filter(ticket => ticket.status === 'open').length
    };
  }

  async getUserNotifications(userId: number): Promise<any[]> {
    // Mock notifications for the user
    return [
      {
        id: 1,
        userId,
        title: "New job available",
        message: "A new job matching your skills is available in your area",
        type: "job_opportunity",
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: 2,
        userId,
        title: "Payment received",
        message: "You have received payment for job #12345",
        type: "payment",
        read: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ];
  }

  async getSystemMessages(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "System Maintenance",
        message: "Scheduled maintenance will occur tonight from 2 AM to 4 AM EST",
        type: "maintenance",
        priority: "medium",
        createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      },
      {
        id: 2,
        title: "New Features Available",
        message: "Check out the new invoice modification system for service providers",
        type: "feature",
        priority: "low",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
      }
    ];
  }

  async createNotification(notification: any): Promise<any> {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false,
      createdAt: new Date()
    };
    
    // In a real implementation, this would be stored in a notifications table
    return newNotification;
  }

  async createSupportTicket(ticketData: any): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      id: this.nextSupportTicketId++,
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.supportTickets.set(newTicket.id, newTicket);
    return newTicket;
  }

  // Service Booking Management Methods
  async createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking> {
    const newBooking: ServiceBooking = {
      id: this.nextServiceBookingId++,
      ...booking,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.serviceBookings.set(newBooking.id, newBooking);
    return newBooking;
  }

  async getServiceBooking(id: number): Promise<ServiceBooking | undefined> {
    return this.serviceBookings.get(id);
  }

  async getServiceBookingsByCustomer(customerId: number): Promise<ServiceBooking[]> {
    return Array.from(this.serviceBookings.values()).filter(booking => booking.customerId === customerId);
  }

  async updateServiceBooking(id: number, updates: Partial<ServiceBooking>): Promise<ServiceBooking> {
    const booking = this.serviceBookings.get(id);
    if (!booking) {
      throw new Error(`Service booking with id ${id} not found`);
    }
    
    const updatedBooking = {
      ...booking,
      ...updates,
      updatedAt: new Date()
    };
    
    this.serviceBookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

export const storage = new MemoryStorage();