import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  Copy, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Users,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactSupportModal = ({ isOpen, onClose }: ContactSupportModalProps) => {
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const contactMethods = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: <Mail className="w-5 h-5" />,
      primary: 'support@neocard.com',
      secondary: 'help@neocard.com',
      action: 'Copy Email',
      color: 'bg-blue-100 text-blue-800',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Call us for immediate assistance during business hours',
      icon: <Phone className="w-5 h-5" />,
      primary: '+1 (555) 123-4567',
      secondary: 'Mon-Fri 9AM-6PM EST',
      action: 'Copy Number',
      color: 'bg-green-100 text-green-800',
      bgColor: 'bg-green-50 border-green-200'
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: <MessageCircle className="w-5 h-5" />,
      primary: 'Available 24/7',
      secondary: 'Average response: 2 minutes',
      action: 'Start Chat',
      color: 'bg-purple-100 text-purple-800',
      bgColor: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'community',
      title: 'Community Forum',
      description: 'Get help from other users and our community',
      icon: <Users className="w-5 h-5" />,
      primary: 'community.neocard.com',
      secondary: 'Join discussions',
      action: 'Visit Forum',
      color: 'bg-orange-100 text-orange-800',
      bgColor: 'bg-orange-50 border-orange-200'
    }
  ];

  const handleCopy = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      toast({
        title: "Copied to Clipboard",
        description: `${text} has been copied to your clipboard.`,
      });
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
    toast({
      title: "Opening External Link",
      description: "The link has been opened in a new tab.",
    });
  };

  const getActionHandler = (method: any) => {
    switch (method.id) {
      case 'email':
        return () => handleCopy(method.primary, method.id);
      case 'phone':
        return () => handleCopy(method.primary, method.id);
      case 'chat':
        return () => {
          toast({
            title: "Live Chat",
            description: "Live chat feature coming soon! Please use email or phone support for now.",
          });
        };
      case 'community':
        return () => handleExternalLink('https://community.neocard.com');
      default:
        return () => {};
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Contact Support
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Support Overview */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Multiple Ways to Get Help</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose the contact method that works best for you. Our support team is available 24/7 to assist with any questions or issues.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Average Response: 2 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactMethods.map((method) => (
              <Card key={method.id} className={`${method.bgColor} hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {method.icon}
                    {method.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{method.primary}</span>
                      {method.id === 'community' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={getActionHandler(method)}
                          className="h-7 px-2 text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={getActionHandler(method)}
                          className="h-7 px-2 text-xs"
                        >
                          {copiedItem === method.id ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              {method.action}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{method.secondary}</p>
                  </div>
                  
                  <Badge className={method.color}>
                    {method.id === 'email' && 'Email'}
                    {method.id === 'phone' && 'Phone'}
                    {method.id === 'chat' && 'Live Chat'}
                    {method.id === 'community' && 'Community'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Support Hours & Response Times */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Business Hours</h5>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Response Times</h5>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Email: Within 24 hours</p>
                    <p>Phone: Immediate during business hours</p>
                    <p>Live Chat: Within 2 minutes</p>
                    <p>Community: Within 4 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-900 mb-1">Emergency Support</h5>
                  <p className="text-sm text-red-700 mb-2">
                    For urgent security issues or account compromises, contact us immediately.
                  </p>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCopy('emergency@neocard.com', 'emergency')}
                    className="h-8"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Emergency Contact
                  </Button>
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
      </DialogContent>
    </Dialog>
  );
};

export default ContactSupportModal;
