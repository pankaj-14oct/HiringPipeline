import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Calendar, FileText, CheckCircle, Clock, AlertCircle, BookOpen, Play, Target, MapPin, DollarSign, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import CandidateAssessmentInterface from "@/components/candidate-assessment-interface";
import type { Job, Application, Assessment, AssessmentSubmission, Candidate } from "@shared/schema";

export default function CandidatePortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<{
    assessmentId: string;
    candidateId: string;
    applicationId: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock candidate ID - in real app this would come from authentication
  const candidateId = "c2342dd7-70a4-4a9f-b8cf-a922e7f56609";

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const { data: assessments = [], isLoading: assessmentsLoading } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
  });

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<AssessmentSubmission[]>({
    queryKey: [`/api/assessment-submissions/candidate/${candidateId}`],
  });

  const { data: currentCandidate } = useQuery<Candidate>({
    queryKey: [`/api/candidates/${candidateId}`],
  });

  // Get candidate's applications
  const candidateApplications = applications.filter(app => app.candidateId === candidateId);

  // Get jobs candidate has already applied to
  const appliedJobIds = new Set(candidateApplications.map(app => app.jobId));

  // Job application mutation
  const applyToJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          candidateId,
          status: "applied",
          stage: "review"
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully!",
      });
      setSelectedJob(null);
    },
    onError: (error) => {
      toast({
        title: "Application Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredJobs = jobs.filter(job =>
    job.status === "active" && (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "screening":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "interview":
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case "offer":
        return <FileText className="w-4 h-4 text-purple-500" />;
      case "hired":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>;
      case "screening":
        return <Badge className="bg-yellow-100 text-yellow-800">Screening</Badge>;
      case "interview":
        return <Badge className="bg-orange-100 text-orange-800">Interview</Badge>;
      case "offer":
        return <Badge className="bg-purple-100 text-purple-800">Offer</Badge>;
      case "hired":
        return <Badge className="bg-green-100 text-green-800">Hired</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">HireFlow</h1>
              <span className="text-sm text-gray-500">Candidate Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentCandidate?.name || "Candidate"}</p>
                  <p className="text-xs text-gray-500">{currentCandidate?.email || "candidate@email.com"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your career portal</h2>
          <p className="text-gray-600">Explore job opportunities and track your application progress</p>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search jobs..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobsLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredJobs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    {searchTerm ? "No jobs found matching your search" : "No job openings available at the moment"}
                  </p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{job.department}</Badge>
                        <span className="text-sm text-gray-600">{job.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Experience:</span>
                          <span className="ml-2">{job.experience}</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">Salary:</span>
                            <span className="ml-2">{job.salary}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Posted {formatDate(job.createdAt)}</span>
                        {appliedJobIds.has(job.id) ? (
                          <Badge variant="secondary">Applied</Badge>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" onClick={() => setSelectedJob(job)}>Apply Now</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                              </DialogHeader>
                              
                              {selectedJob && (
                                <div className="space-y-4">
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">{selectedJob.title}</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div className="flex items-center space-x-2">
                                        <Briefcase className="w-4 h-4 text-gray-500" />
                                        <span>{selectedJob.department}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span>{selectedJob.location}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Target className="w-4 h-4 text-gray-500" />
                                        <span>{selectedJob.experience}</span>
                                      </div>
                                      {selectedJob.salary && (
                                        <div className="flex items-center space-x-2">
                                          <DollarSign className="w-4 h-4 text-gray-500" />
                                          <span>{selectedJob.salary}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Job Description</h4>
                                    <p className="text-sm text-gray-600">{selectedJob.description}</p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Required Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedJob.skills.split(',').map((skill, index) => (
                                        <Badge key={index} variant="outline">{skill.trim()}</Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {currentCandidate && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                      <h4 className="font-medium mb-2">Your Profile</h4>
                                      <div className="text-sm text-gray-600">
                                        <p><strong>Name:</strong> {currentCandidate.name}</p>
                                        <p><strong>Email:</strong> {currentCandidate.email}</p>
                                        {currentCandidate.experience && (
                                          <p><strong>Experience:</strong> {currentCandidate.experience}</p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setSelectedJob(null)}>
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={() => selectedJob && applyToJobMutation.mutate(selectedJob.id)}
                                  disabled={applyToJobMutation.isPending}
                                >
                                  {applyToJobMutation.isPending ? "Submitting..." : "Submit Application"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="space-y-4">
              {applicationsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : candidateApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                      <FileText className="w-full h-full" />
                    </div>
                    <p className="text-gray-500">You haven't applied to any jobs yet</p>
                    <Button className="mt-4" onClick={() => window.location.hash = "jobs"}>
                      Browse Available Jobs
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                candidateApplications.map((application) => {
                  const job = jobs.find(j => j.id === application.jobId);
                  return (
                    <Card key={application.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{job?.title || "Job Application"}</h3>
                            <p className="text-sm text-gray-600">{job?.department} • {job?.location}</p>
                          </div>
                          {getStatusBadge(application.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Applied Date</p>
                            <p className="text-sm text-gray-600">{formatDate(application.appliedAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Current Stage</p>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(application.stage)}
                              <span className="text-sm text-gray-600 capitalize">{application.stage}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Last Updated</p>
                            <p className="text-sm text-gray-600">{formatDate(application.updatedAt)}</p>
                          </div>
                        </div>

                        {application.notes && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                            <p className="text-sm text-gray-600">{application.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm">View Details</Button>
                            {application.stage === "assessment" && (
                              <Button size="sm">Take Assessment</Button>
                            )}
                          </div>
                          {application.score && (
                            <Badge className="bg-blue-100 text-blue-800">
                              Score: {application.score}/100
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            {activeAssessment ? (
              <CandidateAssessmentInterface
                assessmentId={activeAssessment.assessmentId}
                candidateId={activeAssessment.candidateId}
                applicationId={activeAssessment.applicationId}
                onComplete={(submission) => {
                  console.log("Assessment completed:", submission);
                  setActiveAssessment(null);
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Available Assessments */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Assessments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assessmentsLoading ? (
                      Array(2).fill(0).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <Skeleton className="h-32 w-full" />
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      assessments
                        .filter(assessment => {
                          // Find if candidate has applications that could take this assessment
                          const hasEligibleApplication = candidateApplications.some(app => app.jobId === assessment.jobId);
                          const alreadySubmitted = submissions.some(sub => sub.assessmentId === assessment.id);
                          return hasEligibleApplication && !alreadySubmitted;
                        })
                        .map((assessment) => {
                          const relevantApplication = candidateApplications.find(app => 
                            app.jobId === assessment.jobId
                          );
                          
                          return (
                            <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center space-x-2">
                                  <BookOpen className="w-5 h-5 text-blue-500" />
                                  <span>{assessment.title}</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Time Limit:</span>
                                    <span className="font-medium">{assessment.timeLimit} minutes</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Passing Score:</span>
                                    <span className="font-medium">{assessment.passingScore}%</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Questions:</span>
                                    <span className="font-medium">{assessment.questionCount || 'Varies'}</span>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => setActiveAssessment({
                                    assessmentId: assessment.id,
                                    candidateId,
                                    applicationId: relevantApplication?.id || ""
                                  })}
                                  className="w-full"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Assessment
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Completed Assessments */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Assessments</h3>
                  <div className="space-y-4">
                    {submissionsLoading ? (
                      Array(2).fill(0).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <Skeleton className="h-20 w-full" />
                          </CardContent>
                        </Card>
                      ))
                    ) : submissions.length === 0 ? (
                      <Card>
                        <CardContent className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                            <Target className="w-full h-full" />
                          </div>
                          <p className="text-gray-500">No completed assessments yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      submissions.map((submission) => {
                        const assessment = assessments.find(a => a.id === submission.assessmentId);
                        const application = candidateApplications.find(app => app.id === submission.applicationId);
                        const job = jobs.find(j => j.id === application?.jobId);
                        
                        return (
                          <Card key={submission.id}>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{assessment?.title}</h4>
                                  <p className="text-sm text-gray-600">{job?.title} • {job?.department}</p>
                                </div>
                                <div className="text-right">
                                  {submission.score && (
                                    <div className="text-2xl font-bold text-blue-600">
                                      {submission.percentage || Math.round((submission.score / (submission.maxScore || submission.score)) * 100)}%
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500">
                                    {submission.status === "graded" ? "Graded" : "Pending"}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Submitted:</span>
                                  <span className="ml-2">{formatDate(submission.submittedAt)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Time Spent:</span>
                                  <span className="ml-2">{submission.timeSpent || 'N/A'} min</span>
                                </div>
                              </div>
                              
                              {submission.status === "graded" && submission.score && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>Score: {submission.score}/{submission.maxScore || submission.score}</span>
                                    <Badge 
                                      className={submission.percentage && submission.percentage >= (assessment?.passingScore || 70) 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-red-100 text-red-800"
                                      }
                                    >
                                      {submission.percentage && submission.percentage >= (assessment?.passingScore || 70) ? "Passed" : "Failed"}
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}