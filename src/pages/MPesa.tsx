import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wallet, TrendingUp, CheckCircle2, Clock, Download, PlayCircle, Loader2, Eye, Calendar, Shield, Upload, Camera, FileVideo } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const earningsData = [
  { week: "W1", amount: 45 },
  { week: "W2", amount: 52 },
  { week: "W3", amount: 48 },
  { week: "W4", amount: 60 },
  { week: "W5", amount: 55 },
  { week: "W6", amount: 68 },
];

// Initial transactions data
const initialTransactions = [
  {
    id: 1,
    date: "2025-10-20",
    amount: "KES 60",
    status: "completed",
    verified: true,
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    processingVideo: false,
    videoProofDetails: {
      submittedAt: "2025-10-20T14:30:00Z",
      verifiedAt: "2025-10-20T14:33:00Z",
      aiConfidence: 98.5,
      verificationMethod: "AI Video Analysis",
      duration: "2m 15s"
    }
  },
  {
    id: 2,
    date: "2025-10-13",
    amount: "KES 55",
    status: "completed",
    verified: true,
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    processingVideo: false,
    videoProofDetails: {
      submittedAt: "2025-10-13T09:15:00Z",
      verifiedAt: "2025-10-13T09:18:00Z",
      aiConfidence: 96.2,
      verificationMethod: "AI Video Analysis",
      duration: "1m 45s"
    }
  },
  {
    id: 3,
    date: "2025-10-06",
    amount: "KES 48",
    status: "pending",
    verified: false,
    videoUrl: null,
    processingVideo: false,
    videoProofDetails: null
  },
];

const MPesa = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showMpesaDialog, setShowMpesaDialog] = useState(false);
  const [showSepaDialog, setShowSepaDialog] = useState(false);
  const [showVideoProofDialog, setShowVideoProofDialog] = useState(false);
  const [selectedVideoProof, setSelectedVideoProof] = useState(null);
  const [showVideoSubmissionDialog, setShowVideoSubmissionDialog] = useState(false);
  const [selectedTransactionForSubmission, setSelectedTransactionForSubmission] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [mpesaConfig, setMpesaConfig] = useState({
    phoneNumber: '',
    accountName: '',
    idNumber: ''
  });
  const [sepaConfig, setSepaConfig] = useState({
    bankName: '',
    accountNumber: '',
    iban: '',
    swiftCode: ''
  });
  const { toast } = useToast();

  // Export report functionality
  const handleExportReport = () => {
    const csvContent = [
      ['Date', 'Amount', 'Status', 'Verified'],
      ...transactions.map(t => [t.date, t.amount, t.status, t.verified ? 'Yes' : 'No'])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mpesa-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Report Exported",
      description: "Payout report has been downloaded successfully!",
      variant: "default",
    });
  };

  // Video proof processing functionality
  const handleVideoProof = async (transactionId: number) => {
    setTransactions(prev => prev.map(t => 
      t.id === transactionId 
        ? { ...t, processingVideo: true, status: 'processing' }
        : t
    ));

    toast({
      title: "Processing Video Proof",
      description: "AI is analyzing your video proof. This may take a few moments...",
      variant: "default",
    });

    // Simulate AI processing delay
    setTimeout(() => {
      setTransactions(prev => prev.map(t => 
        t.id === transactionId 
          ? { 
              ...t, 
              processingVideo: false, 
              status: 'completed', 
              verified: true,
              videoUrl: '#'
            }
          : t
      ));

      toast({
        title: "Video Proof Verified!",
        description: "Your payout has been successfully verified and completed.",
        variant: "default",
      });
    }, 3000);
  };

  // Configure M-Pesa functionality
  const handleConfigureMpesa = () => {
    if (!mpesaConfig.phoneNumber || !mpesaConfig.accountName || !mpesaConfig.idNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for M-Pesa configuration.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "M-Pesa Configured",
      description: `M-Pesa account configured for ${mpesaConfig.phoneNumber}`,
      variant: "default",
    });
    
    setShowMpesaDialog(false);
    setMpesaConfig({ phoneNumber: '', accountName: '', idNumber: '' });
  };

  // Configure SEPA functionality
  const handleConfigureSepa = () => {
    if (!sepaConfig.bankName || !sepaConfig.accountNumber || !sepaConfig.iban) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for SEPA configuration.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "SEPA Configured",
      description: `SEPA account configured for ${sepaConfig.bankName}`,
      variant: "default",
    });
    
    setShowSepaDialog(false);
    setSepaConfig({ bankName: '', accountNumber: '', iban: '', swiftCode: '' });
  };

  // View video proof functionality
  const handleViewVideoProof = (transaction) => {
    setSelectedVideoProof(transaction);
    setShowVideoProofDialog(true);
  };

  // Submit video proof functionality
  const handleSubmitVideoProof = (transaction) => {
    setSelectedTransactionForSubmission(transaction);
    setShowVideoSubmissionDialog(true);
  };

  // Handle file upload simulation
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a video file (MP4, MOV, AVI, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a video file smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate AI processing after upload
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(100);

      // Update transaction with video proof
      const videoUrl = URL.createObjectURL(file);
      const now = new Date().toISOString();
      
      setTransactions(prev => prev.map(t => 
        t.id === selectedTransactionForSubmission.id 
          ? { 
              ...t, 
              status: 'processing',
              videoUrl: videoUrl,
              videoProofDetails: {
                submittedAt: now,
                verifiedAt: null,
                aiConfidence: null,
                verificationMethod: "AI Video Analysis",
                duration: "Processing...",
                fileName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB"
              }
            }
          : t
      ));

      toast({
        title: "Video Uploaded Successfully",
        description: "Your video proof has been uploaded and is being processed by AI.",
        variant: "default",
      });

      setShowVideoSubmissionDialog(false);
      setSelectedTransactionForSubmission(null);

      // Simulate AI verification process
      setTimeout(() => {
        const verificationTime = new Date().toISOString();
        const aiConfidence = 85 + Math.random() * 15; // 85-100% confidence
        
        setTransactions(prev => prev.map(t => 
          t.id === selectedTransactionForSubmission.id 
            ? { 
                ...t, 
                status: 'completed',
                verified: true,
                videoProofDetails: {
                  ...t.videoProofDetails,
                  verifiedAt: verificationTime,
                  aiConfidence: Math.round(aiConfidence * 10) / 10,
                  duration: "2m 15s"
                }
              }
            : t
        ));

        toast({
          title: "Video Proof Verified!",
          description: `Your payout has been verified with ${Math.round(aiConfidence * 10) / 10}% confidence.`,
          variant: "default",
        });
      }, 3000);

    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">M-Pesa & Payouts</h1>
        <p className="text-muted-foreground">Track your earnings and payment history</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-3xl font-bold text-accent">KES 60</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">THIS WEEK</p>
          <p className="text-2xl font-bold text-primary">KES 68</p>
        </Card>

        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">PENDING PAYOUTS</p>
          <p className="text-2xl font-bold">1</p>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Weekly Earnings</h3>
          <Button variant="outline" className="border-primary/30" size="sm" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="week" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="hsl(var(--accent))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--accent))', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Transaction History */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-6">Payout History</h3>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                transaction.status === "completed" 
                  ? "bg-primary/20" 
                  : transaction.status === "processing"
                  ? "bg-accent/20"
                  : "bg-muted"
              }`}>
                {transaction.status === "completed" ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : transaction.status === "processing" ? (
                  <Loader2 className="w-6 h-6 text-accent animate-spin" />
                ) : (
                  <Clock className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">{transaction.amount}</p>
                  <Badge
                    className={
                      transaction.status === "completed"
                        ? "bg-primary/20 text-primary border-primary/30"
                        : transaction.status === "processing"
                        ? "bg-accent/20 text-accent border-accent/30"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>

              <div className="flex items-center gap-2">
                {transaction.verified && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    AI Verified
                  </Badge>
                )}
                {transaction.status === "pending" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-primary/30"
                    onClick={() => handleSubmitVideoProof(transaction)}
                    disabled={transaction.processingVideo}
                  >
                    {transaction.processingVideo ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {transaction.processingVideo ? "Processing..." : "Submit Video Proof"}
                  </Button>
                )}
                {transaction.videoUrl && transaction.status === "completed" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-primary/30"
                    onClick={() => handleViewVideoProof(transaction)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Video Proof
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Methods */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl font-bold text-accent">M-PESA</div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Mobile money transfer service
          </p>
          <Dialog open={showMpesaDialog} onOpenChange={setShowMpesaDialog}>
            <DialogTrigger asChild>
              <Button className="w-full bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground">
                Configure M-Pesa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configure M-Pesa Account</DialogTitle>
                <DialogDescription>
                  Enter your M-Pesa account details to enable mobile money transfers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+254 700 000 000"
                    value={mpesaConfig.phoneNumber}
                    onChange={(e) => setMpesaConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="John Doe"
                    value={mpesaConfig.accountName}
                    onChange={(e) => setMpesaConfig(prev => ({ ...prev, accountName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    placeholder="12345678"
                    value={mpesaConfig.idNumber}
                    onChange={(e) => setMpesaConfig(prev => ({ ...prev, idNumber: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleConfigureMpesa} className="flex-1">
                    Save Configuration
                  </Button>
                  <Button variant="outline" onClick={() => setShowMpesaDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-6 border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl font-bold text-primary">S-SEPA</div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            European bank transfer
          </p>
          <Dialog open={showSepaDialog} onOpenChange={setShowSepaDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-primary/30">
                Configure SEPA
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configure SEPA Account</DialogTitle>
                <DialogDescription>
                  Enter your European bank account details for SEPA transfers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Deutsche Bank"
                    value={sepaConfig.bankName}
                    onChange={(e) => setSepaConfig(prev => ({ ...prev, bankName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="1234567890"
                    value={sepaConfig.accountNumber}
                    onChange={(e) => setSepaConfig(prev => ({ ...prev, accountNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    placeholder="DE89 3704 0044 0532 0130 00"
                    value={sepaConfig.iban}
                    onChange={(e) => setSepaConfig(prev => ({ ...prev, iban: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="swiftCode">SWIFT Code (Optional)</Label>
                  <Input
                    id="swiftCode"
                    placeholder="DEUTDEFF"
                    value={sepaConfig.swiftCode}
                    onChange={(e) => setSepaConfig(prev => ({ ...prev, swiftCode: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleConfigureSepa} className="flex-1">
                    Save Configuration
                  </Button>
                  <Button variant="outline" onClick={() => setShowSepaDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      </div>

      {/* AI Verification Info */}
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI-Powered Verification</h4>
            <p className="text-sm text-muted-foreground mb-3">
              All payouts are automatically verified by AI to ensure security and accuracy. 
              Video verification is required for transactions above KES 100.
            </p>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              100% Verified
            </Badge>
          </div>
        </div>
      </Card>

      {/* Video Proof Dialog */}
      <Dialog open={showVideoProofDialog} onOpenChange={setShowVideoProofDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Video Proof Verification</DialogTitle>
            <DialogDescription>
              Review the submitted video proof and AI verification details
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {selectedVideoProof && (
              <>
                {/* Transaction Info */}
                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedVideoProof.amount}</p>
                    <p className="text-sm text-muted-foreground">{selectedVideoProof.date}</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    AI Verified
                  </Badge>
                </div>

                {/* Video Player */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Submitted Video Proof</h4>
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video 
                      controls 
                      className="w-full h-48 sm:h-64 md:h-80"
                      poster="/api/placeholder/800/400"
                    >
                      <source src={selectedVideoProof.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* Verification Details */}
                {selectedVideoProof.videoProofDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Timeline
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Submitted:</span>
                          <span className="text-right">{new Date(selectedVideoProof.videoProofDetails.submittedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Verified:</span>
                          <span className="text-right">{new Date(selectedVideoProof.videoProofDetails.verifiedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span>{selectedVideoProof.videoProofDetails.duration}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        AI Analysis
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Confidence:</span>
                          <Badge className="bg-green-500/20 text-green-500">
                            {selectedVideoProof.videoProofDetails.aiConfidence}%
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Method:</span>
                          <span className="text-right">{selectedVideoProof.videoProofDetails.verificationMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className="bg-primary/20 text-primary">
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex-shrink-0 flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowVideoProofDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              // In a real app, this would download the video file
              toast({
                title: "Download Started",
                description: "Video proof is being downloaded...",
                variant: "default",
              });
            }}>
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Submission Dialog */}
      <Dialog open={showVideoSubmissionDialog} onOpenChange={setShowVideoSubmissionDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Submit Video Proof</DialogTitle>
            <DialogDescription>
              Upload a video to verify your payout transaction
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {selectedTransactionForSubmission && (
              <>
                {/* Transaction Info */}
                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedTransactionForSubmission.amount}</p>
                    <p className="text-sm text-muted-foreground">{selectedTransactionForSubmission.date}</p>
                  </div>
                  <Badge className="bg-muted text-muted-foreground">
                    Pending Verification
                  </Badge>
                </div>

                {/* Upload Instructions */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Video Requirements
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Record yourself clearly stating the transaction details</p>
                    <p>• Show your face and any relevant documents</p>
                    <p>• Keep video under 5 minutes</p>
                    <p>• Supported formats: MP4, MOV, AVI (max 100MB)</p>
                  </div>
                </Card>

                {/* Upload Area */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Upload Video Proof</h4>
                  
                  {!isUploading ? (
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <FileVideo className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                      <p className="text-lg font-medium mb-2">Choose Video File</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Click to browse or drag and drop your video file
                      </p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <Button asChild>
                        <label htmlFor="video-upload" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Select Video File
                        </label>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                        <p className="font-medium">Uploading and Processing Video...</p>
                        <p className="text-sm text-muted-foreground">
                          AI is analyzing your video proof
                        </p>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-center text-sm text-muted-foreground">
                        {Math.round(uploadProgress)}% complete
                      </p>
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <Card className="p-4 border-primary/20 bg-primary/5">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-primary mb-1">Security Notice</h5>
                      <p className="text-sm text-muted-foreground">
                        Your video will be encrypted and processed by AI for verification. 
                        It will be securely stored and only used for this transaction verification.
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowVideoSubmissionDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MPesa;
