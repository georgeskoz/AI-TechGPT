import { pgTable, text, serial, boolean, timestamp, decimal, jsonb, integer } from "drizzle-orm/pg-core";
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
  companyName: text("company_name"),
  experience: text("experience"), // beginner, intermediate, advanced, expert
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  location: text("location"),
  serviceRadius: integer("service_radius").default(25), // miles
  skills: jsonb("skills").$type<string[]>(), // Array of technical skills
  certifications: jsonb("certifications").$type<string[]>(), // Array of certifications
  availability: jsonb("availability").$type<{
    monday?: { start: string; end: string; available: boolean };
    tuesday?: { start: string; end: string; available: boolean };
    wednesday?: { start: string; end: string; available: boolean };
    thursday?: { start: string; end: string; available: boolean };
    friday?: { start: string; end: string; available: boolean };
    saturday?: { start: string; end: string; available: boolean };
    sunday?: { start: string; end: string; available: boolean };
  }>(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  completedJobs: integer("completed_jobs").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  actualDuration: integer("actual_duration"), // minutes
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }),
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

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  domain: text("domain"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
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
