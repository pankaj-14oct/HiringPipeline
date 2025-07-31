import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, ArrowLeft, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Assessment, QuestionBank, AssessmentSubmission } from "@shared/schema";

interface CandidateAssessmentInterfaceProps {
  assessmentId: string;
  candidateId: string;
  applicationId: string;
  onComplete: (submission: AssessmentSubmission) => void;
}

export default function CandidateAssessmentInterface({ 
  assessmentId, 
  candidateId, 
  applicationId, 
  onComplete 
}: CandidateAssessmentInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Fetch assessment details
  const { data: assessment, isLoading: assessmentLoading } = useQuery<Assessment>({
    queryKey: [`/api/assessments/${assessmentId}`],
    enabled: !!assessmentId
  });

  // Generate assessment questions
  const { data: questions = [], isLoading: questionsLoading } = useQuery<QuestionBank[]>({
    queryKey: [`/api/question-bank/generate-assessment`, assessmentId],
    queryFn: async () => {
      if (!assessment) return [];
      return await apiRequest("POST", "/api/question-bank/generate-assessment", {
        categories: assessment.categories,
        difficulty: assessment.difficulty,
        count: assessment.questionCount
      });
    },
    enabled: !!assessment && hasStarted
  });

  // Submit assessment
  const submitAssessmentMutation = useMutation({
    mutationFn: async (submissionData: any) => {
      return await apiRequest("POST", "/api/assessment-submissions", submissionData);
    },
    onSuccess: (submission) => {
      toast({
        title: "Assessment Submitted",
        description: "Your assessment has been submitted successfully!",
      });
      onComplete(submission);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Timer management
  useEffect(() => {
    if (hasStarted && assessment && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [hasStarted, assessment, timeRemaining]);

  // Initialize timer when assessment loads
  useEffect(() => {
    if (assessment && hasStarted) {
      setTimeRemaining(assessment.timeLimit * 60); // Convert minutes to seconds
    }
  }, [assessment, hasStarted]);

  // Full-screen mode management
  useEffect(() => {
    if (assessment?.preventCheating && hasStarted) {
      enterFullScreen();
    }

    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted && assessment?.preventCheating) {
        toast({
          title: "Warning",
          description: "Tab switching detected. Please stay focused on the assessment.",
          variant: "destructive",
        });
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasStarted && !isSubmitting) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasStarted, assessment, isSubmitting]);

  const enterFullScreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } catch (error) {
      console.warn('Fullscreen not supported or denied');
    }
  };

  const exitFullScreen = async () => {
    try {
      await document.exitFullscreen();
      setIsFullScreen(false);
    } catch (error) {
      console.warn('Exit fullscreen failed');
    }
  };

  const startAssessment = () => {
    setHasStarted(true);
    if (assessment?.preventCheating) {
      enterFullScreen();
    }
  };

  const handleAutoSubmit = () => {
    if (!isSubmitting) {
      handleSubmitAssessment(true);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleQuestionFlag = (index: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const calculateScore = () => {
    if (!questions.length) return { score: 0, maxScore: 0, percentage: 0 };
    
    let score = 0;
    let maxScore = 0;

    questions.forEach(question => {
      maxScore += question.points || 1;
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;

      if (userAnswer !== undefined && userAnswer === correctAnswer) {
        score += question.points || 1;
      }
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    return { score, maxScore, percentage };
  };

  const calculateCategoryScores = () => {
    const categoryScores: Record<string, { correct: number; total: number }> = {};
    
    questions.forEach(question => {
      const category = question.category;
      if (!categoryScores[category]) {
        categoryScores[category] = { correct: 0, total: 0 };
      }
      
      categoryScores[category].total++;
      
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
        categoryScores[category].correct++;
      }
    });

    return Object.entries(categoryScores).reduce((acc, [category, scores]) => {
      acc[category] = Math.round((scores.correct / scores.total) * 100);
      return acc;
    }, {} as Record<string, number>);
  };

  const handleSubmitAssessment = (autoSubmit = false) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const { score, maxScore, percentage } = calculateScore();
    const categoryScores = calculateCategoryScores();
    const timeSpent = assessment ? (assessment.timeLimit * 60 - timeRemaining) / 60 : 0;

    const submissionData = {
      assessmentId,
      candidateId,
      applicationId,
      selectedQuestions: questions.map(q => q.id),
      answers,
      score,
      maxScore,
      percentage,
      categoryScores,
      timeSpent: Math.round(timeSpent),
      status: "submitted" as const,
      startedAt: new Date(),
      submittedAt: new Date()
    };

    submitAssessmentMutation.mutate(submissionData);
    
    if (isFullScreen) {
      exitFullScreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  if (assessmentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{assessment?.title}</CardTitle>
            <p className="text-gray-600 mt-2">{assessment?.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold">{assessment?.timeLimit} minutes</p>
                <p className="text-sm text-gray-600">Time limit</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold">{assessment?.questionCount} questions</p>
                <p className="text-sm text-gray-600">Total questions</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="font-semibold">{assessment?.passingScore}%</p>
                <p className="text-sm text-gray-600">Passing score</p>
              </div>
            </div>

            {assessment?.preventCheating && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This assessment will run in full-screen mode to prevent cheating. 
                  Please close other applications and ensure you won't be interrupted.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center">
              <Button size="lg" onClick={startAssessment} disabled={questionsLoading}>
                {questionsLoading ? 'Preparing Questions...' : 'Start Assessment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing your questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{assessment?.title}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-lg font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </div>
              <p className="text-xs text-gray-500">Time remaining</p>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold">{answeredCount}/{questions.length}</div>
              <p className="text-xs text-gray-500">Answered</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-3">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto mt-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{currentQuestion?.category}</Badge>
                <Badge 
                  variant={currentQuestion?.difficulty === 'hard' ? 'destructive' : 
                         currentQuestion?.difficulty === 'medium' ? 'default' : 'secondary'}
                >
                  {currentQuestion?.difficulty}
                </Badge>
                <span className="text-sm text-gray-500">
                  {currentQuestion?.points || 1} {(currentQuestion?.points || 1) === 1 ? 'point' : 'points'}
                </span>
              </div>
              <h2 className="text-lg font-medium leading-relaxed">
                {currentQuestion?.question}
              </h2>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuestionFlag(currentQuestionIndex)}
              className={flaggedQuestions.has(currentQuestionIndex) ? 'text-orange-600' : 'text-gray-400'}
            >
              <Flag className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            {currentQuestion?.type === 'mcq' && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
                className="space-y-3"
              >
                {(currentQuestion.options as string[]).map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {flaggedQuestions.size > 0 && (
              <Badge variant="secondary" className="px-3 py-1">
                <Flag className="w-3 h-3 mr-1" />
                {flaggedQuestions.size} flagged
              </Badge>
            )}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={() => handleSubmitAssessment()} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Grid Navigation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Question Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`
                    w-8 h-8 rounded text-sm font-medium transition-colors relative
                    ${index === currentQuestionIndex 
                      ? 'bg-blue-600 text-white' 
                      : answers[questions[index]?.id] 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {index + 1}
                  {flaggedQuestions.has(index) && (
                    <Flag className="w-2 h-2 absolute -top-1 -right-1 text-orange-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-1">
                <Flag className="w-3 h-3 text-orange-500" />
                <span>Flagged</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}