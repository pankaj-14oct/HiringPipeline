export interface DashboardStats {
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
}

export interface JobWithApplications {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  description: string;
  skills: string;
  salary?: string;
  status: string;
  createdBy: string;
  createdAt: Date;
  applicationCount?: number;
}

export interface CandidateWithApplications {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume?: string;
  skills: string[];
  experience?: string;
  education?: string;
  status: string;
  createdAt: Date;
  applicationCount?: number;
}

export interface ApplicationWithDetails {
  id: string;
  jobId: string;
  candidateId: string;
  status: string;
  stage: string;
  score?: number;
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
  job?: {
    title: string;
    department: string;
  };
  candidate?: {
    name: string;
    email: string;
  };
}

export interface InterviewWithDetails {
  id: string;
  applicationId: string;
  panelId?: string;
  scheduledAt: Date;
  duration: number;
  type: string;
  status: string;
  feedback?: string;
  score?: number;
  interviewerNotes: Record<string, any>;
  createdAt: Date;
  application?: {
    candidate?: {
      name: string;
      email: string;
    };
    job?: {
      title: string;
      department: string;
    };
  };
  panel?: {
    name: string;
    interviewers: string[];
  };
}
