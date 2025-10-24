import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Bell, Shield, Database, HelpCircle } from "lucide-react";
import AIChat from "@/components/AIChat";
import SettingsModal from "@/components/SettingsModal";
import SupportTicketModal from "@/components/SupportTicketModal";
import FAQsModal from "@/components/FAQsModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showFAQsModal, setShowFAQsModal] = useState(false);
  const { toast } = useToast();
  
  const handleSettingClick = (setting: string) => {
    setSelectedModal(setting);
    setModalOpen(true);
  };

  const handleSubmitTicket = () => {
    setShowSupportModal(true);
  };

  const handleViewFAQs = () => {
    setShowFAQsModal(true);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings & AI Support</h1>
        <p className="text-muted-foreground">Manage your preferences and get AI-powered assistance</p>
      </div>

      {/* AI Support Chat */}
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Get instant help with your NeoCard dashboard. Ask questions about your account, 
              rewards, or any feature.
            </p>
          </div>
        </div>
        
        <div className="h-[400px] rounded-lg border border-border/50 overflow-hidden">
          <AIChat />
        </div>
      </Card>

      {/* Settings Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold">Account Settings</h3>
          </div>
          <div className="space-y-3">
            {["Edit Profile", "Change Password", "Privacy Settings", "Connected Accounts"].map((setting) => (
              <button
                key={setting}
                className="w-full text-left p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                onClick={() => handleSettingClick(setting)}
              >
                {setting}
              </button>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold">Notifications</h3>
          </div>
          <div className="space-y-3">
            {["Email Notifications", "Push Notifications", "SMS Alerts", "Notification Frequency"].map(
              (setting) => (
                <button
                  key={setting}
                  className="w-full text-left p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  onClick={() => handleSettingClick(setting)}
                >
                  {setting}
                </button>
              )
            )}
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold">Security</h3>
          </div>
          <div className="space-y-3">
            {[
              "Two-Factor Authentication",
              "Login History",
              "Blockchain Verification",
              "Security Alerts",
            ].map((setting) => (
              <button
                key={setting}
                className="w-full text-left p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                onClick={() => handleSettingClick(setting)}
              >
                {setting}
              </button>
            ))}
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold">Data Management</h3>
          </div>
          <div className="space-y-3">
            {["Export Data", "Download Reports", "Data Privacy", "Delete Account"].map((setting) => (
              <button
                key={setting}
                className="w-full text-left p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                onClick={() => handleSettingClick(setting)}
              >
                {setting}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Helpdesk */}
      <Card className="p-6 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Need More Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Can't find what you're looking for? Submit a support ticket and our team will get back to you within 24 hours.
            </p>
            <div className="flex gap-2">
              <Button 
                className="bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={handleSubmitTicket}
              >
                Submit Ticket
              </Button>
              <Button 
                variant="outline" 
                className="border-accent/30" 
                onClick={handleViewFAQs}
              >
                View FAQs
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        modalType={selectedModal}
      />

      {/* Support Ticket Modal */}
      <SupportTicketModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        onSubmit={(ticketData) => {
          toast({
            title: "Support Ticket Submitted",
            description: "Your ticket has been submitted successfully. We'll get back to you within 24 hours.",
          });
          setShowSupportModal(false);
        }}
      />

      {/* FAQs Modal */}
      <FAQsModal
        isOpen={showFAQsModal}
        onClose={() => setShowFAQsModal(false)}
      />
    </div>
  );
};

export default SettingsPage;
