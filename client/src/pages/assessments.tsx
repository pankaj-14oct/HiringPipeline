import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, FileText, Clock, Target, Users } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import AssessmentModal from "@/components/modals/assessment-modal";
import EnhancedAssessmentModal from "@/components/modals/enhanced-assessment-modal-new";
import AssessmentViewModal from "@/components/modals/assessment-view-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Assessment } from "@shared/schema";

export default function Assessments() {
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [useEnhancedModal, setUseEnhancedModal] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assessments = [], isLoading } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
  });

  const deleteAssessmentMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      await apiRequest("DELETE", `/api/assessments/${assessmentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      toast({
        title: "Success",
        description: "Assessment deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete assessment",
        variant: "destructive",
      });
    },
  });

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "coding":
        return <Badge className="bg-purple-100 text-purple-800">Coding</Badge>;
      case "mcq":
        return <Badge className="bg-blue-100 text-blue-800">MCQ</Badge>;
      case "assignment":
        return <Badge className="bg-green-100 text-green-800">Assignment</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    if (confirm("Are you sure you want to delete this assessment?")) {
      deleteAssessmentMutation.mutate(assessmentId);
    }
  };

  const handleViewAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowViewModal(true);
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowAssessmentModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Assessments" 
          description="Create and manage technical assessments for candidates"
          onAction={() => setShowAssessmentModal(true)}
          actionLabel="Create Assessment"
        />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search assessments..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setUseEnhancedModal(!useEnhancedModal)}
                >
                  {useEnhancedModal ? 'Use Basic' : 'Use Enhanced'}
                </Button>
                <Button onClick={() => setShowAssessmentModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assessment
                </Button>
              </div>
            </div>
            
            {/* Assessments Table */}
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
                      <TableHead>Assessment</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Time Limit</TableHead>
                      <TableHead>Passing Score</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-gray-500">
                            <div className="w-12 h-12 mx-auto mb-2 text-gray-300">
                              <FileText className="w-full h-full" />
                            </div>
                            <p>
                              {searchTerm ? "No assessments found matching your search" : "No assessments created yet"}
                            </p>
                            {!searchTerm && (
                              <Button 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => setShowAssessmentModal(true)}
                              >
                                Create your first assessment
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssessments.map((assessment) => (
                        <TableRow key={assessment.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                              <p className="text-sm text-gray-600">{assessment.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(assessment.type)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{assessment.timeLimit} min</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{assessment.passingScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {Array.isArray(assessment.questions) ? assessment.questions.length : 0} questions
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">0 submissions</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{assessment.createdAt ? formatDate(assessment.createdAt) : "Unknown"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="Edit"
                                onClick={() => handleEditAssessment(assessment)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="View"
                                onClick={() => handleViewAssessment(assessment)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="Delete"
                                onClick={() => handleDeleteAssessment(assessment.id)}
                                disabled={deleteAssessmentMutation.isPending}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      {useEnhancedModal ? (
        <EnhancedAssessmentModal 
          isOpen={showAssessmentModal} 
          onClose={() => {
            setShowAssessmentModal(false);
            setSelectedAssessment(null);
          }}
          assessment={selectedAssessment || undefined}
        />
      ) : (
        <AssessmentModal open={showAssessmentModal} onOpenChange={setShowAssessmentModal} />
      )}
      
      <AssessmentViewModal 
        open={showViewModal} 
        onOpenChange={setShowViewModal}
        assessment={selectedAssessment}
      />
    </div>
  );
}
