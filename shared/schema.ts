import { pgTable, text, serial, boolean, timestamp, decimal, jsonb, integer, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  bio: text("bio"),
  avatar: text("avatar"),
  userType: text("user_type").notNull().default("customer"), // customer, technician
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Technician profiles with skills and availability
export const technicians = pgTable("technicians", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessName: text("business_name"),
  companyName: text("company_name"),
  experience: text("experience"), // beginner, intermediate, advanced, expert
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  location: text("location"),
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
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  verificationStatus: text("verification_status").default("pending"), // pending, approved, rejected
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  bio: true,
  avatar: true,
  userType: true,
});

export const updateProfileSchema = createInsertSchema(users).pick({
  email: true,
  fullName: true,
  bio: true,
  avatar: true,
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
  companyName: true,
  experience: true,
  hourlyRate: true,
  location: true,
  serviceRadius: true,
}).extend({
  skills: z.array(z.string()),
  certifications: z.array(z.string()),
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
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;
export type InsertTechnicianTransportation = z.infer<typeof insertTechnicianTransportationSchema>;
export type TechnicianTransportation = typeof technicianTransportation.$inferSelect;
export type InsertBackgroundCheck = z.infer<typeof insertBackgroundCheckSchema>;
export type BackgroundCheck = typeof backgroundChecks.$inferSelect;
export type InsertTechnicianApproval = z.infer<typeof insertTechnicianApprovalSchema>;
export type TechnicianApproval = typeof technicianApprovals.$inferSelect;
