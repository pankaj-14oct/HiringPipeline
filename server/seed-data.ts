import { db } from "./db";
import { 
  users, jobs, candidates, applications, interviewPanels, 
  interviews, assessments, assessmentSubmissions, offerLetters 
} from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting to seed database...");

    // Create users first
    const userData = [
      {
        username: "sarah.johnson",
        password: "password123",
        role: "hr",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com"
      },
      {
        username: "mike.chen",
        password: "password123",
        role: "recruiter",
        name: "Mike Chen",
        email: "mike.chen@company.com"
      },
      {
        username: "alex.kumar",
        password: "password123",
        role: "interviewer",
        name: "Alex Kumar",
        email: "alex.kumar@company.com"
      },
      {
        username: "john.doe",
        password: "password123",
        role: "candidate",
        name: "John Doe",
        email: "john.doe@gmail.com"
      }
    ];

    const createdUsers = await db.insert(users).values(userData).returning();
    console.log(`✅ Created ${createdUsers.length} users`);

    const hrUser = createdUsers.find(u => u.role === "hr");
    const recruiterUser = createdUsers.find(u => u.role === "recruiter");
    const interviewerUser = createdUsers.find(u => u.role === "interviewer");
    const candidateUser = createdUsers.find(u => u.role === "candidate");

    // Create jobs
    const jobsData = [
      {
        title: "Senior Frontend Developer",
        department: "Engineering",
        location: "San Francisco, CA",
        experience: "Senior Level",
        description: "We're looking for a Senior Frontend Developer to join our engineering team. You'll be responsible for building user-facing features using React, TypeScript, and modern web technologies. The ideal candidate has 5+ years of experience and a passion for creating exceptional user experiences.",
        skills: "React, TypeScript, JavaScript, CSS, HTML, Redux, Next.js",
        salary: "$130,000 - $160,000",
        status: "active",
        createdBy: hrUser!.id
      },
      {
        title: "Backend Engineer",
        department: "Engineering",
        location: "Remote",
        experience: "Mid Level",
        description: "Join our backend team to build scalable APIs and microservices. You'll work with Node.js, PostgreSQL, and cloud technologies to support our growing platform. We're looking for someone with 3-5 years of experience in backend development.",
        skills: "Node.js, PostgreSQL, Express, AWS, Docker, Kubernetes",
        salary: "$110,000 - $140,000",
        status: "active",
        createdBy: recruiterUser!.id
      },
      {
        title: "Product Manager",
        department: "Product",
        location: "New York, NY",
        experience: "Senior Level",
        description: "Lead product strategy and development for our core platform. Work closely with engineering, design, and business teams to deliver features that delight our users. 4+ years of product management experience required.",
        skills: "Product Strategy, User Research, Analytics, Agile, Figma",
        salary: "$120,000 - $150,000",
        status: "active",
        createdBy: hrUser!.id
      },
      {
        title: "UX Designer",
        department: "Design",
        location: "Austin, TX",
        experience: "Mid Level",
        description: "Create beautiful and intuitive user experiences for our web and mobile applications. Collaborate with product and engineering teams to bring designs to life. 3+ years of UX design experience preferred.",
        skills: "Figma, Sketch, User Research, Prototyping, Design Systems",
        salary: "$90,000 - $120,000",
        status: "active",
        createdBy: hrUser!.id
      },
      {
        title: "DevOps Engineer",
        department: "Engineering",
        location: "Seattle, WA",
        experience: "Senior Level",
        description: "Build and maintain our cloud infrastructure and deployment pipelines. Ensure high availability and scalability of our systems. Experience with AWS, Kubernetes, and CI/CD required.",
        skills: "AWS, Kubernetes, Docker, Terraform, Jenkins, Python",
        salary: "$140,000 - $170,000",
        status: "closed",
        createdBy: recruiterUser!.id
      }
    ];

    const createdJobs = await db.insert(jobs).values(jobsData).returning();
    console.log(`✅ Created ${createdJobs.length} jobs`);

    // Create candidates
    const candidatesData = [
      {
        name: "Alice Thompson",
        email: "alice.thompson@email.com",
        phone: "+1 (555) 123-4567",
        resume: "Experienced frontend developer with 6 years at top tech companies. Led development of React applications serving millions of users. Expert in TypeScript, React, and modern web technologies.",
        skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Redux", "Next.js", "GraphQL"],
        experience: "6 years",
        education: "Bachelor's in Computer Science - Stanford University",
        status: "interview"
      },
      {
        name: "Robert Chen",
        email: "robert.chen@email.com",
        phone: "+1 (555) 234-5678",
        resume: "Full-stack engineer with strong backend focus. Built scalable microservices handling millions of requests. Expertise in Node.js, databases, and cloud architecture.",
        skills: ["Node.js", "PostgreSQL", "Express", "AWS", "Docker", "Python", "MongoDB"],
        experience: "4 years",
        education: "Master's in Software Engineering - MIT",
        status: "screening"
      },
      {
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com",
        phone: "+1 (555) 345-6789",
        resume: "Product manager with proven track record of launching successful features. Led cross-functional teams and delivered products that increased user engagement by 40%.",
        skills: ["Product Strategy", "User Research", "Analytics", "Agile", "Scrum", "Figma"],
        experience: "5 years",
        education: "MBA - Harvard Business School",
        status: "offer"
      },
      {
        name: "David Kim",
        email: "david.kim@email.com",
        phone: "+1 (555) 456-7890",
        resume: "Creative UX designer passionate about user-centered design. Designed award-winning mobile apps and web platforms. Strong background in user research and design systems.",
        skills: ["Figma", "Sketch", "User Research", "Prototyping", "Design Systems", "Adobe Creative Suite"],
        experience: "3 years",
        education: "Bachelor's in Design - RISD",
        status: "new"
      },
      {
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        phone: "+1 (555) 567-8901",
        resume: "DevOps engineer with expertise in cloud infrastructure and automation. Built CI/CD pipelines that reduced deployment time by 80%. Strong AWS and Kubernetes experience.",
        skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Python", "Linux"],
        experience: "5 years",
        education: "Bachelor's in Computer Engineering - UC Berkeley",
        status: "hired"
      },
      {
        name: "Michael Brown",
        email: "michael.brown@email.com",
        phone: "+1 (555) 678-9012",
        resume: "Junior frontend developer with strong foundation in React and modern web development. Recent bootcamp graduate with portfolio of impressive projects.",
        skills: ["React", "JavaScript", "CSS", "HTML", "Git", "MongoDB"],
        experience: "1 year",
        education: "Full Stack Web Development Bootcamp - General Assembly",
        status: "rejected"
      }
    ];

    const createdCandidates = await db.insert(candidates).values(candidatesData).returning();
    console.log(`✅ Created ${createdCandidates.length} candidates`);

    // Create applications
    const applicationsData = [
      {
        jobId: createdJobs[0].id, // Senior Frontend Developer
        candidateId: createdCandidates[0].id, // Alice Thompson
        status: "interview",
        stage: "interview",
        score: 85,
        notes: "Strong technical background, excellent communication skills. Passed technical screening with flying colors."
      },
      {
        jobId: createdJobs[1].id, // Backend Engineer
        candidateId: createdCandidates[1].id, // Robert Chen
        status: "screening",
        stage: "assessment",
        score: 78,
        notes: "Good technical knowledge, needs to improve system design skills. Scheduled for technical assessment."
      },
      {
        jobId: createdJobs[2].id, // Product Manager
        candidateId: createdCandidates[2].id, // Emily Rodriguez
        status: "offer",
        stage: "offer",
        score: 92,
        notes: "Exceptional candidate with great product sense. Team unanimously voted to extend offer."
      },
      {
        jobId: createdJobs[3].id, // UX Designer
        candidateId: createdCandidates[3].id, // David Kim
        status: "applied",
        stage: "review",
        notes: "Portfolio looks promising, scheduling initial phone screen."
      },
      {
        jobId: createdJobs[4].id, // DevOps Engineer
        candidateId: createdCandidates[4].id, // Sarah Wilson
        status: "hired",
        stage: "offer",
        score: 95,
        notes: "Outstanding candidate, perfect fit for the role. Offer accepted, starting next month."
      },
      {
        jobId: createdJobs[0].id, // Senior Frontend Developer
        candidateId: createdCandidates[5].id, // Michael Brown
        status: "rejected",
        stage: "review",
        score: 45,
        notes: "Not enough experience for senior role. Suggested to apply for junior positions in the future."
      }
    ];

    const createdApplications = await db.insert(applications).values(applicationsData).returning();
    console.log(`✅ Created ${createdApplications.length} applications`);

    // Create interview panels
    const panelsData = [
      {
        name: "Frontend Engineering Panel",
        description: "Technical panel for frontend engineering roles including senior engineers and team leads.",
        interviewers: [interviewerUser!.id, hrUser!.id],
        jobId: createdJobs[0].id
      },
      {
        name: "Backend Engineering Panel",
        description: "Technical panel for backend engineering positions with focus on system design and architecture.",
        interviewers: [interviewerUser!.id, recruiterUser!.id],
        jobId: createdJobs[1].id
      },
      {
        name: "Product Management Panel",
        description: "Cross-functional panel for product management roles including product leads and engineering managers.",
        interviewers: [hrUser!.id, recruiterUser!.id],
        jobId: createdJobs[2].id
      },
      {
        name: "Design Panel",
        description: "Design-focused panel with senior designers and product team members.",
        interviewers: [interviewerUser!.id, hrUser!.id],
        jobId: createdJobs[3].id
      }
    ];

    const createdPanels = await db.insert(interviewPanels).values(panelsData).returning();
    console.log(`✅ Created ${createdPanels.length} interview panels`);

    // Create interviews
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const interviewsData = [
      {
        applicationId: createdApplications[0].id,
        panelId: createdPanels[0].id,
        scheduledAt: tomorrow,
        duration: 60,
        type: "technical",
        status: "scheduled",
        feedback: "",
        interviewerNotes: {}
      },
      {
        applicationId: createdApplications[1].id,
        panelId: createdPanels[1].id,
        scheduledAt: nextWeek,
        duration: 45,
        type: "hr",
        status: "scheduled",
        feedback: "",
        interviewerNotes: {}
      },
      {
        applicationId: createdApplications[2].id,
        panelId: createdPanels[2].id,
        scheduledAt: lastWeek,
        duration: 60,
        type: "final",
        status: "completed",
        feedback: "Excellent candidate with strong product vision and leadership skills. Highly recommend for hire.",
        score: 92,
        interviewerNotes: {
          "technical": "Strong understanding of product metrics and user research",
          "communication": "Excellent presentation and stakeholder management skills",
          "culture": "Great culture fit, collaborative and data-driven approach"
        }
      },
      {
        applicationId: createdApplications[4].id,
        panelId: createdPanels[1].id,
        scheduledAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        duration: 90,
        type: "technical",
        status: "completed",
        feedback: "Outstanding technical depth and practical experience. Demonstrated excellent problem-solving skills.",
        score: 95,
        interviewerNotes: {
          "technical": "Expert-level knowledge of AWS and Kubernetes",
          "problem_solving": "Solved complex infrastructure challenges efficiently",
          "experience": "Proven track record with similar scale and complexity"
        }
      }
    ];

    const createdInterviews = await db.insert(interviews).values(interviewsData).returning();
    console.log(`✅ Created ${createdInterviews.length} interviews`);

    // Create assessments
    const assessmentsData = [
      {
        title: "React Frontend Assessment",
        description: "Technical assessment focusing on React, TypeScript, and modern frontend development practices.",
        type: "coding",
        questions: [
          {
            id: 1,
            question: "Build a Todo List component with React hooks",
            type: "coding",
            timeLimit: 45
          },
          {
            id: 2,
            question: "Optimize a slow rendering component",
            type: "coding",
            timeLimit: 30
          },
          {
            id: 3,
            question: "Implement custom hooks for data fetching",
            type: "coding",
            timeLimit: 30
          }
        ],
        timeLimit: 120,
        passingScore: 70,
        jobId: createdJobs[0].id,
        createdBy: hrUser!.id
      },
      {
        title: "Backend System Design",
        description: "Assessment covering system design, database modeling, and API development.",
        type: "assignment",
        questions: [
          {
            id: 1,
            question: "Design a scalable chat application backend",
            type: "system_design",
            timeLimit: 60
          },
          {
            id: 2,
            question: "Optimize database queries for large datasets",
            type: "coding",
            timeLimit: 45
          }
        ],
        timeLimit: 120,
        passingScore: 75,
        jobId: createdJobs[1].id,
        createdBy: recruiterUser!.id
      },
      {
        title: "Product Management Case Study",
        description: "Case study assessment for product management skills including prioritization and user research.",
        type: "assignment",
        questions: [
          {
            id: 1,
            question: "Prioritize features for a mobile app launch",
            type: "case_study",
            timeLimit: 60
          },
          {
            id: 2,
            question: "Design user research plan for new feature",
            type: "written",
            timeLimit: 45
          }
        ],
        timeLimit: 120,
        passingScore: 80,
        jobId: createdJobs[2].id,
        createdBy: hrUser!.id
      },
      {
        title: "UX Design Portfolio Review",
        description: "Design challenge and portfolio review for UX designer position.",
        type: "assignment",
        questions: [
          {
            id: 1,
            question: "Redesign a complex user flow",
            type: "design",
            timeLimit: 90
          },
          {
            id: 2,
            question: "Present design rationale and user research",
            type: "presentation",
            timeLimit: 30
          }
        ],
        timeLimit: 150,
        passingScore: 75,
        jobId: createdJobs[3].id,
        createdBy: hrUser!.id
      }
    ];

    const createdAssessments = await db.insert(assessments).values(assessmentsData).returning();
    console.log(`✅ Created ${createdAssessments.length} assessments`);

    // Create assessment submissions
    const submissionsData = [
      {
        assessmentId: createdAssessments[0].id,
        candidateId: createdCandidates[0].id,
        applicationId: createdApplications[0].id,
        answers: {
          "1": "Implemented a complete Todo component with add, delete, and toggle functionality using useState and useEffect hooks.",
          "2": "Used React.memo and useMemo to optimize rendering performance for large lists.",
          "3": "Created a custom useApi hook with error handling and loading states."
        },
        score: 85,
        status: "graded",
        startedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        submittedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        gradedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000)
      },
      {
        assessmentId: createdAssessments[1].id,
        candidateId: createdCandidates[1].id,
        applicationId: createdApplications[1].id,
        answers: {
          "1": "Designed a microservices architecture with WebSocket connections for real-time messaging.",
          "2": "Implemented database indexing and query optimization strategies."
        },
        score: 78,
        status: "graded",
        startedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        submittedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        gradedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        assessmentId: createdAssessments[2].id,
        candidateId: createdCandidates[2].id,
        applicationId: createdApplications[2].id,
        answers: {
          "1": "Prioritized features based on user impact, business value, and technical feasibility using RICE framework.",
          "2": "Designed comprehensive user research plan including surveys, interviews, and A/B testing."
        },
        score: 92,
        status: "graded",
        startedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        submittedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        gradedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
      }
    ];

    const createdSubmissions = await db.insert(assessmentSubmissions).values(submissionsData).returning();
    console.log(`✅ Created ${createdSubmissions.length} assessment submissions`);

    // Create offer letters
    const offersData = [
      {
        applicationId: createdApplications[2].id, // Emily Rodriguez - Product Manager
        title: "Product Manager",
        salary: "$135,000 per year",
        startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        template: "standard",
        customContent: "We are excited to offer you the position of Product Manager. You will receive equity options, comprehensive health benefits, and access to our professional development program.",
        status: "sent",
        sentAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        applicationId: createdApplications[4].id, // Sarah Wilson - DevOps Engineer
        title: "DevOps Engineer",
        salary: "$155,000 per year",
        startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        template: "senior",
        customContent: "Congratulations! We are pleased to offer you the Senior DevOps Engineer position. Your package includes stock options, signing bonus, and flexible remote work arrangements.",
        status: "accepted",
        sentAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        respondedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        applicationId: createdApplications[0].id, // Alice Thompson - Frontend Developer
        title: "Senior Frontend Developer",
        salary: "$145,000 per year",
        startDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        template: "standard",
        customContent: "We would like to extend an offer for the Senior Frontend Developer role. This includes competitive salary, equity package, and opportunities to lead major frontend initiatives.",
        status: "draft"
      }
    ];

    const createdOffers = await db.insert(offerLetters).values(offersData).returning();
    console.log(`✅ Created ${createdOffers.length} offer letters`);

    console.log("🎉 Database seeded successfully!");
    console.log(`
📊 Summary:
   - Users: ${createdUsers.length}
   - Jobs: ${createdJobs.length}
   - Candidates: ${createdCandidates.length}
   - Applications: ${createdApplications.length}
   - Interview Panels: ${createdPanels.length}
   - Interviews: ${createdInterviews.length}
   - Assessments: ${createdAssessments.length}
   - Assessment Submissions: ${createdSubmissions.length}
   - Offer Letters: ${createdOffers.length}
    `);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}