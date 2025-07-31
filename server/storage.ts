import { 
  users, jobs, candidates, applications, interviewPanels, interviews, 
  assessments, assessmentSubmissions, offerLetters,
  type User, type InsertUser, type Job, type InsertJob, 
  type Candidate, type InsertCandidate, type Application, type InsertApplication,
  type InterviewPanel, type InsertInterviewPanel, type Interview, type InsertInterview,
  type Assessment, type InsertAssessment, type AssessmentSubmission, type InsertAssessmentSubmission,
  type OfferLetter, type InsertOfferLetter
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Jobs
  createJob(job: InsertJob): Promise<Job>;
  getJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  getJobsByCreator(creatorId: string): Promise<Job[]>;
  updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;
  
  // Candidates
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  getCandidates(): Promise<Candidate[]>;
  getCandidate(id: string): Promise<Candidate | undefined>;
  getCandidateByEmail(email: string): Promise<Candidate | undefined>;
  updateCandidate(id: string, updates: Partial<InsertCandidate>): Promise<Candidate | undefined>;
  
  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationsByJob(jobId: string): Promise<Application[]>;
  getApplicationsByCandidate(candidateId: string): Promise<Application[]>;
  updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined>;
  
  // Interview Panels
  createInterviewPanel(panel: InsertInterviewPanel): Promise<InterviewPanel>;
  getInterviewPanels(): Promise<InterviewPanel[]>;
  getInterviewPanel(id: string): Promise<InterviewPanel | undefined>;
  getInterviewPanelsByJob(jobId: string): Promise<InterviewPanel[]>;
  updateInterviewPanel(id: string, updates: Partial<InsertInterviewPanel>): Promise<InterviewPanel | undefined>;
  deleteInterviewPanel(id: string): Promise<boolean>;
  
  // Interviews
  createInterview(interview: InsertInterview): Promise<Interview>;
  getInterviews(): Promise<Interview[]>;
  getInterview(id: string): Promise<Interview | undefined>;
  getInterviewsByApplication(applicationId: string): Promise<Interview[]>;
  getUpcomingInterviews(): Promise<Interview[]>;
  updateInterview(id: string, updates: Partial<InsertInterview>): Promise<Interview | undefined>;
  
  // Assessments
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessments(): Promise<Assessment[]>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  getAssessmentsByJob(jobId: string): Promise<Assessment[]>;
  updateAssessment(id: string, updates: Partial<InsertAssessment>): Promise<Assessment | undefined>;
  deleteAssessment(id: string): Promise<boolean>;
  
  // Assessment Submissions
  createAssessmentSubmission(submission: InsertAssessmentSubmission): Promise<AssessmentSubmission>;
  getAssessmentSubmissions(): Promise<AssessmentSubmission[]>;
  getAssessmentSubmission(id: string): Promise<AssessmentSubmission | undefined>;
  getAssessmentSubmissionsByCandidate(candidateId: string): Promise<AssessmentSubmission[]>;
  updateAssessmentSubmission(id: string, updates: Partial<InsertAssessmentSubmission>): Promise<AssessmentSubmission | undefined>;
  
  // Offer Letters
  createOfferLetter(offer: InsertOfferLetter): Promise<OfferLetter>;
  getOfferLetters(): Promise<OfferLetter[]>;
  getOfferLetter(id: string): Promise<OfferLetter | undefined>;
  getOfferLetterByApplication(applicationId: string): Promise<OfferLetter | undefined>;
  updateOfferLetter(id: string, updates: Partial<InsertOfferLetter>): Promise<OfferLetter | undefined>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    activeJobs: number;
    totalCandidates: number;
    scheduledInterviews: number;
    pendingOffers: number;
    pipeline: {
      review: number;
      assessment: number;
      interview: number;
      offer: number;
    };
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
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
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Jobs
  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getJobsByCreator(creatorId: string): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.createdBy, creatorId)).orderBy(desc(jobs.createdAt));
  }

  async updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined> {
    const [job] = await db.update(jobs).set(updates).where(eq(jobs.id, id)).returning();
    return job || undefined;
  }

  async deleteJob(id: string): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Candidates
  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const [newCandidate] = await db.insert(candidates).values(candidate).returning();
    return newCandidate;
  }

  async getCandidates(): Promise<Candidate[]> {
    return await db.select().from(candidates).orderBy(desc(candidates.createdAt));
  }

  async getCandidate(id: string): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, id));
    return candidate || undefined;
  }

  async getCandidateByEmail(email: string): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.email, email));
    return candidate || undefined;
  }

  async updateCandidate(id: string, updates: Partial<InsertCandidate>): Promise<Candidate | undefined> {
    const [candidate] = await db.update(candidates).set(updates).where(eq(candidates.id, id)).returning();
    return candidate || undefined;
  }

  // Applications
  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }

  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.appliedAt));
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async getApplicationsByJob(jobId: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.jobId, jobId)).orderBy(desc(applications.appliedAt));
  }

  async getApplicationsByCandidate(candidateId: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.candidateId, candidateId)).orderBy(desc(applications.appliedAt));
  }

  async updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    const updatedValues = { ...updates, updatedAt: new Date() };
    const [application] = await db.update(applications).set(updatedValues).where(eq(applications.id, id)).returning();
    return application || undefined;
  }

  // Interview Panels
  async createInterviewPanel(panel: InsertInterviewPanel): Promise<InterviewPanel> {
    const [newPanel] = await db.insert(interviewPanels).values(panel).returning();
    return newPanel;
  }

  async getInterviewPanels(): Promise<InterviewPanel[]> {
    return await db.select().from(interviewPanels).orderBy(desc(interviewPanels.createdAt));
  }

  async getInterviewPanel(id: string): Promise<InterviewPanel | undefined> {
    const [panel] = await db.select().from(interviewPanels).where(eq(interviewPanels.id, id));
    return panel || undefined;
  }

  async getInterviewPanelsByJob(jobId: string): Promise<InterviewPanel[]> {
    return await db.select().from(interviewPanels).where(eq(interviewPanels.jobId, jobId)).orderBy(desc(interviewPanels.createdAt));
  }

  async updateInterviewPanel(id: string, updates: Partial<InsertInterviewPanel>): Promise<InterviewPanel | undefined> {
    const [panel] = await db.update(interviewPanels).set(updates).where(eq(interviewPanels.id, id)).returning();
    return panel || undefined;
  }

  async deleteInterviewPanel(id: string): Promise<boolean> {
    const result = await db.delete(interviewPanels).where(eq(interviewPanels.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Interviews
  async createInterview(interview: InsertInterview): Promise<Interview> {
    const [newInterview] = await db.insert(interviews).values(interview).returning();
    return newInterview;
  }

  async getInterviews(): Promise<Interview[]> {
    return await db.select().from(interviews).orderBy(desc(interviews.scheduledAt));
  }

  async getInterview(id: string): Promise<Interview | undefined> {
    const [interview] = await db.select().from(interviews).where(eq(interviews.id, id));
    return interview || undefined;
  }

  async getInterviewsByApplication(applicationId: string): Promise<Interview[]> {
    return await db.select().from(interviews).where(eq(interviews.applicationId, applicationId)).orderBy(desc(interviews.scheduledAt));
  }

  async getUpcomingInterviews(): Promise<Interview[]> {
    const now = new Date();
    return await db.select().from(interviews)
      .where(and(
        eq(interviews.status, 'scheduled'),
        sql`${interviews.scheduledAt} > ${now}`
      ))
      .orderBy(interviews.scheduledAt);
  }

  async updateInterview(id: string, updates: Partial<InsertInterview>): Promise<Interview | undefined> {
    const [interview] = await db.update(interviews).set(updates).where(eq(interviews.id, id)).returning();
    return interview || undefined;
  }

  // Assessments
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  async getAssessments(): Promise<Assessment[]> {
    return await db.select().from(assessments).orderBy(desc(assessments.createdAt));
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment || undefined;
  }

  async getAssessmentsByJob(jobId: string): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.jobId, jobId)).orderBy(desc(assessments.createdAt));
  }

  async updateAssessment(id: string, updates: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const [assessment] = await db.update(assessments).set(updates).where(eq(assessments.id, id)).returning();
    return assessment || undefined;
  }

  async deleteAssessment(id: string): Promise<boolean> {
    const result = await db.delete(assessments).where(eq(assessments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Assessment Submissions
  async createAssessmentSubmission(submission: InsertAssessmentSubmission): Promise<AssessmentSubmission> {
    const [newSubmission] = await db.insert(assessmentSubmissions).values(submission).returning();
    return newSubmission;
  }

  async getAssessmentSubmissions(): Promise<AssessmentSubmission[]> {
    return await db.select().from(assessmentSubmissions).orderBy(desc(assessmentSubmissions.startedAt));
  }

  async getAssessmentSubmission(id: string): Promise<AssessmentSubmission | undefined> {
    const [submission] = await db.select().from(assessmentSubmissions).where(eq(assessmentSubmissions.id, id));
    return submission || undefined;
  }

  async getAssessmentSubmissionsByCandidate(candidateId: string): Promise<AssessmentSubmission[]> {
    return await db.select().from(assessmentSubmissions)
      .where(eq(assessmentSubmissions.candidateId, candidateId))
      .orderBy(desc(assessmentSubmissions.startedAt));
  }

  async updateAssessmentSubmission(id: string, updates: Partial<InsertAssessmentSubmission>): Promise<AssessmentSubmission | undefined> {
    const [submission] = await db.update(assessmentSubmissions).set(updates).where(eq(assessmentSubmissions.id, id)).returning();
    return submission || undefined;
  }

  // Offer Letters
  async createOfferLetter(offer: InsertOfferLetter): Promise<OfferLetter> {
    const [newOffer] = await db.insert(offerLetters).values(offer).returning();
    return newOffer;
  }

  async getOfferLetters(): Promise<OfferLetter[]> {
    return await db.select().from(offerLetters).orderBy(desc(offerLetters.createdAt));
  }

  async getOfferLetter(id: string): Promise<OfferLetter | undefined> {
    const [offer] = await db.select().from(offerLetters).where(eq(offerLetters.id, id));
    return offer || undefined;
  }

  async getOfferLetterByApplication(applicationId: string): Promise<OfferLetter | undefined> {
    const [offer] = await db.select().from(offerLetters).where(eq(offerLetters.applicationId, applicationId));
    return offer || undefined;
  }

  async updateOfferLetter(id: string, updates: Partial<InsertOfferLetter>): Promise<OfferLetter | undefined> {
    const [offer] = await db.update(offerLetters).set(updates).where(eq(offerLetters.id, id)).returning();
    return offer || undefined;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    activeJobs: number;
    totalCandidates: number;
    scheduledInterviews: number;
    pendingOffers: number;
    pipeline: {
      review: number;
      assessment: number;
      interview: number;
      offer: number;
    };
  }> {
    const [activeJobsResult] = await db.select({ count: count() }).from(jobs).where(eq(jobs.status, 'active'));
    const [totalCandidatesResult] = await db.select({ count: count() }).from(candidates);
    const [scheduledInterviewsResult] = await db.select({ count: count() }).from(interviews).where(eq(interviews.status, 'scheduled'));
    const [pendingOffersResult] = await db.select({ count: count() }).from(offerLetters).where(eq(offerLetters.status, 'sent'));

    const [reviewStageResult] = await db.select({ count: count() }).from(applications).where(eq(applications.stage, 'review'));
    const [assessmentStageResult] = await db.select({ count: count() }).from(applications).where(eq(applications.stage, 'assessment'));
    const [interviewStageResult] = await db.select({ count: count() }).from(applications).where(eq(applications.stage, 'interview'));
    const [offerStageResult] = await db.select({ count: count() }).from(applications).where(eq(applications.stage, 'offer'));

    return {
      activeJobs: activeJobsResult.count,
      totalCandidates: totalCandidatesResult.count,
      scheduledInterviews: scheduledInterviewsResult.count,
      pendingOffers: pendingOffersResult.count,
      pipeline: {
        review: reviewStageResult.count,
        assessment: assessmentStageResult.count,
        interview: interviewStageResult.count,
        offer: offerStageResult.count,
      },
    };
  }
}

export const storage = new DatabaseStorage();
