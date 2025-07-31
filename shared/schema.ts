import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("hr"), // hr, recruiter, interviewer, candidate
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  experience: text("experience").notNull(),
  description: text("description").notNull(),
  skills: text("skills").notNull(),
  salary: text("salary"),
  status: text("status").notNull().default("active"), // active, closed, draft
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  resume: text("resume"), // file path or content
  skills: jsonb("skills").default([]), // parsed skills array
  experience: text("experience"),
  education: text("education"),
  status: text("status").notNull().default("new"), // new, screening, interview, offer, hired, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull(),
  candidateId: varchar("candidate_id").notNull(),
  status: text("status").notNull().default("applied"), // applied, screening, assessment, interview, offer, hired, rejected
  stage: text("stage").notNull().default("review"), // review, assessment, interview, offer
  score: integer("score"), // overall score
  notes: text("notes"),
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const interviewPanels = pgTable("interview_panels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  interviewers: jsonb("interviewers").default([]), // array of user IDs
  jobId: varchar("job_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interviews = pgTable("interviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  panelId: varchar("panel_id"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // minutes
  type: text("type").notNull().default("technical"), // technical, hr, behavioral, final
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled, rescheduled
  feedback: text("feedback"),
  score: integer("score"),
  interviewerNotes: jsonb("interviewer_notes").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // coding, mcq, assignment
  questions: jsonb("questions").default([]),
  timeLimit: integer("time_limit"), // minutes
  passingScore: integer("passing_score").default(70),
  jobId: varchar("job_id"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessmentSubmissions = pgTable("assessment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull(),
  candidateId: varchar("candidate_id").notNull(),
  applicationId: varchar("application_id").notNull(),
  answers: jsonb("answers").default({}),
  score: integer("score"),
  status: text("status").notNull().default("pending"), // pending, submitted, graded
  startedAt: timestamp("started_at"),
  submittedAt: timestamp("submitted_at"),
  gradedAt: timestamp("graded_at"),
});

export const offerLetters = pgTable("offer_letters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  title: text("title").notNull(),
  salary: text("salary").notNull(),
  startDate: timestamp("start_date"),
  template: text("template"),
  customContent: text("custom_content"),
  status: text("status").notNull().default("draft"), // draft, sent, accepted, rejected, withdrawn
  sentAt: timestamp("sent_at"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdJobs: many(jobs),
  createdAssessments: many(assessments),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  creator: one(users, { fields: [jobs.createdBy], references: [users.id] }),
  applications: many(applications),
  panels: many(interviewPanels),
  assessments: many(assessments),
}));

export const candidatesRelations = relations(candidates, ({ many }) => ({
  applications: many(applications),
  assessmentSubmissions: many(assessmentSubmissions),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  candidate: one(candidates, { fields: [applications.candidateId], references: [candidates.id] }),
  interviews: many(interviews),
  assessmentSubmissions: many(assessmentSubmissions),
  offerLetter: one(offerLetters),
}));

export const interviewPanelsRelations = relations(interviewPanels, ({ one, many }) => ({
  job: one(jobs, { fields: [interviewPanels.jobId], references: [jobs.id] }),
  interviews: many(interviews),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, { fields: [interviews.applicationId], references: [applications.id] }),
  panel: one(interviewPanels, { fields: [interviews.panelId], references: [interviewPanels.id] }),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  job: one(jobs, { fields: [assessments.jobId], references: [jobs.id] }),
  creator: one(users, { fields: [assessments.createdBy], references: [users.id] }),
  submissions: many(assessmentSubmissions),
}));

export const assessmentSubmissionsRelations = relations(assessmentSubmissions, ({ one }) => ({
  assessment: one(assessments, { fields: [assessmentSubmissions.assessmentId], references: [assessments.id] }),
  candidate: one(candidates, { fields: [assessmentSubmissions.candidateId], references: [candidates.id] }),
  application: one(applications, { fields: [assessmentSubmissions.applicationId], references: [applications.id] }),
}));

export const offerLettersRelations = relations(offerLetters, ({ one }) => ({
  application: one(applications, { fields: [offerLetters.applicationId], references: [applications.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true });
export const insertCandidateSchema = createInsertSchema(candidates).omit({ id: true, createdAt: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, appliedAt: true, updatedAt: true });
export const insertInterviewPanelSchema = createInsertSchema(interviewPanels).omit({ id: true, createdAt: true });
export const insertInterviewSchema = createInsertSchema(interviews).omit({ id: true, createdAt: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true });
export const insertAssessmentSubmissionSchema = createInsertSchema(assessmentSubmissions).omit({ id: true });
export const insertOfferLetterSchema = createInsertSchema(offerLetters).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InterviewPanel = typeof interviewPanels.$inferSelect;
export type InsertInterviewPanel = z.infer<typeof insertInterviewPanelSchema>;
export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type AssessmentSubmission = typeof assessmentSubmissions.$inferSelect;
export type InsertAssessmentSubmission = z.infer<typeof insertAssessmentSubmissionSchema>;
export type OfferLetter = typeof offerLetters.$inferSelect;
export type InsertOfferLetter = z.infer<typeof insertOfferLetterSchema>;
