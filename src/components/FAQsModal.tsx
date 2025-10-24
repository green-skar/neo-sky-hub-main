import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  HelpCircle,
  User,
  Smartphone,
  CreditCard,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  MapPin,
  Gift
} from "lucide-react";
import ContactSupportModal from "./ContactSupportModal";

interface FAQsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQsModal = ({ isOpen, onClose }: FAQsModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "Account & Profile",
      icon: <User className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-800",
      questions: [
        {
          question: "How do I update my profile information?",
          answer: "You can update your profile by going to Settings > Account Settings > Edit Profile. From there, you can modify your name, email, phone number, and bio."
        },
        {
          question: "How do I change my password?",
          answer: "To change your password, go to Settings > Account Settings > Change Password. You'll need to enter your current password and then create a new one."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account by going to Settings > Data Management > Delete Account. This action is permanent and cannot be undone."
        }
      ]
    },
    {
      category: "NeoCard Features",
      icon: <Smartphone className="w-4 h-4" />,
      color: "bg-green-100 text-green-800",
      questions: [
        {
          question: "How do I scan QR codes with my NeoCard?",
          answer: "Simply tap your NeoCard on any compatible QR code reader or NFC-enabled device. The scan will be automatically recorded and you'll earn points."
        },
        {
          question: "What types of scans are supported?",
          answer: "We support QR code scans, NFC taps, and barcode scans. Each scan type earns different amounts of points based on the location and sponsor."
        },
        {
          question: "How do I view my scan history?",
          answer: "Go to the Scan History page to see all your past scans, including timestamps, locations, points earned, and scan types."
        }
      ]
    },
    {
      category: "Rewards & Points",
      icon: <Gift className="w-4 h-4" />,
      color: "bg-purple-100 text-purple-800",
      questions: [
        {
          question: "How do I earn points?",
          answer: "You earn points by scanning QR codes, tapping NFC readers, and completing various activities. Points are awarded based on the location and type of scan."
        },
        {
          question: "How do I redeem rewards?",
          answer: "Go to the Rewards page to see available rewards. Click 'Redeem' on any reward you want, and it will be deducted from your points balance."
        },
        {
          question: "Do points expire?",
          answer: "Points do not expire, but some rewards may have limited availability. Check the Rewards page for current offers."
        }
      ]
    },
    {
      category: "Security & Privacy",
      icon: <Shield className="w-4 h-4" />,
      color: "bg-red-100 text-red-800",
      questions: [
        {
          question: "How do I enable two-factor authentication?",
          answer: "Go to Settings > Security > Two-Factor Authentication and toggle it on. You'll receive Google prompts on your mobile device for additional security."
        },
        {
          question: "How do I view my login history?",
          answer: "Go to Settings > Security > Login History to see all your recent login sessions, including device information and timestamps."
        },
        {
          question: "What is blockchain verification?",
          answer: "Blockchain verification allows you to verify your identity using a cryptocurrency wallet. This adds an extra layer of security to your account."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: <FileText className="w-4 h-4" />,
      color: "bg-orange-100 text-orange-800",
      questions: [
        {
          question: "The app is not loading properly. What should I do?",
          answer: "Try refreshing the page or clearing your browser cache. If the issue persists, check your internet connection or try using a different browser."
        },
        {
          question: "I'm not receiving notifications. How do I fix this?",
          answer: "Go to Settings > Notifications and ensure your notification preferences are enabled. Also check your browser's notification settings."
        },
        {
          question: "How do I export my data?",
          answer: "Go to Settings > Data Management > Export Data to download your account data in JSON, CSV, or PDF format."
        }
      ]
    }
  ];

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const allQuestions = faqData.flatMap(category => 
    category.questions.map((q, index) => ({
      ...q,
      category: category.category,
      icon: category.icon,
      color: category.color,
      globalIndex: faqData.slice(0, faqData.indexOf(category)).reduce((acc, cat) => acc + cat.questions.length, 0) + index
    }))
  );

  const filteredAllQuestions = allQuestions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Frequently Asked Questions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Total FAQs</p>
                    <p className="text-2xl font-bold">{allQuestions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Response Time</p>
                    <p className="text-2xl font-bold">24h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Success Rate</p>
                    <p className="text-2xl font-bold">98%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQs Content */}
          {searchQuery ? (
            // Search Results
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Search Results ({filteredAllQuestions.length})
              </h3>
              {filteredAllQuestions.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <Badge className={item.color}>{item.category}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(item.globalIndex)}
                        >
                          {expandedItems.includes(item.globalIndex) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <h4 className="font-medium">{item.question}</h4>
                      {expandedItems.includes(item.globalIndex) && (
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Categorized FAQs
            <div className="space-y-6">
              {filteredFAQs.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category.icon}
                      {category.category}
                      <Badge className={category.color}>{category.questions.length} FAQs</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.questions.map((item, questionIndex) => {
                      const globalIndex = faqData.slice(0, categoryIndex).reduce((acc, cat) => acc + cat.questions.length, 0) + questionIndex;
                      return (
                        <div key={questionIndex} className="border rounded-lg p-3">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium">{item.question}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(globalIndex)}
                              >
                                {expandedItems.includes(globalIndex) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            {expandedItems.includes(globalIndex) && (
                              <>
                                <Separator />
                                <p className="text-sm text-muted-foreground">{item.answer}</p>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Help Section */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Still need help?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you couldn't find the answer you're looking for, our support team is here to help.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => {
                      onClose();
                      // This would trigger the support ticket modal from parent component
                      window.dispatchEvent(new CustomEvent('openSupportTicket'));
                    }}>
                      Submit Support Ticket
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowContactModal(true)}>
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Contact Support Modal */}
        <ContactSupportModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FAQsModal;
