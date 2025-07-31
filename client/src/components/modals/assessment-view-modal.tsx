import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Target, FileText, User } from "lucide-react";
import type { Assessment } from "@shared/schema";

interface AssessmentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: Assessment | null;
}

export default function AssessmentViewModal({ open, onOpenChange, assessment }: AssessmentViewModalProps) {
  if (!assessment) return null;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "coding":
        return <Badge className="bg-purple-100 text-purple-800">Coding Challenge</Badge>;
      case "mcq":
        return <Badge className="bg-blue-100 text-blue-800">Multiple Choice</Badge>;
      case "assignment":
        return <Badge className="bg-green-100 text-green-800">Assignment</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>{assessment.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{assessment.timeLimit} minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Passing Score</p>
                  <p className="font-medium">{assessment.passingScore}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <div>{getTypeBadge(assessment.type)}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{assessment.description}</p>
            </div>

            {/* Questions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Questions</h3>
              {Array.isArray(assessment.questions) && assessment.questions.length > 0 ? (
                <div className="space-y-4">
                  {assessment.questions.map((question: any, index: number) => (
                    <div key={question.id || index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          Question {index + 1}
                        </h4>
                        {question.timeLimit && (
                          <Badge variant="outline" className="text-xs">
                            {question.timeLimit} min
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{question.question}</p>
                      {question.type && (
                        <Badge variant="secondary" className="text-xs">
                          {question.type}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No questions configured for this assessment</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium">Created</p>
                  <p>{formatDate(assessment.createdAt)}</p>
                </div>
                <div>
                  <p className="font-medium">Total Questions</p>
                  <p>{Array.isArray(assessment.questions) ? assessment.questions.length : 0}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}