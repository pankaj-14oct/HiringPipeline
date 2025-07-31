import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, FileText, Download, Send, Eye } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import OfferModal from "@/components/modals/offer-modal";
import OfferViewModal from "@/components/modals/offer-view-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { OfferLetter } from "@shared/schema";

export default function Offers() {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferLetter | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: offers = [], isLoading } = useQuery<OfferLetter[]>({
    queryKey: ["/api/offer-letters"],
  });

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.salary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
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

  const handleViewOffer = (offer: OfferLetter) => {
    setSelectedOffer(offer);
    setShowViewModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Offer Letters" 
          description="Generate and manage offer letters for selected candidates"
          onAction={() => setShowOfferModal(true)}
          actionLabel="Generate Offer"
        />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search offers..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowOfferModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Generate Offer
              </Button>
            </div>
            
            {/* Offers Table */}
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
                      <TableHead>Position</TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Response Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOffers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-gray-500">
                            <div className="w-12 h-12 mx-auto mb-2 text-gray-300">
                              <FileText className="w-full h-full" />
                            </div>
                            <p>
                              {searchTerm ? "No offers found matching your search" : "No offer letters generated yet"}
                            </p>
                            {!searchTerm && (
                              <Button 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => setShowOfferModal(true)}
                              >
                                Generate your first offer
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOffers.map((offer) => (
                        <TableRow key={offer.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <h4 className="font-medium text-gray-900">{offer.title}</h4>
                              <p className="text-sm text-gray-600">Application ID: {offer.applicationId.slice(0, 8)}...</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">C</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Candidate Name</h4>
                                <p className="text-sm text-gray-600">candidate@email.com</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-gray-900">{offer.salary}</span>
                          </TableCell>
                          <TableCell className="text-gray-700">{formatDate(offer.startDate)}</TableCell>
                          <TableCell>{getStatusBadge(offer.status)}</TableCell>
                          <TableCell className="text-gray-600">{formatDate(offer.sentAt)}</TableCell>
                          <TableCell className="text-gray-600">{formatDate(offer.respondedAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="View Offer"
                                onClick={() => handleViewOffer(offer)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Download PDF">
                                <Download className="w-4 h-4" />
                              </Button>
                              {offer.status === "draft" && (
                                <Button variant="ghost" size="sm" title="Send Offer">
                                  <Send className="w-4 h-4" />
                                </Button>
                              )}
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

      <OfferModal open={showOfferModal} onOpenChange={setShowOfferModal} />
      <OfferViewModal 
        open={showViewModal} 
        onOpenChange={setShowViewModal}
        offer={selectedOffer}
      />
    </div>
  );
}
