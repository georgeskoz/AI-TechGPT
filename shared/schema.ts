import { pgTable, text, serial, boolean, timestamp, decimal, jsonb, integer, varchar, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Customer accounts table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"), // nullable for social login users
  email: text("email"),
  fullName: text("full_name"),
  bio: text("bio"),
  avatar: text("avatar"),
  
  // Social media authentication
  socialProviders: jsonb("social_providers").$type<{
    google?: { id: string; email: string; name: string; avatar?: string };
    facebook?: { id: string; email: string; name: string; avatar?: string };
    apple?: { id: string; email?: string; name?: string; avatar?: string };
    instagram?: { id: string; username: string; name?: string; avatar?: string };
    twitter?: { id: string; username: string; name?: string; avatar?: string };
    github?: { id: string; username: string; name?: string; avatar?: string };
    linkedin?: { id: string; email: string; name: string; avatar?: string };
  }>(),
  authMethod: text("auth_method").notNull().default("email"), // email, google, facebook, apple, instagram, twitter, github, linkedin
  lastLoginMethod: text("last_login_method"), // tracks which method user last used
  
  // Customer contact information
  phone: text("phone"),
  street: text("street"),
  apartment: text("apartment"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("Canada"),
  
  // Account status fields
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  identityVerified: boolean("identity_verified").default(false),
  accountActive: boolean("account_active").default(true),
  
  // Business information (optional for business users)
  businessInfo: jsonb("business_info").$type<{
    businessName?: string;
    businessType?: string;
    industry?: string;
    taxId?: string;
    website?: string;
    description?: string;
  }>(),
  
  // Payment method configuration
  paymentMethod: text("payment_method"), // credit_card, paypal, apple_pay, google_pay (legacy single method)
  paymentMethods: jsonb("payment_methods").$type<string[]>(), // Array of payment methods
  paymentMethodSetup: boolean("payment_method_setup").default(false),
  paymentDetails: jsonb("payment_details").$type<{
    cardLast4?: string;
    cardBrand?: string;
    paypalEmail?: string;
    applePayEnabled?: boolean;
    googlePayEnabled?: boolean;
  }>(),
  
  // Notification preferences
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  marketingEmails: boolean("marketing_emails").default(true),
  
  // Two-factor authentication
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorMethod: text("two_factor_method"), // sms, email, app
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Service Provider accounts table
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"), // nullable for social login users
  email: text("email"),
  fullName: text("full_name"),
  bio: text("bio"),
  avatar: text("avatar"),
  
  // Social media authentication
  socialProviders: jsonb("social_providers").$type<{
    google?: { id: string; email: string; name: string; avatar?: string };
    facebook?: { id: string; email: string; name: string; avatar?: string };
    apple?: { id: string; email?: string; name?: string; avatar?: string };
    instagram?: { id: string; username: string; name?: string; avatar?: string };
    twitter?: { id: string; username: string; name?: string; avatar?: string };
    github?: { id: string; username: string; name?: string; avatar?: string };
    linkedin?: { id: string; email: string; name: string; avatar?: string };
  }>(),
  authMethod: text("auth_method").notNull().default("email"), // email, google, facebook, apple, instagram, twitter, github, linkedin
  lastLoginMethod: text("last_login_method"), // tracks which method user last used
  
  // Service provider specific fields
  phone: text("phone"),
  street: text("street"),
  apartment: text("apartment"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("Canada"),
  
  // Professional information
  businessInfo: jsonb("business_info").$type<{
    businessName?: string;
    businessType?: string;
    industry?: string;
    taxId?: string;
    website?: string;
    description?: string;
    certifications?: string[];
    skills?: string[];
    languages?: string[];
    serviceAreas?: string[];
    hourlyRates?: {
      remote?: number;
      phone?: number;
      onsite?: number;
    };
  }>(),
  
  // Account status fields
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  identityVerified: boolean("identity_verified").default(false),
  backgroundCheckVerified: boolean("background_check_verified").default(false),
  accountActive: boolean("account_active").default(true),
  accountApproved: boolean("account_approved").default(false),
  
  // Service provider metrics
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0.00'),
  totalJobs: integer("total_jobs").default(0),
  completedJobs: integer("completed_jobs").default(0),
  responseTime: integer("response_time").default(0), // in minutes
  
  // Notification preferences
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  marketingEmails: boolean("marketing_emails").default(true),
  
  // Two-factor authentication
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorMethod: text("two_factor_method"), // sms, email, app
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Legacy users table (for backward compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"), // nullable for social login users
  email: text("email"),
  fullName: text("full_name"),
  bio: text("bio"),
  avatar: text("avatar"),
  userType: text("user_type").notNull().default("customer"), // customer, technician, admin
  
  // Social media authentication
  socialProviders: jsonb("social_providers").$type<{
    google?: { id: string; email: string; name: string; avatar?: string };
    facebook?: { id: string; email: string; name: string; avatar?: string };
    apple?: { id: string; email?: string; name?: string; avatar?: string };
    instagram?: { id: string; username: string; name?: string; avatar?: string };
    twitter?: { id: string; username: string; name?: string; avatar?: string };
    github?: { id: string; username: string; name?: string; avatar?: string };
    linkedin?: { id: string; email: string; name: string; avatar?: string };
  }>(),
  authMethod: text("auth_method").notNull().default("email"), // email, google, facebook, apple, instagram, twitter, github, linkedin
  lastLoginMethod: text("last_login_method"), // tracks which method user last used
  
  // Customer contact information
  phone: text("phone"),
  street: text("street"),
  apartment: text("apartment"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("Canada"),
  
  // Account status fields
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  identityVerified: boolean("identity_verified").default(false),
  accountActive: boolean("account_active").default(true),
  
  // Business information (optional for business users)
  businessInfo: jsonb("business_info").$type<{
    businessName?: string;
    businessType?: string;
    industry?: string;
    taxId?: string;
    website?: string;
    description?: string;
  }>(),
  
  // Payment method configuration
  paymentMethod: text("payment_method"), // credit_card, paypal, apple_pay, google_pay (legacy single method)
  paymentMethods: jsonb("payment_methods").$type<string[]>(), // Array of payment methods
  paymentMethodSetup: boolean("payment_method_setup").default(false),
  paymentDetails: jsonb("payment_details").$type<{
    cardLast4?: string;
    cardBrand?: string;
    paypalEmail?: string;
    applePayEnabled?: boolean;
    googlePayEnabled?: boolean;
  }>(),
  
  // Notification preferences
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  marketingEmails: boolean("marketing_emails").default(true),
  
  // Two-factor authentication
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorMethod: text("two_factor_method"), // sms, email, app
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Admin users with roles and permissions
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default("admin"), // admin, super_admin, manager, support
  permissions: jsonb("permissions").$type<string[]>(), // Array of permission strings
  department: text("department"), // technical, customer_service, finance, operations
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Support tickets system
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull().unique(),
  userId: integer("user_id").notNull().references(() => users.id),
  assignedTo: integer("assigned_to").references(() => adminUsers.id),
  
  // Basic ticket information
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // technical, billing, account, general
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  status: text("status").notNull().default("open"), // open, in_progress, resolved, closed
  source: text("source").notNull().default("chat"), // chat, email, phone, web_form
  
  // Chat integration
  chatConversation: jsonb("chat_conversation").$type<{
    username: string;
    messages: Array<{
      content: string;
      isUser: boolean;
      timestamp: string;
      domain?: string;
    }>;
  }>(),
  
  // Resolution tracking
  resolution: text("resolution"),
  resolvedBy: integer("resolved_by").references(() => adminUsers.id),
  resolvedAt: timestamp("resolved_at"),
  
  // Customer satisfaction
  customerRating: integer("customer_rating"), // 1-5 stars
  customerFeedback: text("customer_feedback"),
  
  // SLA tracking
  firstResponseAt: timestamp("first_response_at"),
  lastResponseAt: timestamp("last_response_at"),
  
  // Metadata
  tags: jsonb("tags").$type<string[]>(),
  internalNotes: text("internal_notes"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Support ticket messages/communications
export const supportTicketMessages = pgTable("support_ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => supportTickets.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  senderType: text("sender_type").notNull(), // customer, admin, system
  
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"), // text, attachment, internal_note
  attachments: jsonb("attachments").$type<string[]>(),
  
  isInternal: boolean("is_internal").default(false), // Only visible to admins
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Regional announcements for admins
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  region: text("region").notNull(), // Ottawa-Gatineau, Toronto, Montreal, Global, etc.
  priority: text("priority").notNull().default("medium"), // low, medium, high
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdBy: integer("created_by").notNull().references(() => adminUsers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Announcement types
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

// Diagnostic tools for quick troubleshooting
export const diagnosticTools = pgTable("diagnostic_tools", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // hardware, network, software, security, performance, mobile, general
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true),
  steps: jsonb("steps").$type<Array<{
    id: string;
    title: string;
    description: string;
    order: number;
  }>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Support ticket attachments
export const supportTicketAttachments = pgTable("support_ticket_attachments", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => supportTickets.id),
  messageId: integer("message_id").references(() => supportTicketMessages.id),
  
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"), // in bytes
  fileType: text("file_type").notNull(),
  uploadedBy: integer("uploaded_by").notNull().references(() => users.id),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Admin-managed categories for issue assessment
export const issueCategories = pgTable("issue_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull().default("wrench"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Technician profiles with skills and availability
export const technicians = pgTable("technicians", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  // Business Information
  businessName: text("business_name"),
  companyName: text("company_name"),
  experience: text("experience"), // beginner, intermediate, advanced, expert
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  // Geographic location
  country: text("country"),
  state: text("state"), // state for US, province for Canada
  city: text("city"),
  location: text("location"), // Combined location string for backward compatibility
  serviceRadius: integer("service_radius").default(25), // miles
  serviceAreas: jsonb("service_areas").$type<string[]>(), // Array of service areas
  skills: jsonb("skills").$type<string[]>(), // Array of technical skills
  categories: jsonb("categories").$type<string[]>(), // Array of service categories
  certifications: jsonb("certifications").$type<string[]>(), // Array of certifications
  languages: jsonb("languages").$type<string[]>(), // Array of languages spoken
  availability: jsonb("availability").$type<{
    monday?: { start: string; end: string; available: boolean };
    tuesday?: { start: string; end: string; available: boolean };
    wednesday?: { start: string; end: string; available: boolean };
    thursday?: { start: string; end: string; available: boolean };
    friday?: { start: string; end: string; available: boolean };
    saturday?: { start: string; end: string; available: boolean };
    sunday?: { start: string; end: string; available: boolean };
  }>(),
  profileDescription: text("profile_description"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  completedJobs: integer("completed_jobs").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  responseTime: integer("response_time_minutes").default(60), // Average response time in minutes
  // Vehicle Information
  vehicleType: text("vehicle_type"), // car, truck, van, motorcycle, bicycle, none
  vehicleMake: text("vehicle_make"),
  vehicleModel: text("vehicle_model"),
  vehicleYear: integer("vehicle_year"),
  vehicleLicensePlate: text("vehicle_license_plate"),
  // Document Uploads
  backgroundCheckUrl: text("background_check_url"),
  driverLicenseUrl: text("driver_license_url"),
  insuranceUrl: text("insurance_url"),
  // Status and verification
  isActive: boolean("is_active").default(false), // Default false until verified
  isVerified: boolean("is_verified").default(false),
  verificationStatus: text("verification_status").default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"),
  verifiedBy: integer("verified_by"),
  verifiedAt: timestamp("verified_at"),
  stripeAccountId: text("stripe_account_id"),
  
  // Admin-controlled earning percentages per service type
  remoteEarningPercentage: decimal("remote_earning_percentage", { precision: 5, scale: 2 }).default("85.00"), // Admin can set custom %
  phoneEarningPercentage: decimal("phone_earning_percentage", { precision: 5, scale: 2 }).default("85.00"), // Admin can set custom %
  onsiteEarningPercentage: decimal("onsite_earning_percentage", { precision: 5, scale: 2 }).default("85.00"), // Admin can set custom %
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Service requests from customers
export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  technicianId: integer("technician_id").references(() => technicians.id),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  serviceType: text("service_type").notNull(), // remote, phone, onsite
  urgency: text("urgency").notNull(), // low, medium, high, urgent
  estimatedDuration: integer("estimated_duration"), // minutes
  location: text("location"), // for onsite services
  budget: decimal("budget", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("pending"), // pending, matched, in_progress, completed, cancelled
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Job tracking and progress updates
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  serviceRequestId: integer("service_request_id").notNull().references(() => serviceRequests.id),
  technicianId: integer("technician_id").notNull().references(() => technicians.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  status: text("status").notNull().default("assigned"), // assigned, started, in_progress, completed, cancelled
  
  // Detailed timing tracking
  requestedAt: timestamp("requested_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  startedAt: timestamp("started_at"),
  arrivedAt: timestamp("arrived_at"), // for on-site jobs
  completedAt: timestamp("completed_at"),
  
  // Duration tracking
  actualDuration: integer("actual_duration"), // minutes
  travelTime: integer("travel_time"), // minutes for on-site jobs
  
  // Financial tracking
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }),
  technicianEarnings: decimal("technician_earnings", { precision: 10, scale: 2 }),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }),
  
  // Tax and location information
  serviceLocation: text("service_location"), // province/state where service was performed
  taxRate: decimal("tax_rate", { precision: 5, scale: 4 }), // applicable tax rate
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }),
  
  // Payment tracking
  paymentStatus: text("payment_status").default("pending"), // pending, processing, paid, failed
  paymentMethod: text("payment_method"), // stripe, bank_transfer, etc
  paidAt: timestamp("paid_at"),
  payoutStatus: text("payout_status").default("pending"), // pending, processed, paid, failed
  payoutAt: timestamp("payout_at"),
  
  notes: text("notes"),
  customerRating: integer("customer_rating"), // 1-5 stars
  technicianRating: integer("technician_rating"), // 1-5 stars
  customerFeedback: text("customer_feedback"),
  technicianFeedback: text("technician_feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Job progress updates and communication
export const jobUpdates = pgTable("job_updates", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  updatedBy: integer("updated_by").notNull().references(() => users.id),
  updateType: text("update_type").notNull(), // status, message, photo, completion
  title: text("title"),
  description: text("description"),
  attachments: jsonb("attachments").$type<string[]>(), // Array of file URLs
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Admin earning settings per technician
export const technicianEarningSettings = pgTable("technician_earning_settings", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").notNull().references(() => technicians.id),
  
  // Service-specific earning percentages (admin controlled)
  remoteEarningPercentage: decimal("remote_earning_percentage", { precision: 5, scale: 2 }).default("85.00"),
  phoneEarningPercentage: decimal("phone_earning_percentage", { precision: 5, scale: 2 }).default("85.00"),
  onsiteEarningPercentage: decimal("onsite_earning_percentage", { precision: 5, scale: 2 }).default("85.00"),
  
  // Bonus multipliers (admin controlled)
  performanceBonus: decimal("performance_bonus", { precision: 5, scale: 2 }).default("0.00"), // Additional % for high performers
  loyaltyBonus: decimal("loyalty_bonus", { precision: 5, scale: 2 }).default("0.00"), // Additional % for long-term technicians
  
  // Special rates
  premiumServiceRate: decimal("premium_service_rate", { precision: 5, scale: 2 }).default("0.00"), // Extra % for premium services
  
  // Admin notes and effective dates
  adminNotes: text("admin_notes"),
  effectiveDate: timestamp("effective_date").defaultNow(),
  lastModifiedBy: integer("last_modified_by").references(() => users.id), // Admin user who made changes
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Earnings and payment tracking
export const earnings = pgTable("earnings", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").notNull().references(() => technicians.id),
  jobId: integer("job_id").references(() => jobs.id),
  
  // Earnings breakdown
  grossAmount: decimal("gross_amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Tax information
  taxableAmount: decimal("taxable_amount", { precision: 10, scale: 2 }),
  province: text("province"), // For Canadian taxes
  state: text("state"), // For US taxes
  country: text("country").notNull().default("CA"),
  
  // Payment details
  paymentPeriod: text("payment_period").notNull(), // weekly, biweekly, monthly
  paymentDate: timestamp("payment_date"),
  payoutMethod: text("payout_method"), // direct_deposit, paypal, check
  payoutReference: text("payout_reference"), // transaction ID
  payoutStatus: text("payout_status").default("pending"), // pending, processing, completed, failed
  
  // Service details
  serviceType: text("service_type"), // remote, phone, onsite
  serviceDate: timestamp("service_date").notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tax information by province/state
export const taxRates = pgTable("tax_rates", {
  id: serial("id").primaryKey(),
  province: text("province"),
  state: text("state"),
  country: text("country").notNull(),
  
  // Tax rates
  gst: decimal("gst", { precision: 5, scale: 4 }), // Goods and Services Tax (Canada)
  pst: decimal("pst", { precision: 5, scale: 4 }), // Provincial Sales Tax (Canada)
  hst: decimal("hst", { precision: 5, scale: 4 }), // Harmonized Sales Tax (Canada)
  salesTax: decimal("sales_tax", { precision: 5, scale: 4 }), // State sales tax (US)
  
  totalTaxRate: decimal("total_tax_rate", { precision: 5, scale: 4 }).notNull(),
  effectiveDate: timestamp("effective_date").notNull(),
  isActive: boolean("is_active").default(true),
});

// Payment schedules and statements
export const paymentSchedules = pgTable("payment_schedules", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").notNull().references(() => technicians.id),
  
  // Schedule settings
  frequency: text("frequency").notNull().default("weekly"), // weekly, biweekly, monthly
  dayOfWeek: integer("day_of_week"), // 1-7 for weekly payments
  dayOfMonth: integer("day_of_month"), // 1-31 for monthly payments
  
  // Banking information
  bankAccount: text("bank_account"), // encrypted
  routingNumber: text("routing_number"), // encrypted
  accountType: text("account_type"), // checking, savings
  
  // Minimum payout threshold
  minimumPayout: decimal("minimum_payout", { precision: 10, scale: 2 }).default("25.00"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Financial statements for tax purposes
export const statements = pgTable("statements", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").notNull().references(() => technicians.id),
  
  // Statement period
  statementType: text("statement_type").notNull(), // weekly, monthly, quarterly, annual, t4a
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Financial summary
  totalGrossEarnings: decimal("total_gross_earnings", { precision: 10, scale: 2 }).notNull(),
  totalPlatformFees: decimal("total_platform_fees", { precision: 10, scale: 2 }).notNull(),
  totalNetEarnings: decimal("total_net_earnings", { precision: 10, scale: 2 }).notNull(),
  totalTaxableAmount: decimal("total_taxable_amount", { precision: 10, scale: 2 }),
  
  // Job statistics
  totalJobs: integer("total_jobs").notNull(),
  remoteJobs: integer("remote_jobs").default(0),
  phoneJobs: integer("phone_jobs").default(0),
  onsiteJobs: integer("onsite_jobs").default(0),
  totalHours: decimal("total_hours", { precision: 8, scale: 2 }),
  
  // Tax breakdown by province/state
  taxBreakdown: jsonb("tax_breakdown").$type<{
    province?: string;
    state?: string;
    gst?: number;
    pst?: number;
    hst?: number;
    salesTax?: number;
    totalTax?: number;
  }>(),
  
  // Statement file
  pdfUrl: text("pdf_url"), // Generated PDF statement
  generatedAt: timestamp("generated_at"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Job dispatch requests for real-time notifications
export const jobDispatchRequests = pgTable("job_dispatch_requests", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => supportTickets.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  technicianId: integer("technician_id").notNull().references(() => users.id),
  
  // Service details
  serviceType: text("service_type").notNull(), // onsite, remote, phone
  category: text("category").notNull(),
  description: text("description").notNull(),
  urgency: text("urgency").notNull().default("medium"), // low, medium, high, urgent
  
  // Location and logistics
  customerLocation: jsonb("customer_location").$type<{
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    zipCode: string;
  }>(),
  technicianLocation: jsonb("technician_location").$type<{
    latitude: number;
    longitude: number;
  }>(),
  
  // AI estimates
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  estimatedDuration: integer("estimated_duration"), // in minutes
  estimatedDistance: decimal("estimated_distance", { precision: 8, scale: 2 }), // in miles
  estimatedETA: integer("estimated_eta"), // in minutes
  trafficFactor: decimal("traffic_factor", { precision: 3, scale: 2 }).default('1.00'),
  
  // Response tracking
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, expired, reassigned
  responseDeadline: timestamp("response_deadline").notNull(), // 60 seconds from creation
  respondedAt: timestamp("responded_at"),
  responseTimeSeconds: integer("response_time_seconds"),
  
  // Analytics
  notificationSentAt: timestamp("notification_sent_at"),
  viewedAt: timestamp("viewed_at"),
  reassignmentCount: integer("reassignment_count").default(0),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Provider response analytics
export const providerResponseAnalytics = pgTable("provider_response_analytics", {
  id: serial("id").primaryKey(),
  dispatchRequestId: integer("dispatch_request_id").notNull().references(() => jobDispatchRequests.id),
  technicianId: integer("technician_id").notNull().references(() => users.id),
  
  // Response metrics
  responseAction: text("response_action").notNull(), // accepted, rejected, timeout
  responseTimeSeconds: integer("response_time_seconds"),
  deviceType: text("device_type"), // web, mobile, desktop
  userAgent: text("user_agent"),
  
  // Context data
  technicianCurrentWorkload: integer("technician_current_workload"),
  technicianAvailabilityStatus: text("technician_availability_status"),
  timeOfDay: text("time_of_day"),
  dayOfWeek: text("day_of_week"),
  
  // Location data
  technicianDistance: decimal("technician_distance", { precision: 8, scale: 2 }),
  estimatedTravelTime: integer("estimated_travel_time"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// AI provider recommendations
export const providerRecommendations = pgTable("provider_recommendations", {
  id: serial("id").primaryKey(),
  dispatchRequestId: integer("dispatch_request_id").notNull().references(() => jobDispatchRequests.id),
  
  // Ranking algorithm results
  recommendedTechnicians: jsonb("recommended_technicians").$type<Array<{
    technicianId: number;
    score: number;
    factors: {
      proximityScore: number;
      workloadScore: number;
      expertiseScore: number;
      ratingScore: number;
      availabilityScore: number;
    };
    distance: number;
    eta: number;
    currentJobs: number;
  }>>(),
  
  // Algorithm metadata
  algorithmVersion: text("algorithm_version").default("1.0"),
  factorWeights: jsonb("factor_weights").$type<{
    proximity: number;
    workload: number;
    expertise: number;
    rating: number;
    availability: number;
  }>(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  domain: text("domain"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Live support chat system
export const supportCases = pgTable("support_cases", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  technicianId: integer("technician_id").references(() => technicians.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("open").notNull(),
  priority: varchar("priority", { length: 20 }).default("medium").notNull(),
  category: varchar("category", { length: 100 }),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  totalDuration: integer("total_duration").default(0), // in minutes
  isFreeSupport: boolean("is_free_support").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => supportCases.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  senderType: varchar("sender_type", { length: 20 }).notNull(), // 'customer' or 'technician'
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 20 }).default("text").notNull(),
  isRead: boolean("is_read").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Disputes table for tracking customer and technician disputes
export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id),
  customerId: integer("customer_id").references(() => users.id),
  technicianId: integer("technician_id").references(() => technicians.id),
  disputeType: varchar("dispute_type", { length: 50 }).notNull(), // 'payment', 'service_quality', 'communication', 'cancellation', 'other'
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // 'low', 'medium', 'high', 'critical'
  status: varchar("status", { length: 20 }).notNull().default("new"), // 'new', 'pending', 'investigating', 'resolved', 'closed'
  reportedBy: varchar("reported_by", { length: 20 }).notNull(), // 'customer', 'technician', 'admin'
  assignedAdminId: integer("assigned_admin_id").references(() => adminUsers.id),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  resolutionNotes: text("resolution_notes"),
  adminNotes: text("admin_notes"),
  customerSatisfaction: integer("customer_satisfaction"), // 1-5 rating after resolution
  technicianSatisfaction: integer("technician_satisfaction"), // 1-5 rating after resolution
  amountInDispute: decimal("amount_in_dispute", { precision: 10, scale: 2 }),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  escalationLevel: integer("escalation_level").default(1), // 1-5 levels
  dueDate: timestamp("due_date"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Dispute messages for communication between parties
export const disputeMessages = pgTable("dispute_messages", {
  id: serial("id").primaryKey(),
  disputeId: integer("dispute_id").references(() => disputes.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  senderType: varchar("sender_type", { length: 20 }).notNull(), // 'customer', 'technician', 'admin'
  message: text("message").notNull(),
  attachments: text("attachments").array(), // Array of file URLs
  isInternal: boolean("is_internal").default(false), // Internal admin notes
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Dispute attachments for evidence
export const disputeAttachments = pgTable("dispute_attachments", {
  id: serial("id").primaryKey(),
  disputeId: integer("dispute_id").references(() => disputes.id).notNull(),
  uploaderId: integer("uploader_id").references(() => users.id).notNull(),
  uploaderType: varchar("uploader_type", { length: 20 }).notNull(), // 'customer', 'technician', 'admin'
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileSize: integer("file_size"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Notifications system for all users
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  userType: varchar("user_type", { length: 20 }).notNull(), // 'customer', 'technician', 'admin'
  type: varchar("type", { length: 50 }).notNull(), // 'dispute_created', 'dispute_updated', 'dispute_resolved', 'job_update', 'payment_update'
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  relatedEntityId: integer("related_entity_id"), // ID of related job, dispute, etc.
  relatedEntityType: varchar("related_entity_type", { length: 50 }), // 'job', 'dispute', 'payment'
  isRead: boolean("is_read").default(false),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  actionRequired: boolean("action_required").default(false),
  actionUrl: text("action_url"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at")
});

// Dispute escalation history
export const disputeEscalations = pgTable("dispute_escalations", {
  id: serial("id").primaryKey(),
  disputeId: integer("dispute_id").references(() => disputes.id).notNull(),
  escalatedBy: integer("escalated_by").references(() => users.id).notNull(),
  escalatedTo: integer("escalated_to").references(() => users.id),
  previousLevel: integer("previous_level").notNull(),
  newLevel: integer("new_level").notNull(),
  reason: text("reason").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Support categories table - Admin managed service categories
export const supportCategories = pgTable("support_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }).default("Wrench"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  serviceType: varchar("service_type", { length: 20 }).notNull(), // 'remote', 'phone', 'onsite'
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  skillsRequired: text("skills_required").array().default([]),
  isActive: boolean("is_active").default(true),
  isPublic: boolean("is_public").default(true), // visible to customers
  adminId: integer("admin_id").references(() => adminUsers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Service provider activated services - Services that providers offer
export const serviceProviderServices = pgTable("service_provider_services", {
  id: serial("id").primaryKey(),
  serviceProviderId: integer("service_provider_id").references(() => serviceProviders.id).notNull(),
  categoryId: integer("category_id").references(() => supportCategories.id).notNull(),
  customPrice: decimal("custom_price", { precision: 10, scale: 2 }), // Override base price
  isActive: boolean("is_active").default(true),
  experienceLevel: varchar("experience_level", { length: 20 }).default("intermediate"), // 'beginner', 'intermediate', 'expert'
  availableHours: jsonb("available_hours").$type<{
    monday?: { start: string; end: string }[];
    tuesday?: { start: string; end: string }[];
    wednesday?: { start: string; end: string }[];
    thursday?: { start: string; end: string }[];
    friday?: { start: string; end: string }[];
    saturday?: { start: string; end: string }[];
    sunday?: { start: string; end: string }[];
  }>(),
  serviceAreas: text("service_areas").array().default([]), // Geographic areas for onsite
  notes: text("notes"), // Special notes or conditions
  activatedAt: timestamp("activated_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Chat fallback notifications - For startup phase when no technicians available
export const aiChatFallbackLogs = pgTable("ai_chat_fallback_logs", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  categoryId: integer("category_id").references(() => supportCategories.id),
  requestedService: text("requested_service").notNull(),
  fallbackReason: varchar("fallback_reason", { length: 100 }).notNull(), // 'no_providers', 'outside_hours', 'no_qualified_providers'
  customerMessage: text("customer_message"),
  aiResponse: text("ai_response"),
  customerSatisfaction: integer("customer_satisfaction"), // 1-5 rating
  escalatedToHuman: boolean("escalated_to_human").default(false),
  escalatedAt: timestamp("escalated_at"),
  sessionDuration: integer("session_duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  messages: many(messages),
  technicianProfile: one(technicians, {
    fields: [users.id],
    references: [technicians.userId],
  }),
  serviceRequests: many(serviceRequests, {
    relationName: "customerServiceRequests",
  }),
  jobsAsCustomer: many(jobs, {
    relationName: "customerJobs",
  }),
  jobUpdates: many(jobUpdates),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.username],
    references: [users.username],
  }),
}));

export const techniciansRelations = relations(technicians, ({ one, many }) => ({
  user: one(users, {
    fields: [technicians.userId],
    references: [users.id],
  }),
  serviceRequests: many(serviceRequests),
  jobs: many(jobs),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one, many }) => ({
  customer: one(users, {
    fields: [serviceRequests.customerId],
    references: [users.id],
    relationName: "customerServiceRequests",
  }),
  technician: one(technicians, {
    fields: [serviceRequests.technicianId],
    references: [technicians.id],
  }),
  job: one(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  serviceRequest: one(serviceRequests, {
    fields: [jobs.serviceRequestId],
    references: [serviceRequests.id],
  }),
  technician: one(technicians, {
    fields: [jobs.technicianId],
    references: [technicians.id],
  }),
  customer: one(users, {
    fields: [jobs.customerId],
    references: [users.id],
    relationName: "customerJobs",
  }),
  updates: many(jobUpdates),
}));

export const jobUpdatesRelations = relations(jobUpdates, ({ one }) => ({
  job: one(jobs, {
    fields: [jobUpdates.jobId],
    references: [jobs.id],
  }),
  updatedBy: one(users, {
    fields: [jobUpdates.updatedBy],
    references: [users.id],
  }),
}));

export const supportCasesRelations = relations(supportCases, ({ one, many }) => ({
  customer: one(users, {
    fields: [supportCases.customerId],
    references: [users.id],
  }),
  technician: one(technicians, {
    fields: [supportCases.technicianId],
    references: [technicians.id],
  }),
  messages: many(supportMessages),
}));

export const supportMessagesRelations = relations(supportMessages, ({ one }) => ({
  case: one(supportCases, {
    fields: [supportMessages.caseId],
    references: [supportCases.id],
  }),
  sender: one(users, {
    fields: [supportMessages.senderId],
    references: [users.id],
  }),
}));

export const earningsRelations = relations(earnings, ({ one }) => ({
  technician: one(technicians, {
    fields: [earnings.technicianId],
    references: [technicians.id],
  }),
  job: one(jobs, {
    fields: [earnings.jobId],
    references: [jobs.id],
  }),
}));

export const taxRatesRelations = relations(taxRates, ({ many }) => ({
  earnings: many(earnings),
}));

export const paymentSchedulesRelations = relations(paymentSchedules, ({ one }) => ({
  technician: one(technicians, {
    fields: [paymentSchedules.technicianId],
    references: [technicians.id],
  }),
}));

export const statementsRelations = relations(statements, ({ one }) => ({
  technician: one(technicians, {
    fields: [statements.technicianId],
    references: [technicians.id],
  }),
}));

export const technicianEarningSettingsRelations = relations(technicianEarningSettings, ({ one }) => ({
  technician: one(technicians, {
    fields: [technicianEarningSettings.technicianId],
    references: [technicians.id],
  }),
  lastModifiedByUser: one(users, {
    fields: [technicianEarningSettings.lastModifiedBy],
    references: [users.id],
  }),
}));

export const disputesRelations = relations(disputes, ({ one, many }) => ({
  job: one(jobs, {
    fields: [disputes.jobId],
    references: [jobs.id],
  }),
  customer: one(users, {
    fields: [disputes.customerId],
    references: [users.id],
  }),
  technician: one(technicians, {
    fields: [disputes.technicianId],
    references: [technicians.id],
  }),
  assignedAdmin: one(adminUsers, {
    fields: [disputes.assignedAdminId],
    references: [adminUsers.id],
  }),
  messages: many(disputeMessages),
  attachments: many(disputeAttachments),
  escalations: many(disputeEscalations),
}));

export const disputeMessagesRelations = relations(disputeMessages, ({ one }) => ({
  dispute: one(disputes, {
    fields: [disputeMessages.disputeId],
    references: [disputes.id],
  }),
  sender: one(users, {
    fields: [disputeMessages.senderId],
    references: [users.id],
  }),
}));

export const disputeAttachmentsRelations = relations(disputeAttachments, ({ one }) => ({
  dispute: one(disputes, {
    fields: [disputeAttachments.disputeId],
    references: [disputes.id],
  }),
  uploader: one(users, {
    fields: [disputeAttachments.uploaderId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const disputeEscalationsRelations = relations(disputeEscalations, ({ one }) => ({
  dispute: one(disputes, {
    fields: [disputeEscalations.disputeId],
    references: [disputes.id],
  }),
  escalatedByUser: one(users, {
    fields: [disputeEscalations.escalatedBy],
    references: [users.id],
  }),
  escalatedToUser: one(users, {
    fields: [disputeEscalations.escalatedTo],
    references: [users.id],
  }),
}));

// Password reset tokens for secure password reset functionality
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  usedAt: timestamp("used_at"),
});

// Tax jurisdictions for countries, states, and provinces
export const taxJurisdictions = pgTable("tax_jurisdictions", {
  id: serial("id").primaryKey(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  state: text("state"), // For US states
  stateCode: text("state_code"),
  province: text("province"), // For Canadian provinces
  provinceCode: text("province_code"),
  taxType: text("tax_type").notNull(), // GST, PST, HST, VAT, Sales Tax, Service Tax
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  appliesTo: jsonb("applies_to").$type<('service_providers' | 'customers')[]>().notNull(),
  exemptions: jsonb("exemptions").$type<string[]>().default([]),
  effectiveDate: timestamp("effective_date").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Platform settings for system-wide configuration
export const platformSettings = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // general, payments, taxes, notifications, security, api, integration
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  dataType: text("data_type").notNull(), // string, number, boolean, json, array
  description: text("description"),
  isRequired: boolean("is_required").default(false),
  isSecret: boolean("is_secret").default(false),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Admin panel configuration
export const adminPanelConfig = pgTable("admin_panel_config", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isEnabled: boolean("is_enabled").default(true),
  permissions: jsonb("permissions").$type<string[]>().default([]),
  icon: text("icon"),
  order: integer("order").default(0),
  settings: jsonb("settings").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Pricing rules for dynamic pricing management
export const pricingRules = pgTable("pricing_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  serviceType: text("service_type").notNull(), // remote, phone, onsite, consultation
  category: text("category").notNull(), // Basic Support, Advanced Support, etc.
  basePrice: real("base_price").notNull(),
  multiplier: real("multiplier").notNull().default(1.0),
  conditions: jsonb("conditions").$type<string[]>().default([]),
  status: text("status").notNull().default("active"), // active, inactive
  lastModified: timestamp("last_modified").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  bio: true,
  avatar: true,
  userType: true,
  phone: true,
  street: true,
  apartment: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
});

export const updateProfileSchema = createInsertSchema(users).pick({
  email: true,
  fullName: true,
  bio: true,
  avatar: true,
  phone: true,
  street: true,
  apartment: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  businessInfo: true,
  paymentMethod: true,
  paymentMethods: true,
  paymentMethodSetup: true,
  paymentDetails: true,
});

export const insertIssueCategorySchema = createInsertSchema(issueCategories).pick({
  name: true,
  description: true,
  icon: true,
  isActive: true,
  sortOrder: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  username: true,
  content: true,
  isUser: true,
}).extend({
  domain: z.string().optional(),
});

export const insertTechnicianSchema = createInsertSchema(technicians).pick({
  userId: true,
  // Personal Information
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  address: true,
  // Business Information
  businessName: true,
  companyName: true,
  experience: true,
  hourlyRate: true,
  // Geographic location
  country: true,
  state: true,
  city: true,
  location: true,
  serviceRadius: true,
  // Vehicle Information
  vehicleType: true,
  vehicleMake: true,
  vehicleModel: true,
  vehicleYear: true,
  vehicleLicensePlate: true,
  // Document URLs (will be populated after file uploads)
  backgroundCheckUrl: true,
  driverLicenseUrl: true,
  insuranceUrl: true,
  // Profile and settings
  profileDescription: true,
  responseTime: true,
}).extend({
  skills: z.array(z.string()),
  categories: z.array(z.string()),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
  serviceAreas: z.array(z.string()),
  availability: z.object({
    monday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }).optional(),
    tuesday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }).optional(),
    wednesday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }).optional(),
    thursday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }).optional(),
    friday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }).optional(),
    saturday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }).optional(),
    sunday: z.object({ start: z.string(), end: z.string(), available: z.boolean() }).optional(),
  }).optional(),
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).pick({
  customerId: true,
  category: true,
  subcategory: true,
  title: true,
  description: true,
  serviceType: true,
  urgency: true,
  estimatedDuration: true,
  location: true,
  budget: true,
});

export const insertJobSchema = createInsertSchema(jobs).pick({
  serviceRequestId: true,
  technicianId: true,
  customerId: true,
  finalPrice: true,
  notes: true,
});

export const insertJobUpdateSchema = createInsertSchema(jobUpdates).pick({
  jobId: true,
  updatedBy: true,
  updateType: true,
  title: true,
  description: true,
}).extend({
  attachments: z.array(z.string()).optional(),
});

export const insertEarningsSchema = createInsertSchema(earnings).pick({
  technicianId: true,
  jobId: true,
  grossAmount: true,
  platformFee: true,
  netAmount: true,
  taxableAmount: true,
  province: true,
  state: true,
  country: true,
  paymentPeriod: true,
  payoutMethod: true,
  serviceType: true,
  serviceDate: true,
});

export const insertTaxRateSchema = createInsertSchema(taxRates).pick({
  province: true,
  state: true,
  country: true,
  gst: true,
  pst: true,
  hst: true,
  salesTax: true,
  totalTaxRate: true,
  effectiveDate: true,
});

export const insertPaymentScheduleSchema = createInsertSchema(paymentSchedules).pick({
  technicianId: true,
  frequency: true,
  dayOfWeek: true,
  dayOfMonth: true,
  bankAccount: true,
  routingNumber: true,
  accountType: true,
  minimumPayout: true,
});

export const insertStatementSchema = createInsertSchema(statements).pick({
  technicianId: true,
  statementType: true,
  periodStart: true,
  periodEnd: true,
  totalGrossEarnings: true,
  totalPlatformFees: true,
  totalNetEarnings: true,
  totalTaxableAmount: true,
  totalJobs: true,
  remoteJobs: true,
  phoneJobs: true,
  onsiteJobs: true,
  totalHours: true,
}).extend({
  taxBreakdown: z.object({
    province: z.string().optional(),
    state: z.string().optional(),
    gst: z.number().optional(),
    pst: z.number().optional(),
    hst: z.number().optional(),
    salesTax: z.number().optional(),
    totalTax: z.number().optional(),
  }).optional(),
});

export const insertTechnicianEarningSettingsSchema = createInsertSchema(technicianEarningSettings).pick({
  technicianId: true,
  remoteEarningPercentage: true,
  phoneEarningPercentage: true,
  onsiteEarningPercentage: true,
  performanceBonus: true,
  loyaltyBonus: true,
  premiumServiceRate: true,
  adminNotes: true,
  effectiveDate: true,
  lastModifiedBy: true,
});

export const insertSupportCaseSchema = createInsertSchema(supportCases).pick({
  customerId: true,
  technicianId: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  category: true,
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages).pick({
  caseId: true,
  senderId: true,
  senderType: true,
  content: true,
  messageType: true,
});

export const insertDisputeSchema = createInsertSchema(disputes).pick({
  jobId: true,
  customerId: true,
  technicianId: true,
  disputeType: true,
  title: true,
  description: true,
  severity: true,
  reportedBy: true,
  assignedAdminId: true,
  priority: true,
  resolutionNotes: true,
  adminNotes: true,
  customerSatisfaction: true,
  technicianSatisfaction: true,
  amountInDispute: true,
  refundAmount: true,
  escalationLevel: true,
  dueDate: true,
});

export const insertDisputeMessageSchema = createInsertSchema(disputeMessages).pick({
  disputeId: true,
  senderId: true,
  senderType: true,
  message: true,
  isInternal: true,
}).extend({
  attachments: z.array(z.string()).optional(),
});

export const insertTaxJurisdictionSchema = createInsertSchema(taxJurisdictions).pick({
  country: true,
  countryCode: true,
  state: true,
  stateCode: true,
  province: true,
  provinceCode: true,
  taxType: true,
  taxRate: true,
  isActive: true,
  description: true,
}).extend({
  appliesTo: z.array(z.enum(['service_providers', 'customers'])),
  exemptions: z.array(z.string()).optional(),
});

export const insertPlatformSettingSchema = createInsertSchema(platformSettings).pick({
  category: true,
  key: true,
  value: true,
  dataType: true,
  description: true,
  isRequired: true,
  isSecret: true,
  updatedBy: true,
});

export const insertAdminPanelConfigSchema = createInsertSchema(adminPanelConfig).pick({
  section: true,
  title: true,
  description: true,
  isEnabled: true,
  icon: true,
  order: true,
}).extend({
  permissions: z.array(z.string()).optional(),
  settings: z.record(z.any()).optional(),
});

export const insertDisputeAttachmentSchema = createInsertSchema(disputeAttachments).pick({
  disputeId: true,
  uploaderId: true,
  uploaderType: true,
  fileName: true,
  fileUrl: true,
  fileType: true,
  fileSize: true,
  description: true,
});

// Support ticket schemas
export const insertSupportTicketSchema = createInsertSchema(supportTickets).pick({
  ticketNumber: true,
  userId: true,
  assignedTo: true,
  subject: true,
  description: true,
  category: true,
  priority: true,
  status: true,
  source: true,
  resolution: true,
  resolvedBy: true,
  customerRating: true,
  customerFeedback: true,
  internalNotes: true,
}).extend({
  chatConversation: z.object({
    username: z.string(),
    messages: z.array(z.object({
      content: z.string(),
      isUser: z.boolean(),
      timestamp: z.string(),
      domain: z.string().optional(),
    })),
  }).optional(),
  tags: z.array(z.string()).optional(),
});

export const insertSupportTicketMessageSchema = createInsertSchema(supportTicketMessages).pick({
  ticketId: true,
  senderId: true,
  senderType: true,
  content: true,
  messageType: true,
  isInternal: true,
}).extend({
  attachments: z.array(z.string()).optional(),
});

// Type definitions (removing duplicates)

export const insertSupportTicketAttachmentSchema = createInsertSchema(supportTicketAttachments).pick({
  ticketId: true,
  messageId: true,
  fileName: true,
  fileUrl: true,
  fileSize: true,
  fileType: true,
  uploadedBy: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  userType: true,
  type: true,
  title: true,
  message: true,
  relatedEntityId: true,
  relatedEntityType: true,
  priority: true,
  actionRequired: true,
  actionUrl: true,
  expiresAt: true,
});

export const insertDisputeEscalationSchema = createInsertSchema(disputeEscalations).pick({
  disputeId: true,
  escalatedBy: true,
  escalatedTo: true,
  previousLevel: true,
  newLevel: true,
  reason: true,
  notes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertTechnician = z.infer<typeof insertTechnicianSchema>;
export type Technician = typeof technicians.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJobUpdate = z.infer<typeof insertJobUpdateSchema>;
export type JobUpdate = typeof jobUpdates.$inferSelect;
export type InsertSupportCase = z.infer<typeof insertSupportCaseSchema>;
export type SupportCase = typeof supportCases.$inferSelect;
export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;
export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertEarnings = z.infer<typeof insertEarningsSchema>;
export type Earnings = typeof earnings.$inferSelect;
export type InsertTaxRate = z.infer<typeof insertTaxRateSchema>;
export type TaxRate = typeof taxRates.$inferSelect;
export type InsertPaymentSchedule = z.infer<typeof insertPaymentScheduleSchema>;
export type PaymentSchedule = typeof paymentSchedules.$inferSelect;
export type InsertStatement = z.infer<typeof insertStatementSchema>;
export type Statement = typeof statements.$inferSelect;
export type InsertTechnicianEarningSettings = z.infer<typeof insertTechnicianEarningSettingsSchema>;
export type TechnicianEarningSettings = typeof technicianEarningSettings.$inferSelect;

// Phone Support Logs table
export const phoneSupportLogs = pgTable("phone_support_logs", {
  id: serial("id").primaryKey(),
  callId: text("call_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  serviceProviderName: text("service_provider_name").notNull(),
  serviceProviderEmail: text("service_provider_email").notNull(),
  adminName: text("admin_name"),
  callType: text("call_type").notNull(), // customer, service_provider, admin
  category: text("category").notNull(),
  issue: text("issue").notNull(),
  status: text("status").notNull(), // active, completed, failed, transferred
  duration: integer("duration").notNull().default(0), // in minutes
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  resolution: text("resolution").notNull().default(""),
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  transferredTo: text("transferred_to"),
  notes: text("notes").notNull().default(""),
  satisfaction: integer("satisfaction"), // 1-5 rating
  recordings: jsonb("recordings").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPhoneSupportLogSchema = createInsertSchema(phoneSupportLogs);
export type InsertPhoneSupportLog = typeof phoneSupportLogs.$inferInsert;
export type PhoneSupportLog = typeof phoneSupportLogs.$inferSelect;

// Support categories schema and types
export const insertSupportCategorySchema = createInsertSchema(supportCategories).pick({
  name: true,
  description: true,
  icon: true,
  basePrice: true,
  serviceType: true,
  estimatedDuration: true,
  isActive: true,
  isPublic: true,
  adminId: true,
}).extend({
  skillsRequired: z.array(z.string()).optional(),
});
export type InsertSupportCategory = typeof supportCategories.$inferInsert;
export type SupportCategory = typeof supportCategories.$inferSelect;

// Service provider services schema and types
export const insertServiceProviderServiceSchema = createInsertSchema(serviceProviderServices);
export type InsertServiceProviderService = typeof serviceProviderServices.$inferInsert;
export type ServiceProviderService = typeof serviceProviderServices.$inferSelect;

// AI chat fallback logs schema and types
export const insertAiChatFallbackLogSchema = createInsertSchema(aiChatFallbackLogs);
export type InsertAiChatFallbackLog = typeof aiChatFallbackLogs.$inferInsert;
export type AiChatFallbackLog = typeof aiChatFallbackLogs.$inferSelect;
export type InsertIssueCategory = z.infer<typeof insertIssueCategorySchema>;
export type IssueCategory = typeof issueCategories.$inferSelect;
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputes.$inferSelect;
export type InsertDisputeMessage = z.infer<typeof insertDisputeMessageSchema>;
export type DisputeMessage = typeof disputeMessages.$inferSelect;
export type InsertDisputeAttachment = z.infer<typeof insertDisputeAttachmentSchema>;
export type DisputeAttachment = typeof disputeAttachments.$inferSelect;

// Support ticket types
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

export type SupportTicketMessage = typeof supportTicketMessages.$inferSelect;
export type InsertSupportTicketMessage = typeof supportTicketMessages.$inferInsert;

export type SupportTicketAttachment = typeof supportTicketAttachments.$inferSelect;
export type InsertSupportTicketAttachment = typeof supportTicketAttachments.$inferInsert;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertDisputeEscalation = z.infer<typeof insertDisputeEscalationSchema>;
export type DisputeEscalation = typeof disputeEscalations.$inferSelect;
export type InsertTaxJurisdiction = z.infer<typeof insertTaxJurisdictionSchema>;
export type TaxJurisdiction = typeof taxJurisdictions.$inferSelect;
export type InsertPlatformSetting = z.infer<typeof insertPlatformSettingSchema>;
export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertAdminPanelConfig = z.infer<typeof insertAdminPanelConfigSchema>;
export type AdminPanelConfig = typeof adminPanelConfig.$inferSelect;

// Enhanced technician schemas
export const insertTechnicianEnhancedSchema = createInsertSchema(technicians).pick({
  userId: true,
  businessName: true,
  companyName: true,
  experience: true,
  hourlyRate: true,
  location: true,
  serviceRadius: true,
  serviceAreas: true,
  skills: true,
  categories: true,
  certifications: true,
  languages: true,
  availability: true,
  profileDescription: true,
  responseTime: true,
  stripeAccountId: true,
});

export type InsertTechnicianEnhanced = z.infer<typeof insertTechnicianEnhancedSchema>;
export type TechnicianEnhanced = typeof technicians.$inferSelect;

// Customer complaints and investigations
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  technicianId: integer("technician_id").notNull().references(() => technicians.id),
  jobId: integer("job_id").references(() => jobs.id),
  category: varchar("category", { length: 100 }).notNull(), // behavior, quality, pricing, safety, communication
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 50 }).notNull(), // low, medium, high, critical
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, investigating, resolved, dismissed
  priority: varchar("priority", { length: 50 }).notNull().default("normal"), // low, normal, high, urgent
  evidence: jsonb("evidence"), // photos, videos, documents
  incidentDate: timestamp("incident_date"),
  reportedAt: timestamp("reported_at").defaultNow(),
  assignedTo: integer("assigned_to").references(() => users.id), // admin investigator
  investigationNotes: text("investigation_notes"),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transportation and vehicle information
export const technicianTransportation = pgTable("technician_transportation", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").notNull().references(() => technicians.id),
  transportationMethod: varchar("transportation_method", { length: 50 }).notNull(), // vehicle, bike, bus, walk
  vehicleType: varchar("vehicle_type", { length: 100 }), // car, van, truck, motorcycle
  vehicleMake: varchar("vehicle_make", { length: 100 }),
  vehicleModel: varchar("vehicle_model", { length: 100 }),
  vehicleYear: integer("vehicle_year"),
  vehicleColor: varchar("vehicle_color", { length: 50 }),
  licensePlate: varchar("license_plate", { length: 20 }),
  insuranceProvider: varchar("insurance_provider", { length: 255 }),
  insurancePolicyNumber: varchar("insurance_policy_number", { length: 100 }),
  insuranceExpiryDate: timestamp("insurance_expiry_date"),
  registrationNumber: varchar("registration_number", { length: 100 }),
  registrationExpiryDate: timestamp("registration_expiry_date"),
  driversLicenseNumber: varchar("drivers_license_number", { length: 100 }),
  driversLicenseExpiryDate: timestamp("drivers_license_expiry_date"),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verificationNotes: text("verification_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Background checks and verification
export const backgroundChecks = pgTable("background_checks", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").notNull().references(() => technicians.id),
  checkType: varchar("check_type", { length: 100 }).notNull(), // criminal, employment, reference, education, driving
  provider: varchar("provider", { length: 255 }), // background check company
  requestedAt: timestamp("requested_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, in_progress, completed, failed
  result: varchar("result", { length: 50 }), // passed, failed, conditional
  score: integer("score"), // 1-100 risk score
  details: jsonb("details"), // detailed results
  documentUrl: varchar("document_url", { length: 500 }), // link to background check report
  expiryDate: timestamp("expiry_date"),
  notes: text("notes"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Technician approval workflow
export const technicianApprovals = pgTable("technician_approvals", {
  id: serial("id").primaryKey(),
  technicianId: integer("technician_id").notNull().references(() => technicians.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, approved, rejected, suspended
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  approvalNotes: text("approval_notes"),
  rejectionReason: text("rejection_reason"),
  requiredDocuments: jsonb("required_documents"), // list of required documents
  submittedDocuments: jsonb("submitted_documents"), // list of submitted documents
  verificationChecklist: jsonb("verification_checklist"), // checklist items and their status
  conditionalApproval: boolean("conditional_approval").default(false),
  conditions: text("conditions"), // conditions for approval
  nextReviewDate: timestamp("next_review_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for new tables
export const complaintsRelations = relations(complaints, ({ one }) => ({
  customer: one(users, {
    fields: [complaints.customerId],
    references: [users.id],
  }),
  technician: one(technicians, {
    fields: [complaints.technicianId],
    references: [technicians.id],
  }),
  job: one(jobs, {
    fields: [complaints.jobId],
    references: [jobs.id],
  }),
  assignedToUser: one(users, {
    fields: [complaints.assignedTo],
    references: [users.id],
  }),
}));

export const technicianTransportationRelations = relations(technicianTransportation, ({ one }) => ({
  technician: one(technicians, {
    fields: [technicianTransportation.technicianId],
    references: [technicians.id],
  }),
}));

export const backgroundChecksRelations = relations(backgroundChecks, ({ one }) => ({
  technician: one(technicians, {
    fields: [backgroundChecks.technicianId],
    references: [technicians.id],
  }),
  reviewer: one(users, {
    fields: [backgroundChecks.reviewedBy],
    references: [users.id],
  }),
}));

export const technicianApprovalsRelations = relations(technicianApprovals, ({ one }) => ({
  technician: one(technicians, {
    fields: [technicianApprovals.technicianId],
    references: [technicians.id],
  }),
  reviewer: one(users, {
    fields: [technicianApprovals.reviewedBy],
    references: [users.id],
  }),
}));

// Insert schemas for new tables
export const insertComplaintSchema = createInsertSchema(complaints).pick({
  customerId: true,
  technicianId: true,
  jobId: true,
  category: true,
  title: true,
  description: true,
  severity: true,
  priority: true,
  incidentDate: true,
}).extend({
  evidence: z.object({
    photos: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    documents: z.array(z.string()).optional(),
  }).optional(),
});

export const insertTechnicianTransportationSchema = createInsertSchema(technicianTransportation).pick({
  technicianId: true,
  transportationMethod: true,
  vehicleType: true,
  vehicleMake: true,
  vehicleModel: true,
  vehicleYear: true,
  vehicleColor: true,
  licensePlate: true,
  insuranceProvider: true,
  insurancePolicyNumber: true,
  insuranceExpiryDate: true,
  registrationNumber: true,
  registrationExpiryDate: true,
  driversLicenseNumber: true,
  driversLicenseExpiryDate: true,
});

export const insertBackgroundCheckSchema = createInsertSchema(backgroundChecks).pick({
  technicianId: true,
  checkType: true,
  provider: true,
  documentUrl: true,
  expiryDate: true,
  notes: true,
});

export const insertTechnicianApprovalSchema = createInsertSchema(technicianApprovals).pick({
  technicianId: true,
  status: true,
  approvalNotes: true,
  rejectionReason: true,
  conditionalApproval: true,
  conditions: true,
  nextReviewDate: true,
}).extend({
  requiredDocuments: z.array(z.string()).optional(),
  submittedDocuments: z.array(z.string()).optional(),
  verificationChecklist: z.object({
    identity: z.boolean().optional(),
    background: z.boolean().optional(),
    skills: z.boolean().optional(),
    insurance: z.boolean().optional(),
    transportation: z.boolean().optional(),
  }).optional(),
});

// Types for new tables
// Booking settings and service bookings
export const bookingSettings = pgTable("booking_settings", {
  id: serial("id").primaryKey(),
  sameDayFee: decimal("same_day_fee", { precision: 10, scale: 2 }).default("20.00"),
  futureDayFee: decimal("future_day_fee", { precision: 10, scale: 2 }).default("30.00"),
  immediateWorkAllowed: boolean("immediate_work_allowed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceBookings = pgTable("service_bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  technicianId: integer("technician_id").references(() => technicians.id),
  categoryId: integer("category_id").references(() => issueCategories.id).notNull(),
  description: text("description").notNull(),
  deviceType: varchar("device_type", { length: 100 }),
  previousAttempts: text("previous_attempts"),
  expectedBehavior: text("expected_behavior"),
  urgency: varchar("urgency", { length: 20 }).default("medium"),
  serviceType: varchar("service_type", { length: 20 }).default("onsite"), // onsite, phone, remote
  scheduledDate: timestamp("scheduled_date"),
  location: text("location"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, confirmed, in_progress, completed, cancelled
  bookingFee: decimal("booking_fee", { precision: 10, scale: 2 }).default("0.00"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  aiAnalysis: jsonb("ai_analysis"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for booking tables
export const bookingSettingsRelations = relations(bookingSettings, ({ many }) => ({
  bookings: many(serviceBookings),
}));

export const serviceBookingsRelations = relations(serviceBookings, ({ one }) => ({
  customer: one(users, {
    fields: [serviceBookings.customerId],
    references: [users.id],
  }),
  technician: one(technicians, {
    fields: [serviceBookings.technicianId],
    references: [technicians.id],
  }),
  category: one(issueCategories, {
    fields: [serviceBookings.categoryId],
    references: [issueCategories.id],
  }),
}));

// Insert schemas for booking tables
export const insertBookingSettingsSchema = createInsertSchema(bookingSettings).pick({
  sameDayFee: true,
  futureDayFee: true,
  immediateWorkAllowed: true,
});

export const insertServiceBookingSchema = createInsertSchema(serviceBookings).pick({
  customerId: true,
  technicianId: true,
  categoryId: true,
  description: true,
  deviceType: true,
  previousAttempts: true,
  expectedBehavior: true,
  urgency: true,
  serviceType: true,
  scheduledDate: true,
  location: true,
  bookingFee: true,
  estimatedCost: true,
}).extend({
  aiAnalysis: z.object({
    category: z.string().optional(),
    complexity: z.string().optional(),
    urgency: z.string().optional(),
    estimatedDuration: z.number().optional(),
    requiredSkills: z.array(z.string()).optional(),
    confidence: z.number().optional(),
    recommendedSupportType: z.string().optional(),
    reasoning: z.string().optional(),
  }).optional(),
});

// Types for booking tables
export type BookingSettings = typeof bookingSettings.$inferSelect;
export type ServiceBooking = typeof serviceBookings.$inferSelect;
export type InsertBookingSettings = z.infer<typeof insertBookingSettingsSchema>;
export type InsertServiceBooking = z.infer<typeof insertServiceBookingSchema>;

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;
export type InsertTechnicianTransportation = z.infer<typeof insertTechnicianTransportationSchema>;
export type TechnicianTransportation = typeof technicianTransportation.$inferSelect;
export type InsertBackgroundCheck = z.infer<typeof insertBackgroundCheckSchema>;
export type BackgroundCheck = typeof backgroundChecks.$inferSelect;
export type InsertTechnicianApproval = z.infer<typeof insertTechnicianApprovalSchema>;
export type TechnicianApproval = typeof technicianApprovals.$inferSelect;

// Diagnostic tools
export const insertDiagnosticToolSchema = createInsertSchema(diagnosticTools);
export type InsertDiagnosticTool = z.infer<typeof insertDiagnosticToolSchema>;
export type DiagnosticTool = typeof diagnosticTools.$inferSelect;

// Announcement schema
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true
});
export type InsertAnnouncementForm = z.infer<typeof insertAnnouncementSchema>;

// Job dispatch request schemas
export const insertJobDispatchRequestSchema = createInsertSchema(jobDispatchRequests).pick({
  ticketId: true,
  customerId: true,
  technicianId: true,
  serviceType: true,
  category: true,
  description: true,
  urgency: true,
  estimatedCost: true,
  estimatedDuration: true,
  estimatedDistance: true,
  estimatedETA: true,
  trafficFactor: true,
  responseDeadline: true,
}).extend({
  customerLocation: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
  technicianLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export const insertProviderResponseAnalyticsSchema = createInsertSchema(providerResponseAnalytics).pick({
  dispatchRequestId: true,
  technicianId: true,
  responseAction: true,
  responseTimeSeconds: true,
  deviceType: true,
  userAgent: true,
  technicianCurrentWorkload: true,
  technicianAvailabilityStatus: true,
  timeOfDay: true,
  dayOfWeek: true,
  technicianDistance: true,
  estimatedTravelTime: true,
});

export const insertProviderRecommendationSchema = createInsertSchema(providerRecommendations).pick({
  dispatchRequestId: true,
  algorithmVersion: true,
}).extend({
  recommendedTechnicians: z.array(z.object({
    technicianId: z.number(),
    score: z.number(),
    factors: z.object({
      proximityScore: z.number(),
      workloadScore: z.number(),
      expertiseScore: z.number(),
      ratingScore: z.number(),
      availabilityScore: z.number(),
    }),
    distance: z.number(),
    eta: z.number(),
    currentJobs: z.number(),
  })),
  factorWeights: z.object({
    proximity: z.number(),
    workload: z.number(),
    expertise: z.number(),
    rating: z.number(),
    availability: z.number(),
  }),
});

// Export types for new dispatch tables
export type JobDispatchRequest = typeof jobDispatchRequests.$inferSelect;
export type InsertJobDispatchRequest = z.infer<typeof insertJobDispatchRequestSchema>;

export type ProviderResponseAnalytics = typeof providerResponseAnalytics.$inferSelect;
export type InsertProviderResponseAnalytics = z.infer<typeof insertProviderResponseAnalyticsSchema>;

export type ProviderRecommendation = typeof providerRecommendations.$inferSelect;
export type InsertProviderRecommendation = z.infer<typeof insertProviderRecommendationSchema>;

// Screen sharing sessions for remote support
export const screenSharingSessions = pgTable("screen_sharing_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  customerId: integer("customer_id").references(() => users.id),
  serviceProviderId: integer("service_provider_id").references(() => technicians.id),
  jobId: integer("job_id").references(() => jobs.id),
  sessionType: text("session_type").notNull(), // 'view-only' | 'remote-control' | 'collaboration'
  status: text("status").default("pending"), // 'pending' | 'active' | 'ended' | 'cancelled'
  quality: text("quality").default("medium"), // 'low' | 'medium' | 'high'
  audioEnabled: boolean("audio_enabled").default(false),
  permissionGranted: boolean("permission_granted").default(false),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration").default(0), // in seconds
  customerName: text("customer_name"),
  serviceProviderName: text("service_provider_name"),
  recordingPath: text("recording_path"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Screen sharing session events log
export const screenSharingEvents = pgTable("screen_sharing_events", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => screenSharingSessions.sessionId),
  eventType: text("event_type").notNull(), // 'start', 'end', 'control_request', 'control_granted', 'control_denied', 'quality_change'
  eventData: jsonb("event_data").$type<Record<string, any>>(),
  timestamp: timestamp("timestamp").defaultNow(),
  userId: integer("user_id").references(() => users.id),
  userRole: text("user_role"), // 'customer' | 'service_provider'
});

// Create insert schemas for screen sharing tables
export const insertScreenSharingSessionSchema = createInsertSchema(screenSharingSessions);
export const insertScreenSharingEventSchema = createInsertSchema(screenSharingEvents);

// Export types for screen sharing tables
export type ScreenSharingSession = typeof screenSharingSessions.$inferSelect;
export type InsertScreenSharingSession = z.infer<typeof insertScreenSharingSessionSchema>;
export type ScreenSharingEvent = typeof screenSharingEvents.$inferSelect;
export type InsertScreenSharingEvent = z.infer<typeof insertScreenSharingEventSchema>;

// New separate table types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceProvider = typeof serviceProviders.$inferInsert;

// Pricing Rules schema and types
export const insertPricingRuleSchema = createInsertSchema(pricingRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastModified: true,
});

export type PricingRule = typeof pricingRules.$inferSelect;
export type InsertPricingRule = z.infer<typeof insertPricingRuleSchema>;

// Support Categories types (already defined above)
