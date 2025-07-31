import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Calendar, Clock, Users, VideoIcon } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import EnhancedInterviewModal from "@/components/modals/enhanced-interview-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Interview } from "@shared/schema";

export default function Interviews() {
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interviews = [], isLoading } = useQuery<Interview[]>({
    queryKey: ["/api/interviews"],
  });

  const filteredInterviews = interviews.filter(interview =>
    interview.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "rescheduled":
        return <Badge className="bg-yellow-100 text-yellow-800">Rescheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "technical":
        return <Badge className="bg-purple-100 text-purple-800">Technical</Badge>;
      case "hr":
        return <Badge className="bg-orange-100 text-orange-800">HR</Badge>;
      case "behavioral":
        return <Badge className="bg-blue-100 text-blue-800">Behavioral</Badge>;
      case "final":
        return <Badge className="bg-green-100 text-green-800">Final Round</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (date: Date | string) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Interviews" 
          description="Schedule and manage interviews with candidates"
          onAction={() => setShowInterviewModal(true)}
          actionLabel="Schedule Interview"
        />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search interviews..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowInterviewModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
            
            {/* Interviews Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Interview Type</TableHead>
                      <TableHead>Scheduled Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Panel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInterviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-gray-500">
                            <div className="w-12 h-12 mx-auto mb-2 text-gray-300">
                              <Calendar className="w-full h-full" />
                            </div>
                            <p>
                              {searchTerm ? "No interviews found matching your search" : "No interviews scheduled yet"}
                            </p>
                            {!searchTerm && (
                              <Button 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => setShowInterviewModal(true)}
                              >
                                Schedule your first interview
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInterviews.map((interview) => (
                        <TableRow key={interview.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Interview Candidate</h4>
                                <p className="text-sm text-gray-600">Application ID: {interview.applicationId.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(interview.type)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{formatDateTime(interview.scheduledAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{interview.duration} min</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {interview.panelId ? interview.panelId.slice(0, 8) + "..." : "Not assigned"}
                          </TableCell>
                          <TableCell>{getStatusBadge(interview.status)}</TableCell>
                          <TableCell>
                            {interview.score ? (
                              <Badge className="bg-gray-100 text-gray-800">{interview.score}/100</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" title="Join Interview">
                                <VideoIcon className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="View Details">
                                <Calendar className="w-4 h-4" />
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

      <EnhancedInterviewModal open={showInterviewModal} onOpenChange={setShowInterviewModal} />
    </div>
  );
}
