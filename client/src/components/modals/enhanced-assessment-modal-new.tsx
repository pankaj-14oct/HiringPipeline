import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Settings, BookOpen, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Assessment, QuestionBank } from "@shared/schema";

interface EnhancedAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment?: Assessment;
}

interface FormData {
  title: string;
  description: string;
  type: string;
  categories: string[];
  difficulty: string[];
  questionCount: number;
  timeLimit: number;
  passingScore: number;
  randomizeQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  showResults: boolean;
  preventCheating: boolean;
  jobId: string;
  createdBy: string;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  type: "auto",
  categories: [],
  difficulty: ["easy", "medium", "hard"],
  questionCount: 20,
  timeLimit: 60,
  passingScore: 70,
  randomizeQuestions: true,
  shuffleOptions: true,
  allowReview: true,
  showResults: true,
  preventCheating: true,
  jobId: "",
  createdBy: "user-1"
};

export default function EnhancedAssessmentModal({ isOpen, onClose, assessment }: EnhancedAssessmentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("config");
  const [formData, setFormData] = useState<FormData>(() => {
    if (assessment) {
      return {
        title: assessment.title,
        description: assessment.description || "",
        type: assessment.type as string,
        categories: Array.isArray(assessment.categories) ? assessment.categories : [],
        difficulty: Array.isArray(assessment.difficulty) ? assessment.difficulty : ["easy", "medium", "hard"],
        questionCount: assessment.questionCount || 20,
        timeLimit: assessment.timeLimit || 60,
        passingScore: assessment.passingScore || 70,
        randomizeQuestions: assessment.randomizeQuestions ?? true,
        shuffleOptions: assessment.shuffleOptions ?? true,
        allowReview: assessment.allowReview ?? true,
        showResults: assessment.showResults ?? true,
        preventCheating: assessment.preventCheating ?? true,
        jobId: assessment.jobId || "",
        createdBy: assessment.createdBy
      };
    }
    return initialFormData;
  });
  const [previewQuestions, setPreviewQuestions] = useState<QuestionBank[]>([]);

  // Fetch categories
  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["/api/question-bank/categories"],
    enabled: isOpen
  });

  // Generate preview questions
  const generatePreviewMutation = useMutation<QuestionBank[], Error, void>({
    mutationFn: async (): Promise<QuestionBank[]> => {
      const response = await apiRequest("POST", "/api/question-bank/generate-assessment", {
        categories: formData.categories,
        difficulty: formData.difficulty,
        count: Math.min(formData.questionCount, 5)
      });
      return response as unknown as QuestionBank[];
    },
    onSuccess: (data: QuestionBank[]) => {
      setPreviewQuestions(data);
    },
    onError: (error) => {
      console.error("Failed to generate preview:", error);
      toast({
        title: "Error",
        description: "Failed to generate question preview",
        variant: "destructive",
      });
    }
  });

  // Create/update assessment
  const createAssessmentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (assessment) {
        return await apiRequest("PUT", `/api/assessments/${assessment.id}`, data);
      } else {
        return await apiRequest("POST", "/api/assessments", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      toast({
        title: "Success",
        description: `Assessment ${assessment ? 'updated' : 'created'} successfully`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${assessment ? 'update' : 'create'} assessment`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    createAssessmentMutation.mutate(formData);
  }, [formData, createAssessmentMutation]);

  const handleCategoryToggle = useCallback((category: string) => {
    setFormData(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return {
        ...prev,
        categories: newCategories
      };
    });
  }, []);

  const handleDifficultyToggle = useCallback((difficulty: string) => {
    setFormData(prev => {
      const newDifficulty = prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...prev.difficulty, difficulty];
      
      return {
        ...prev,
        difficulty: newDifficulty
      };
    });
  }, []);

  const generatePreview = useCallback(() => {
    if (formData.categories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category",
        variant: "destructive",
      });
      return;
    }
    generatePreviewMutation.mutate();
  }, [formData.categories, generatePreviewMutation, toast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">
            {assessment ? 'Edit Assessment' : 'Create New Assessment'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
            <TabsList className="grid w-full grid-cols-3 mx-6 mt-4 flex-shrink-0">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="questions">Question Bank</TabsTrigger>
              <TabsTrigger value="preview">Preview & Settings</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {/* Configuration Tab */}
              <TabsContent value="config" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Assessment Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Frontend Developer Technical Assessment"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of what this assessment covers..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="questionCount">Number of Questions</Label>
                        <Input
                          id="questionCount"
                          type="number"
                          min="5" 
                          max="50"
                          value={formData.questionCount}
                          onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                        <Input
                          id="timeLimit"
                          type="number"
                          min="15" 
                          max="180"
                          value={formData.timeLimit}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="passingScore">Passing Score (%)</Label>
                      <Input
                        id="passingScore"
                        type="number"
                        min="0" 
                        max="100"
                        value={formData.passingScore}
                        onChange={(e) => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Question Bank Tab */}
              <TabsContent value="questions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Select Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <div
                          key={category}
                          onClick={() => handleCategoryToggle(category)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.categories.includes(category)
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-medium">{category}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Difficulty Levels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {["easy", "medium", "hard"].map((difficulty) => (
                        <div
                          key={difficulty}
                          onClick={() => handleDifficultyToggle(difficulty)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                            formData.difficulty.includes(difficulty)
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-medium capitalize">{difficulty}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preview & Settings Tab */}
              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Question Behavior</h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="randomize">Randomize Questions</Label>
                          <Switch
                            id="randomize"
                            checked={formData.randomizeQuestions}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, randomizeQuestions: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="shuffle">Shuffle Answer Options</Label>
                          <Switch
                            id="shuffle"
                            checked={formData.shuffleOptions}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shuffleOptions: checked }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Candidate Experience</h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="review">Allow Review</Label>
                          <Switch
                            id="review"
                            checked={formData.allowReview}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowReview: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="results">Show Instant Results</Label>
                          <Switch
                            id="results"
                            checked={formData.showResults}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showResults: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="fullscreen">Full-Screen Mode</Label>
                          <Switch
                            id="fullscreen"
                            checked={formData.preventCheating}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, preventCheating: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Question Preview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Question Preview</CardTitle>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={generatePreview}
                      disabled={generatePreviewMutation.isPending || formData.categories.length === 0}
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generate Preview
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {generatePreviewMutation.isPending ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Generating questions...</p>
                      </div>
                    ) : previewQuestions.length > 0 ? (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {previewQuestions.map((question, index) => (
                          <div key={question.id} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{question.category}</Badge>
                              <Badge 
                                variant={question.difficulty === 'hard' ? 'destructive' : 
                                       question.difficulty === 'medium' ? 'default' : 'secondary'}
                              >
                                {question.difficulty}
                              </Badge>
                              <span className="text-sm text-gray-500">Question {index + 1}</span>
                            </div>
                            <p className="font-medium">{question.question}</p>
                            {question.options && Array.isArray(question.options) && (
                              <ul className="mt-2 space-y-1">
                                {(question.options as string[]).map((option, idx) => (
                                  <li key={idx} className="text-sm text-gray-600">
                                    {String.fromCharCode(65 + idx)}. {option}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                        <p className="text-sm text-gray-500 text-center">
                          Preview shows {previewQuestions.length} of {formData.questionCount} questions
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Select categories and click "Generate Preview" to see sample questions</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          {/* Footer */}
          <div className="border-t p-6 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {formData.categories.length > 0 && (
                  <span>
                    Selected: {formData.categories.join(', ')} • 
                    {formData.questionCount} questions • 
                    {formData.timeLimit} minutes
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createAssessmentMutation.isPending || formData.categories.length === 0}
                >
                  {createAssessmentMutation.isPending ? 'Creating...' : 
                   assessment ? 'Update Assessment' : 'Create Assessment'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}