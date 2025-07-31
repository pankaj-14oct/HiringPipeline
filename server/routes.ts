import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobSchema, insertCandidateSchema, insertApplicationSchema, 
         insertInterviewPanelSchema, insertInterviewSchema, insertAssessmentSchema, 
         insertAssessmentSubmissionSchema, insertOfferLetterSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Jobs routes
  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid job data", errors: error.errors });
      } else {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Failed to create job" });
      }
    }
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const updates = insertJobSchema.partial().parse(req.body);
      const job = await storage.updateJob(req.params.id, updates);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid job data", errors: error.errors });
      } else {
        console.error("Error updating job:", error);
        res.status(500).json({ message: "Failed to update job" });
      }
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteJob(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  // Candidates routes
  app.post("/api/candidates", async (req, res) => {
    try {
      const candidateData = insertCandidateSchema.parse(req.body);
      const candidate = await storage.createCandidate(candidateData);
      res.status(201).json(candidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid candidate data", errors: error.errors });
      } else {
        console.error("Error creating candidate:", error);
        res.status(500).json({ message: "Failed to create candidate" });
      }
    }
  });

  app.get("/api/candidates", async (req, res) => {
    try {
      const candidates = await storage.getCandidates();
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const candidate = await storage.getCandidate(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      console.error("Error fetching candidate:", error);
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });

  // Applications routes
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid application data", errors: error.errors });
      } else {
        console.error("Error creating application:", error);
        res.status(500).json({ message: "Failed to create application" });
      }
    }
  });

  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/applications/job/:jobId", async (req, res) => {
    try {
      const applications = await storage.getApplicationsByJob(req.params.jobId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications for job:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.put("/api/applications/:id", async (req, res) => {
    try {
      const updates = insertApplicationSchema.partial().parse(req.body);
      const application = await storage.updateApplication(req.params.id, updates);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid application data", errors: error.errors });
      } else {
        console.error("Error updating application:", error);
        res.status(500).json({ message: "Failed to update application" });
      }
    }
  });

  // Interview Panels routes
  app.post("/api/interview-panels", async (req, res) => {
    try {
      const panelData = insertInterviewPanelSchema.parse(req.body);
      const panel = await storage.createInterviewPanel(panelData);
      res.status(201).json(panel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid panel data", errors: error.errors });
      } else {
        console.error("Error creating interview panel:", error);
        res.status(500).json({ message: "Failed to create interview panel" });
      }
    }
  });

  app.get("/api/interview-panels", async (req, res) => {
    try {
      const panels = await storage.getInterviewPanels();
      res.json(panels);
    } catch (error) {
      console.error("Error fetching interview panels:", error);
      res.status(500).json({ message: "Failed to fetch interview panels" });
    }
  });

  // Interviews routes
  app.post("/api/interviews", async (req, res) => {
    try {
      const interviewData = insertInterviewSchema.parse(req.body);
      const interview = await storage.createInterview(interviewData);
      res.status(201).json(interview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid interview data", errors: error.errors });
      } else {
        console.error("Error creating interview:", error);
        res.status(500).json({ message: "Failed to create interview" });
      }
    }
  });

  app.get("/api/interviews", async (req, res) => {
    try {
      const interviews = await storage.getInterviews();
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  });

  app.get("/api/interviews/upcoming", async (req, res) => {
    try {
      const interviews = await storage.getUpcomingInterviews();
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching upcoming interviews:", error);
      res.status(500).json({ message: "Failed to fetch upcoming interviews" });
    }
  });

  // Assessments routes
  app.post("/api/assessments", async (req, res) => {
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(assessmentData);
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid assessment data", errors: error.errors });
      } else {
        console.error("Error creating assessment:", error);
        res.status(500).json({ message: "Failed to create assessment" });
      }
    }
  });

  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  // Assessment Submissions routes
  app.post("/api/assessment-submissions", async (req, res) => {
    try {
      const submissionData = insertAssessmentSubmissionSchema.parse(req.body);
      const submission = await storage.createAssessmentSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      } else {
        console.error("Error creating assessment submission:", error);
        res.status(500).json({ message: "Failed to create assessment submission" });
      }
    }
  });

  // Offer Letters routes
  app.post("/api/offer-letters", async (req, res) => {
    try {
      const offerData = insertOfferLetterSchema.parse(req.body);
      const offer = await storage.createOfferLetter(offerData);
      res.status(201).json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid offer data", errors: error.errors });
      } else {
        console.error("Error creating offer letter:", error);
        res.status(500).json({ message: "Failed to create offer letter" });
      }
    }
  });

  app.get("/api/offer-letters", async (req, res) => {
    try {
      const offers = await storage.getOfferLetters();
      res.json(offers);
    } catch (error) {
      console.error("Error fetching offer letters:", error);
      res.status(500).json({ message: "Failed to fetch offer letters" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
