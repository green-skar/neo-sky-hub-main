import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Ban, Shield, RotateCcw, Calendar, MapPin, Clock, User, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const blockedCards = [
  {
    id: 1,
    name: "Clara Hughes",
    uid: "USR-0858CV",
    type: "A Sponsor",
    status: "blocked",
    reason: "Fraudulent activity detected",
    date: "2025-10-18",
    email: "clara.hughes@email.com",
    phone: "+1 (555) 123-4567",
    lastActivity: "2025-10-17 14:30 UTC",
    location: "New York, NY",
    cardNumber: "****-****-****-1234",
    issueDate: "2025-01-15",
    expiryDate: "2026-01-15",
    fraudScore: 95,
    suspiciousTransactions: 3,
    blockchainHash: "0xa7f92e9F5b332aaA12d",
  },
  {
    id: 2,
    name: "Daniel Fisher",
    uid: "USR-030B5ZG",
    type: "A Sponsor",
    status: "lost",
    reason: "Reported as lost",
    date: "2025-10-15",
    email: "daniel.fisher@email.com",
    phone: "+1 (555) 234-5678",
    lastActivity: "2025-10-14 09:15 UTC",
    location: "Los Angeles, CA",
    cardNumber: "****-****-****-5678",
    issueDate: "2025-02-20",
    expiryDate: "2026-02-20",
    fraudScore: 15,
    suspiciousTransactions: 0,
    blockchainHash: "0xb8g03f0G6c443bbB23e",
  },
  {
    id: 3,
    name: "Sarah Smith",
    uid: "USR-0320KR",
    type: "User",
    status: "pending",
    reason: "Pending reactivation",
    date: "2025-10-10",
    email: "sarah.smith@email.com",
    phone: "+1 (555) 345-6789",
    lastActivity: "2025-10-09 16:45 UTC",
    location: "Chicago, IL",
    cardNumber: "****-****-****-9012",
    issueDate: "2025-03-10",
    expiryDate: "2026-03-10",
    fraudScore: 25,
    suspiciousTransactions: 1,
    blockchainHash: "0xc9h14g1H7d554ccC34f",
  },
];

const Blocked = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportForm, setReportForm] = useState({
    cardNumber: '',
    reason: '',
    location: '',
    additionalInfo: ''
  });
  const { toast } = useToast();

  const handleViewDetails = (card) => {
    setSelectedCard(card);
    setShowCardDetails(true);
  };

  const handleReportLostCard = () => {
    setShowReportDialog(true);
  };

  const handleSubmitReport = () => {
    if (!reportForm.cardNumber || !reportForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in the card number and reason for reporting.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Card Reported Successfully",
        description: "Your lost card has been reported and blocked. A replacement will be issued within 3-5 business days.",
        variant: "default",
      });
      
      setShowReportDialog(false);
      setReportForm({
        cardNumber: '',
        reason: '',
        location: '',
        additionalInfo: ''
      });
    }, 1000);
  };

  const handleReactivate = (card) => {
    toast({
      title: "Card Reactivation Initiated",
      description: `Reactivation process started for ${card.name}'s card. You will receive confirmation within 24 hours.`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neon-red neon-text-intense">Lost / Blocked Card Manager</h1>
        <p className="text-muted-foreground">
          Manage NeoCards lost by users and flagged by AI for fraudulent activity
        </p>
      </div>

      {/* AI Alert */}
      <Card className="border-destructive/20 bg-destructive/5 p-4 card-glow">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5 neon-text-red" />
          <div>
            <p className="font-semibold text-destructive mb-1 neon-text-red">AI ALERT</p>
            <p className="text-sm neon-text">
              Fraudulent UID Detected - blocChain hash: 057d73ab015d4c33856abcab4e007cfaf6ef79...
            </p>
            <Button variant="link" className="text-destructive h-auto p-0 mt-2 neon-text-red" size="sm">
              VIEW ALERT
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">ACTIVE</p>
          <p className="text-2xl font-bold neon-text-intense">317</p>
          <p className="text-xs text-muted-foreground mt-1 neon-text">NeoCards</p>
        </Card>
        <Card className="p-4 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">REACTIVATED</p>
          <p className="text-2xl font-bold text-primary neon-text-intense">24</p>
          <p className="text-xs text-muted-foreground mt-1 neon-text">NeoCards this month</p>
        </Card>
        <Card className="p-4 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">LOST</p>
          <p className="text-2xl font-bold text-muted-foreground neon-text-intense">82</p>
          <p className="text-xs text-muted-foreground mt-1 neon-text">NeoCards</p>
        </Card>
        <Card className="p-4 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">PENDING</p>
          <p className="text-2xl font-bold text-muted-foreground neon-text-intense">6</p>
          <p className="text-xs text-muted-foreground mt-1 neon-text">NeoCards</p>
        </Card>
      </div>

      {/* Blocked/Lost Cards Table */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-6">Card Status Management</h3>
        <div className="space-y-3">
          {blockedCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  card.status === "blocked"
                    ? "bg-destructive/20"
                    : card.status === "lost"
                    ? "bg-muted"
                    : "bg-primary/20"
                }`}
              >
                {card.status === "blocked" ? (
                  <Ban className="w-6 h-6 text-destructive" />
                ) : card.status === "lost" ? (
                  <AlertTriangle className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <RotateCcw className="w-6 h-6 text-primary" />
                )}
              </div>

              <div className="flex-1 grid md:grid-cols-4 gap-4">
                <div>
                  <p className="font-semibold mb-1">{card.name}</p>
                  <Badge
                    className={
                      card.status === "blocked"
                        ? "bg-destructive/20 text-destructive border-destructive/30"
                        : card.status === "lost"
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/20 text-primary border-primary/30"
                    }
                  >
                    {card.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">UID</p>
                  <p className="text-sm font-mono">{card.uid}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">CARD TYPE</p>
                  <p className="text-sm">{card.type}</p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  {card.status === "lost" && (
                    <Button 
                      size="sm" 
                      className="bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleReactivate(card)}
                    >
                      Reactivate
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-primary/30" 
                    onClick={() => handleViewDetails(card)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Report Lost Card */}
      <Card className="p-6 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Report Lost or Stolen Card</h4>
            <p className="text-sm text-muted-foreground mb-4">
              If your NeoCard is lost or stolen, report it immediately to prevent unauthorized use. 
              You can request a replacement card after reporting.
            </p>
            <Button 
              className="bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleReportLostCard}
            >
              <Ban className="w-4 h-4 mr-2" />
              Report Lost Card
            </Button>
          </div>
        </div>
      </Card>

      {/* AEI Sentinel Info */}
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">AEI SENTINEL</h4>
            <p className="text-sm text-muted-foreground">Powered by AI</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Fraud alerts</p>
            <p className="text-2xl font-bold text-primary">0</p>
          </div>
        </div>
      </Card>

      {/* Card Details Modal */}
      <Dialog open={showCardDetails} onOpenChange={setShowCardDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Card Details - {selectedCard?.name}</DialogTitle>
            <DialogDescription>
              Complete information about the selected NeoCard
            </DialogDescription>
          </DialogHeader>
          
          {selectedCard && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    selectedCard.status === "blocked"
                      ? "bg-destructive/20 text-destructive border-destructive/30"
                      : selectedCard.status === "lost"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/20 text-primary border-primary/30"
                  }
                >
                  {selectedCard.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Reported: {selectedCard.date}
                </span>
              </div>

              {/* Card Information Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{selectedCard.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="text-sm">{selectedCard.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p className="text-sm">{selectedCard.phone}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Location</Label>
                      <p className="text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedCard.location}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Card Details */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Card Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Card Number</Label>
                      <p className="font-mono text-sm">{selectedCard.cardNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">UID</Label>
                      <p className="font-mono text-sm">{selectedCard.uid}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Card Type</Label>
                      <p className="text-sm">{selectedCard.type}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Issue Date</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {selectedCard.issueDate}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {selectedCard.expiryDate}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Activity Information */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Activity Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Last Activity</Label>
                      <p className="text-sm">{selectedCard.lastActivity}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Reason</Label>
                      <p className="text-sm">{selectedCard.reason}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Suspicious Transactions</Label>
                      <p className="text-sm">{selectedCard.suspiciousTransactions}</p>
                    </div>
                  </div>
                </Card>

                {/* Security Information */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Fraud Score</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedCard.fraudScore > 70 ? 'bg-destructive' : 
                              selectedCard.fraudScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${selectedCard.fraudScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{selectedCard.fraudScore}%</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Blockchain Hash</Label>
                      <p className="font-mono text-xs break-all">{selectedCard.blockchainHash}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Lost Card Modal */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Lost or Stolen Card</DialogTitle>
            <DialogDescription>
              Please provide the following information to report your lost or stolen NeoCard
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="Enter your card number"
                value={reportForm.cardNumber}
                onChange={(e) => setReportForm(prev => ({ ...prev, cardNumber: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="reason">Reason for Reporting</Label>
              <select
                id="reason"
                className="w-full p-2 border border-border rounded-md bg-background"
                value={reportForm.reason}
                onChange={(e) => setReportForm(prev => ({ ...prev, reason: e.target.value }))}
              >
                <option value="">Select a reason</option>
                <option value="lost">Lost Card</option>
                <option value="stolen">Stolen Card</option>
                <option value="damaged">Damaged Card</option>
                <option value="suspicious">Suspicious Activity</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="location">Last Known Location</Label>
              <Input
                id="location"
                placeholder="Where did you last use the card?"
                value={reportForm.location}
                onChange={(e) => setReportForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any additional details that might help..."
                value={reportForm.additionalInfo}
                onChange={(e) => setReportForm(prev => ({ ...prev, additionalInfo: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleSubmitReport}
            >
              Report Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blocked;
