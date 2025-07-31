import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Users, Edit, Eye, Trash2 } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertInterviewPanelSchema } from "@shared/schema";
import type { InterviewPanel, InsertInterviewPanel } from "@shared/schema";

export default function Panels() {
  const [showPanelModal, setShowPanelModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: panels = [], isLoading } = useQuery<InterviewPanel[]>({
    queryKey: ["/api/interview-panels"],
  });

  const form = useForm<InsertInterviewPanel>({
    resolver: zodResolver(insertInterviewPanelSchema),
    defaultValues: {
      name: "",
      description: "",
      interviewers: [],
      jobId: "",
    },
  });

  const createPanelMutation = useMutation({
    mutationFn: async (data: InsertInterviewPanel) => {
      const response = await apiRequest("POST", "/api/interview-panels", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interview-panels"] });
      toast({
        title: "Success",
        description: "Interview panel created successfully",
      });
      form.reset();
      setShowPanelModal(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create interview panel",
        variant: "destructive",
      });
    },
  });

  const deletePanelMutation = useMutation({
    mutationFn: async (panelId: string) => {
      await apiRequest("DELETE", `/api/interview-panels/${panelId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interview-panels"] });
      toast({
        title: "Success",
        description: "Interview panel deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete interview panel",
        variant: "destructive",
      });
    },
  });

  const filteredPanels = panels.filter(panel =>
    panel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (panel.description && panel.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleDeletePanel = (panelId: string) => {
    if (confirm("Are you sure you want to delete this interview panel?")) {
      deletePanelMutation.mutate(panelId);
    }
  };

  const onSubmit = (data: InsertInterviewPanel) => {
    createPanelMutation.mutate(data);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Interview Panels" 
          description="Manage interview panels and assign interviewers"
          onAction={() => setShowPanelModal(true)}
          actionLabel="Create Panel"
        />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search panels..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowPanelModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Panel
              </Button>
            </div>
            
            {/* Panels Table */}
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
                      <TableHead>Panel Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Interviewers</TableHead>
                      <TableHead>Job Assignment</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPanels.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-gray-500">
                            <div className="w-12 h-12 mx-auto mb-2 text-gray-300">
                              <Users className="w-full h-full" />
                            </div>
                            <p>
                              {searchTerm ? "No panels found matching your search" : "No interview panels created yet"}
                            </p>
                            {!searchTerm && (
                              <Button 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => setShowPanelModal(true)}
                              >
                                Create your first panel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPanels.map((panel) => (
                        <TableRow key={panel.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <h4 className="font-medium text-gray-900">{panel.name}</h4>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {panel.description || "No description"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {Array.isArray(panel.interviewers) ? panel.interviewers.length : 0} interviewers
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {panel.jobId ? (
                              <Badge className="bg-blue-100 text-blue-800">
                                Job: {panel.jobId.slice(0, 8)}...
                              </Badge>
                            ) : (
                              <span className="text-gray-400">Not assigned</span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-600">{formatDate(panel.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" title="Edit">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="View">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="Delete"
                                onClick={() => handleDeletePanel(panel.id)}
                                disabled={deletePanelMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
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

      {/* Create Panel Modal */}
      <Dialog open={showPanelModal} onOpenChange={setShowPanelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Interview Panel</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Panel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Technical Panel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3}
                        placeholder="Describe the panel's purpose..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowPanelModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createPanelMutation.isPending}
                >
                  {createPanelMutation.isPending ? "Creating..." : "Create Panel"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
