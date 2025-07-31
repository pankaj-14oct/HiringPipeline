import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, FileText, Send, CheckCircle, XCircle } from "lucide-react";
import type { OfferLetter } from "@shared/schema";

interface OfferViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: OfferLetter | null;
}

export default function OfferViewModal({ open, onOpenChange, offer }: OfferViewModalProps) {
  if (!offer) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800"><FileText className="w-3 h-3 mr-1" />Draft</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800"><Send className="w-3 h-3 mr-1" />Sent</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "withdrawn":
        return <Badge className="bg-yellow-100 text-yellow-800">Withdrawn</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (salary: string) => {
    return salary.startsWith('$') ? salary : `$${salary}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-green-600" />
              <span>Offer Letter - {offer.title}</span>
            </div>
            {getStatusBadge(offer.status)}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-semibold text-green-700">{formatCurrency(offer.salary)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{formatDate(offer.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Template</p>
                  <p className="font-medium capitalize">{offer.template}</p>
                </div>
              </div>
            </div>

            {/* Offer Letter Preview */}
            <div className="border border-gray-200 rounded-lg">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Offer Letter</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Job Offer</h2>
                  <p className="text-gray-600">We are pleased to extend this offer of employment</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Position Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">Position:</span> {offer.title}</p>
                      <p><span className="font-medium">Salary:</span> {formatCurrency(offer.salary)}</p>
                      <p><span className="font-medium">Start Date:</span> {formatDate(offer.startDate)}</p>
                    </div>
                  </div>

                  {offer.customContent && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Additional Terms & Benefits</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{offer.customContent}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Standard Terms</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>• This offer is contingent upon successful completion of background checks and reference verification.</p>
                      <p>• Your employment will be at-will, meaning either party may terminate the employment relationship at any time.</p>
                      <p>• You will be eligible for our comprehensive benefits package including health insurance, retirement plans, and paid time off.</p>
                      <p>• Please confirm your acceptance of this offer by signing and returning this document.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(offer.createdAt)}</p>
                  </div>
                </div>
                
                {offer.sentAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Sent to Candidate</p>
                      <p className="text-sm text-gray-600">{formatDate(offer.sentAt)}</p>
                    </div>
                  </div>
                )}
                
                {offer.respondedAt && (
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${offer.status === 'accepted' ? 'bg-green-600' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium">
                        {offer.status === 'accepted' ? 'Accepted' : 'Responded'}
                      </p>
                      <p className="text-sm text-gray-600">{formatDate(offer.respondedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {offer.status === 'draft' && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Offer
                  </Button>
                  <Button variant="outline">
                    Edit Offer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}