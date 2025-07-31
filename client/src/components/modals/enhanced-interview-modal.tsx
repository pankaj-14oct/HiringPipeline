import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Users, MapPin, Video, Phone, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertInterviewSchema } from "@shared/schema";
import type { InsertInterview, InterviewPanel, Application, Candidate, Job } from "@shared/schema";

interface EnhancedInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId?: string;
}

export default function EnhancedInterviewModal({ open, onOpenChange, applicationId }: EnhancedInterviewModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all necessary data
  const { data: panels = [] } = useQuery<InterviewPanel[]>({
    queryKey: ["/api/interview-panels"],
    enabled: open,
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: open,
  });

  const { data: candidates = [] } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
    enabled: open,
  });

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    enabled: open,
  });

  const form = useForm<InsertInterview>({
    resolver: zodResolver(insertInterviewSchema),
    defaultValues: {
      applicationId: applicationId || "",
      panelId: "",
      scheduledAt: new Date(),
      duration: 60,
      type: "technical",
      status: "scheduled",
      feedback: "",
      score: undefined,
      interviewerNotes: {},
    },
  });

  const selectedApplication = applications.find(app => app.id === form.watch("applicationId"));
  const selectedCandidate = candidates.find(c => c.id === selectedApplication?.candidateId);
  const selectedJob = jobs.find(j => j.id === selectedApplication?.jobId);
  const selectedPanel = panels.find(p => p.id === form.watch("panelId"));

  const createInterviewMutation = useMutation({
    mutationFn: async (data: InsertInterview) => {
      const response = await apiRequest("POST", "/api/interviews", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Interview scheduled successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInterview) => {
    createInterviewMutation.mutate(data);
  };

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Interview
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Candidate & Job Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="applicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Application</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose candidate application" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {applications.map((application) => {
                          const candidate = candidates.find(c => c.id === application.candidateId);
                          const job = jobs.find(j => j.id === application.jobId);
                          return (
                            <SelectItem key={application.id} value={application.id}>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{candidate?.name || 'Unknown'} - {job?.title || 'Unknown Position'}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="panelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Panel</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interview panel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {panels.map((panel) => (
                          <SelectItem key={panel.id} value={panel.id}>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{panel.name}</span>
                              {panel.interviewers && Array.isArray(panel.interviewers) && (
                                <Badge variant="outline" className="ml-2">
                                  {panel.interviewers.length} interviewers
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Selected Application Details */}
            {selectedApplication && selectedCandidate && selectedJob && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Interview Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span><strong>Candidate:</strong> {selectedCandidate.name}</span>
                    <Badge variant="outline">{selectedCandidate.email}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span><strong>Position:</strong> {selectedJob.title} - {selectedJob.department}</span>
                  </div>
                  {selectedPanel && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span><strong>Panel:</strong> {selectedPanel.name}</span>
                      {selectedPanel.interviewers && Array.isArray(selectedPanel.interviewers) && (
                        <span className="text-gray-600">({selectedPanel.interviewers.length} interviewers)</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Interview Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="screening">Screening Call</SelectItem>
                        <SelectItem value="technical">Technical Interview</SelectItem>
                        <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                        <SelectItem value="hr">HR Interview</SelectItem>
                        <SelectItem value="final">Final Round</SelectItem>
                        <SelectItem value="culture">Culture Fit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Date & Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={formatDateTime(new Date(field.value))}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      min={formatDateTime(new Date())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any initial notes or instructions for the interview panel..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createInterviewMutation.isPending || !form.watch("applicationId") || !form.watch("panelId")}
              >
                {createInterviewMutation.isPending ? "Scheduling..." : "Schedule Interview"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}