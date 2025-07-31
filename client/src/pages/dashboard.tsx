import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Users, Calendar, FileText, Plus, Lightbulb, CalendarDays, UserCheck } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCard from "@/components/stats-card";
import PipelineStage from "@/components/pipeline-stage";
import JobModal from "@/components/modals/job-modal";
import InterviewModal from "@/components/modals/interview-modal";
import AssessmentModal from "@/components/modals/assessment-modal";
import OfferModal from "@/components/modals/offer-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats, JobWithApplications, InterviewWithDetails } from "@/lib/types";
import type { Job, Interview } from "@shared/schema";

export default function Dashboard() {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: upcomingInterviews = [], isLoading: interviewsLoading } = useQuery<Interview[]>({
    queryKey: ["/api/interviews/upcoming"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Dashboard" 
          description="Overview of your hiring pipeline and recent activities"
          onAction={() => setShowJobModal(true)}
          actionLabel="Post New Job"
        />

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <Skeleton className="h-16 w-full" />
                </div>
              ))
            ) : (
              <>
                <StatsCard
                  title="Active Jobs"
                  value={stats?.activeJobs || 0}
                  icon={Briefcase}
                  change="+12%"
                  changeType="positive"
                  subtitle="vs last month"
                />
                <StatsCard
                  title="Total Candidates"
                  value={stats?.totalCandidates || 0}
                  icon={Users}
                  change="+8%"
                  changeType="positive"
                  subtitle="vs last month"
                />
                <StatsCard
                  title="Interviews Scheduled"
                  value={stats?.scheduledInterviews || 0}
                  icon={Calendar}
                  subtitle="This week"
                />
                <StatsCard
                  title="Offers Pending"
                  value={stats?.pendingOffers || 0}
                  icon={FileText}
                  change="Action needed"
                  changeType="negative"
                />
              </>
            )}
          </div>

          {/* Hiring Pipeline & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hiring Pipeline */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Hiring Pipeline</h3>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
                  <option>All Jobs</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Product Manager</option>
                </select>
              </div>
              
              <div className="space-y-4">
                {statsLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))
                ) : (
                  <>
                    <PipelineStage 
                      stage="Application Review" 
                      count={stats?.pipeline.review || 0} 
                      color="#3b82f6"
                    />
                    <PipelineStage 
                      stage="Technical Assessment" 
                      count={stats?.pipeline.assessment || 0} 
                      color="#eab308"
                    />
                    <PipelineStage 
                      stage="Interview" 
                      count={stats?.pipeline.interview || 0} 
                      color="#f97316"
                    />
                    <PipelineStage 
                      stage="Offer" 
                      count={stats?.pipeline.offer || 0} 
                      color="#22c55e"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Interviews & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
                <Button variant="ghost" size="sm">
                  View Calendar
                </Button>
              </div>
              
              <div className="space-y-4">
                {interviewsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))
                ) : upcomingInterviews.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <CalendarDays className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No upcoming interviews</p>
                  </div>
                ) : (
                  upcomingInterviews.slice(0, 3).map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Interview Scheduled</h4>
                          <p className="text-sm text-gray-600">{interview.type} Interview</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatTime(interview.scheduledAt)}</p>
                        <p className="text-xs text-gray-500">{formatDate(interview.scheduledAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowJobModal(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors text-center group"
                >
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2 mx-auto" />
                  <p className="text-sm font-medium text-gray-700 group-hover:text-primary">Post New Job</p>
                </button>

                <button 
                  onClick={() => setShowInterviewModal(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors text-center group"
                >
                  <CalendarDays className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2 mx-auto" />
                  <p className="text-sm font-medium text-gray-700 group-hover:text-primary">Schedule Interview</p>
                </button>

                <button 
                  onClick={() => setShowAssessmentModal(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors text-center group"
                >
                  <FileText className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2 mx-auto" />
                  <p className="text-sm font-medium text-gray-700 group-hover:text-primary">Create Assessment</p>
                </button>

                <button 
                  onClick={() => setShowOfferModal(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors text-center group"
                >
                  <FileText className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2 mx-auto" />
                  <p className="text-sm font-medium text-gray-700 group-hover:text-primary">Generate Offer</p>
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-gray-900">Pro Tip</h4>
                    <p className="text-sm text-gray-600 mt-1">Set up automated screening criteria to save time on initial candidate filtering.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Postings Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Active Job Postings</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Input 
                    placeholder="Search jobs..." 
                    className="pl-10 pr-4 py-2"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <Button onClick={() => setShowJobModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {jobsLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No job postings yet</p>
                            <Button 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => setShowJobModal(true)}
                            >
                              Create your first job
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobs.slice(0, 5).map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <div>
                              <h4 className="font-medium text-gray-900">{job.title}</h4>
                              <p className="text-sm text-gray-600">{job.location}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">{job.department}</TableCell>
                          <TableCell>
                            <span className="text-lg font-semibold text-gray-900">0</span>
                            <span className="text-sm text-gray-600 ml-1">applications</span>
                          </TableCell>
                          <TableCell>{getStatusBadge(job.status)}</TableCell>
                          <TableCell className="text-gray-600">{formatDate(job.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <JobModal open={showJobModal} onOpenChange={setShowJobModal} />
      <InterviewModal open={showInterviewModal} onOpenChange={setShowInterviewModal} />
      <AssessmentModal open={showAssessmentModal} onOpenChange={setShowAssessmentModal} />
      <OfferModal open={showOfferModal} onOpenChange={setShowOfferModal} />
    </div>
  );
}
