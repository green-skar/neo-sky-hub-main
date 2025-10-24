import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Smartphone, 
  Lock, 
  Eye, 
  Download, 
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: string;
}

const SettingsModal = ({ isOpen, onClose, modalType }: SettingsModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    notificationFrequency: "immediate",
    twoFactorEnabled: false,
    exportFormat: "json",
    deleteConfirmation: "",
    blockchainAddress: "",
    verificationCode: "",
    googlePromptEmail: "",
    securityAlertEmail: true,
    newDeviceAlerts: true,
    suspiciousActivityAlerts: true
  });

  const [isSaved, setIsSaved] = useState(false);
  const [showFullLoginHistory, setShowFullLoginHistory] = useState(false);
  const [showBlockchainVerification, setShowBlockchainVerification] = useState(false);
  const [show2FAConfirmation, setShow2FAConfirmation] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSaved(false);
      setShowFullLoginHistory(false);
      setShowBlockchainVerification(false);
      setShow2FAConfirmation(false);
      setVerificationStep(1);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission based on modal type
    console.log(`${modalType} settings updated:`, formData);
    setIsSaved(true);
    // Don't close modal automatically - let user close manually
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Reset saved state when user makes changes
    if (isSaved) {
      setIsSaved(false);
    }
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderPasswordSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
            placeholder="Enter current password"
          />
        </div>
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Profile Visibility
          </CardTitle>
          <CardDescription>Control who can see your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Public Profile</Label>
              <p className="text-sm text-muted-foreground">Allow others to find your profile</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Activity</Label>
              <p className="text-sm text-muted-foreground">Display your recent activity</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConnectedAccounts = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Connected Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Google</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              <Badge variant="secondary">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Apple</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive updates via email</p>
          </div>
          <Switch 
            checked={formData.emailNotifications}
            onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">Get notifications on your device</p>
          </div>
          <Switch 
            checked={formData.pushNotifications}
            onCheckedChange={(checked) => handleInputChange("pushNotifications", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>SMS Alerts</Label>
            <p className="text-sm text-muted-foreground">Receive text message alerts</p>
          </div>
          <Switch 
            checked={formData.smsAlerts}
            onCheckedChange={(checked) => handleInputChange("smsAlerts", checked)}
          />
        </div>
        <div>
          <Label>Notification Frequency</Label>
          <Select 
            value={formData.notificationFrequency}
            onValueChange={(value) => handleInputChange("notificationFrequency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Summary</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
          <Switch 
            checked={formData.twoFactorEnabled}
            onCheckedChange={(checked) => {
              if (checked) {
                setShow2FAConfirmation(true);
              } else {
                handleInputChange("twoFactorEnabled", false);
              }
            }}
          />
        </div>

        {/* 2FA Confirmation Dialog */}
        {show2FAConfirmation && (
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Enable Google Prompts</p>
                  <p className="text-sm text-blue-700">
                    This will send Google prompts to your mobile device when signing in from new locations.
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor="googlePromptEmail">Email for Google Prompts</Label>
                <Input
                  id="googlePromptEmail"
                  type="email"
                  value={formData.googlePromptEmail}
                  onChange={(e) => handleInputChange("googlePromptEmail", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => {
                    handleInputChange("twoFactorEnabled", true);
                    // Don't close confirmation dialog automatically
                  }}
                >
                  Enable Google Prompts
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShow2FAConfirmation(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Login History</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFullLoginHistory(!showFullLoginHistory)}
            >
              {showFullLoginHistory ? "Show Less" : "Show Full History"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-muted-foreground">Chrome on Windows • Now</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Previous Session</p>
                <p className="text-sm text-muted-foreground">Safari on iPhone • 2 hours ago</p>
              </div>
              <Badge variant="outline">Ended</Badge>
            </div>
            
            {showFullLoginHistory && (
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Mobile App Login</p>
                    <p className="text-sm text-muted-foreground">iOS App • Yesterday</p>
                  </div>
                  <Badge variant="outline">Ended</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Desktop Login</p>
                    <p className="text-sm text-muted-foreground">Firefox on Mac • 3 days ago</p>
                  </div>
                  <Badge variant="outline">Ended</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">New Device Login</p>
                    <p className="text-sm text-muted-foreground">Chrome on Android • 1 week ago</p>
                  </div>
                  <Badge variant="destructive">New Device</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Suspicious Login Attempt</p>
                    <p className="text-sm text-muted-foreground">Unknown Location • 2 weeks ago</p>
                  </div>
                  <Badge variant="destructive">Blocked</Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Blockchain Verification</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBlockchainVerification(!showBlockchainVerification)}
            >
              {showBlockchainVerification ? "Hide Process" : "Verify Identity"}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium">Verified</p>
              <p className="text-sm text-muted-foreground">Your identity is verified on-chain</p>
            </div>
          </div>

          {showBlockchainVerification && (
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    verificationStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    1
                  </div>
                  <span className="text-sm font-medium">Connect Wallet</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    verificationStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Sign Message</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    verificationStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                  <span className="text-sm font-medium">Verify Identity</span>
                </div>

                {verificationStep === 1 && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="blockchainAddress">Wallet Address</Label>
                      <Input
                        id="blockchainAddress"
                        value={formData.blockchainAddress}
                        onChange={(e) => handleInputChange("blockchainAddress", e.target.value)}
                        placeholder="0x..."
                      />
                    </div>
                    <Button onClick={() => setVerificationStep(2)}>
                      Connect Wallet
                    </Button>
                  </div>
                )}

                {verificationStep === 2 && (
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <p className="text-sm text-blue-800">
                        Please sign the message in your wallet to verify ownership.
                      </p>
                    </div>
                    <Button onClick={() => setVerificationStep(3)}>
                      Sign Message
                    </Button>
                  </div>
                )}

                {verificationStep === 3 && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="verificationCode">Verification Code</Label>
                      <Input
                        id="verificationCode"
                        value={formData.verificationCode}
                        onChange={(e) => handleInputChange("verificationCode", e.target.value)}
                        placeholder="Enter verification code"
                      />
                    </div>
                    <Button onClick={() => {
                      setVerificationStep(1);
                      // Don't close verification process automatically
                    }}>
                      Complete Verification
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        <Separator />
        
        <div className="space-y-3">
          <h4 className="font-medium">Security Alerts</h4>
          <p className="text-sm text-muted-foreground">
            Configure how you receive security notifications about your account.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
              </div>
              <Switch 
                checked={formData.securityAlertEmail}
                onCheckedChange={(checked) => handleInputChange("securityAlertEmail", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>New Device Sign-ins</Label>
                <p className="text-sm text-muted-foreground">Alert when signing in from new devices</p>
              </div>
              <Switch 
                checked={formData.newDeviceAlerts}
                onCheckedChange={(checked) => handleInputChange("newDeviceAlerts", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Suspicious Activity</Label>
                <p className="text-sm text-muted-foreground">Alert for unusual account activity</p>
              </div>
              <Switch 
                checked={formData.suspiciousActivityAlerts}
                onCheckedChange={(checked) => handleInputChange("suspiciousActivityAlerts", checked)}
              />
            </div>
          </div>

          {/* Recent Security Alerts */}
          <Card className="p-4">
            <h5 className="font-medium mb-3">Recent Security Alerts</h5>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2 border rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">New Device Sign-in</p>
                  <p className="text-muted-foreground">Chrome on Android • 1 week ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 border rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Suspicious Login Attempt</p>
                  <p className="text-muted-foreground">Unknown Location • 2 weeks ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 border rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Password Changed</p>
                  <p className="text-muted-foreground">Account security updated • 1 month ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Data
            </CardTitle>
            <CardDescription>Download your data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Export Format</Label>
              <Select 
                value={formData.exportFormat}
                onValueChange={(value) => handleInputChange("exportFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Account
            </CardTitle>
            <CardDescription>Permanently delete your account and all data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Warning</p>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. All your data, scans, and rewards will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="deleteConfirmation">
                Type "DELETE" to confirm account deletion
              </Label>
              <Input
                id="deleteConfirmation"
                value={formData.deleteConfirmation}
                onChange={(e) => handleInputChange("deleteConfirmation", e.target.value)}
                placeholder="Type DELETE to confirm"
              />
            </div>
            <Button 
              variant="destructive" 
              className="w-full"
              disabled={formData.deleteConfirmation !== "DELETE"}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getModalContent = () => {
    switch (modalType) {
      case "Edit Profile":
        return renderAccountSettings();
      case "Change Password":
        return renderPasswordSettings();
      case "Privacy Settings":
        return renderPrivacySettings();
      case "Connected Accounts":
        return renderConnectedAccounts();
      case "Email Notifications":
      case "Push Notifications":
      case "SMS Alerts":
      case "Notification Frequency":
        return renderNotificationSettings();
      case "Two-Factor Authentication":
      case "Login History":
      case "Blockchain Verification":
      case "Security Alerts":
        return renderSecuritySettings();
      case "Export Data":
      case "Download Reports":
      case "Data Privacy":
      case "Delete Account":
        return renderDataManagement();
      default:
        return <div>Settings for {modalType}</div>;
    }
  };

  const getModalTitle = () => {
    const iconMap = {
      "Edit Profile": <User className="w-5 h-5" />,
      "Change Password": <Lock className="w-5 h-5" />,
      "Privacy Settings": <Eye className="w-5 h-5" />,
      "Connected Accounts": <Smartphone className="w-5 h-5" />,
      "Email Notifications": <Mail className="w-5 h-5" />,
      "Push Notifications": <Bell className="w-5 h-5" />,
      "SMS Alerts": <Smartphone className="w-5 h-5" />,
      "Notification Frequency": <Bell className="w-5 h-5" />,
      "Two-Factor Authentication": <Shield className="w-5 h-5" />,
      "Login History": <Eye className="w-5 h-5" />,
      "Blockchain Verification": <CheckCircle2 className="w-5 h-5" />,
      "Security Alerts": <AlertTriangle className="w-5 h-5" />,
      "Export Data": <Download className="w-5 h-5" />,
      "Download Reports": <Download className="w-5 h-5" />,
      "Data Privacy": <Database className="w-5 h-5" />,
      "Delete Account": <Trash2 className="w-5 h-5" />
    };

    return (
      <div className="flex items-center gap-2">
        {iconMap[modalType as keyof typeof iconMap]}
        {modalType}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {getModalContent()}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              {isSaved ? "Close" : "Cancel"}
            </Button>
            <Button type="submit" disabled={isSaved}>
              {isSaved ? "✓ Saved" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
