import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Gift, Shield, TrendingUp, CheckCircle2, Clock, ExternalLink, Calendar, MapPin, User, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const notifications = [
  {
    id: 1,
    type: "reward",
    icon: Gift,
    title: "New Reward Available",
    message: "You've unlocked a €5 discount voucher at TechStore",
    time: "5 minutes ago",
    read: false,
    category: "Rewards",
    details: {
      rewardTitle: "€5 Discount Voucher",
      sponsor: "TechStore",
      value: "€5.00",
      expiryDate: "2025-11-20",
      pointsRequired: 50,
      description: "Get €5 off your next purchase at TechStore. Valid on all electronics and accessories.",
      terms: "Minimum purchase of €25 required. Cannot be combined with other offers.",
      actionUrl: "/rewards",
      actionText: "Redeem Now"
    }
  },
  {
    id: 2,
    type: "security",
    icon: Shield,
    title: "Security Alert",
    message: "Your blockchain hash has been verified successfully",
    time: "1 hour ago",
    read: false,
    category: "Security",
    details: {
      alertType: "Blockchain Verification",
      severity: "Low",
      hash: "0xa7f92e9F5b332aaA12d",
      blockNumber: 744642,
      verificationTime: "2025-10-20 10:49 UTC",
      description: "Your NeoCard's blockchain hash has been successfully verified and recorded on the blockchain.",
      actionUrl: "/audit",
      actionText: "View Audit Log"
    }
  },
  {
    id: 3,
    type: "achievement",
    icon: TrendingUp,
    title: "Level Up!",
    message: "Congratulations! You've reached Silver level",
    time: "2 hours ago",
    read: true,
    category: "Achievements",
    details: {
      achievementName: "Silver Level Reached",
      level: "Silver",
      pointsEarned: 150,
      totalPoints: 250,
      benefits: ["Priority customer support", "Exclusive rewards", "Early access to new features"],
      nextLevel: "Gold",
      pointsToNext: 250,
      actionUrl: "/rewards",
      actionText: "View Rewards"
    }
  },
  {
    id: 4,
    type: "sponsor",
    icon: Bell,
    title: "Sponsor Update",
    message: "Digicomp has added new scan locations",
    time: "3 hours ago",
    read: true,
    category: "Sponsors",
    details: {
      sponsorName: "Digicomp",
      updateType: "New Scan Locations",
      locationsAdded: 3,
      newLocations: ["Downtown Mall", "Tech Plaza", "University Campus"],
      description: "Digicomp has expanded their network with 3 new scan locations in your area.",
      actionUrl: "/scan-history",
      actionText: "View Map"
    }
  },
];

const Notifications = () => {
  const [notificationList, setNotificationList] = useState(notifications);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: "All Notifications Marked as Read",
      description: "All notifications have been marked as read successfully.",
      variant: "default",
    });
  };

  const markAsRead = (notificationId) => {
    setNotificationList(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    
    const notification = notificationList.find(n => n.id === notificationId);
    toast({
      title: "Notification Marked as Read",
      description: `"${notification.title}" has been marked as read.`,
      variant: "default",
    });
  };

  const viewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
  };

  const handleActionClick = (actionUrl) => {
    // In a real app, this would navigate to the specific page
    toast({
      title: "Action Initiated",
      description: `Redirecting to ${actionUrl}...`,
      variant: "default",
    });
    setShowDetailsModal(false);
  };

  // Calculate stats dynamically
  const unreadCount = notificationList.filter(n => !n.read).length;
  const todayCount = notificationList.length; // Assuming all are from today
  const rewardsCount = notificationList.filter(n => n.type === "reward").length;
  const securityCount = notificationList.filter(n => n.type === "security").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-neon-blue neon-text-intense">Notifications & Alerts</h1>
          <p className="text-muted-foreground">Stay updated with AI-powered smart notifications</p>
        </div>
        <Button variant="outline" className="border-primary/30" onClick={markAllAsRead}>
          Mark All Read
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">UNREAD</p>
          <p className="text-2xl font-bold text-primary neon-text-intense">{unreadCount}</p>
        </Card>
        <Card className="p-4 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">TODAY</p>
          <p className="text-2xl font-bold neon-text-intense">{todayCount}</p>
        </Card>
        <Card className="p-4 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">REWARDS</p>
          <p className="text-2xl font-bold text-accent neon-text-intense">{rewardsCount}</p>
        </Card>
        <Card className="p-4 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">SECURITY</p>
          <p className="text-2xl font-bold neon-text-intense">{securityCount}</p>
        </Card>
      </div>

      {/* AI Smart Categorization */}
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI-Powered Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Our AI intelligently categorizes and prioritizes your notifications based on importance 
              and relevance. Critical security alerts are always shown first.
            </p>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-6">Recent Notifications</h3>
        <div className="space-y-3">
          {notificationList.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                  notification.read
                    ? "bg-secondary/20 hover:bg-secondary/30"
                    : "bg-primary/5 border-2 border-primary/20 hover:bg-primary/10"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === "reward"
                      ? "bg-accent/20"
                      : notification.type === "security"
                      ? "bg-primary/20"
                      : "bg-secondary"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      notification.type === "reward"
                        ? "text-accent"
                        : notification.type === "security"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {notification.category}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-primary/30" 
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => viewDetails(notification)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {["Rewards & Achievements", "Security Alerts", "Sponsor Updates", "System Notifications"].map(
            (pref) => (
              <div
                key={pref}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <span className="font-medium">{pref}</span>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-12 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                </label>
              </div>
            )
          )}
        </div>
      </Card>

      {/* Cooldown Timer Info */}
      <Card className="p-6 border-primary/20">
        <div className="flex items-center gap-4">
          <Clock className="w-8 h-8 text-primary" />
          <div>
            <h4 className="font-semibold mb-1">Smart Notification Cooldown</h4>
            <p className="text-sm text-muted-foreground">
              To avoid notification fatigue, similar notifications are grouped and displayed at optimal times
            </p>
          </div>
        </div>
      </Card>

      {/* Notification Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>
              Detailed information about this notification
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-6">
              {/* Notification Header */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedNotification.type === "reward"
                      ? "bg-accent/20"
                      : selectedNotification.type === "security"
                      ? "bg-primary/20"
                      : "bg-secondary"
                  }`}
                >
                  <selectedNotification.icon
                    className={`w-8 h-8 ${
                      selectedNotification.type === "reward"
                        ? "text-accent"
                        : selectedNotification.type === "security"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedNotification.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedNotification.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedNotification.message}
                  </p>
                </div>
              </div>

              {/* Notification Details Based on Type */}
              {selectedNotification.type === "reward" && selectedNotification.details && (
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Reward Details
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Reward Title</p>
                        <p className="font-medium">{selectedNotification.details.rewardTitle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Sponsor</p>
                        <p className="font-medium">{selectedNotification.details.sponsor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Value</p>
                        <p className="font-medium text-accent">{selectedNotification.details.value}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Points Required</p>
                        <p className="font-medium">{selectedNotification.details.pointsRequired}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {selectedNotification.details.expiryDate}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{selectedNotification.details.description}</p>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Terms & Conditions</p>
                      <p className="text-sm text-muted-foreground">{selectedNotification.details.terms}</p>
                    </div>
                  </Card>
                </div>
              )}

              {selectedNotification.type === "security" && selectedNotification.details && (
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Security Alert Details
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Alert Type</p>
                        <p className="font-medium">{selectedNotification.details.alertType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Severity</p>
                        <Badge 
                          className={
                            selectedNotification.details.severity === "High" 
                              ? "bg-destructive/20 text-destructive" 
                              : "bg-primary/20 text-primary"
                          }
                        >
                          {selectedNotification.details.severity}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Block Number</p>
                        <p className="font-mono text-sm">{selectedNotification.details.blockNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Verification Time</p>
                        <p className="text-sm">{selectedNotification.details.verificationTime}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-1">Blockchain Hash</p>
                      <p className="font-mono text-xs break-all bg-secondary/30 p-2 rounded">
                        {selectedNotification.details.hash}
                      </p>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{selectedNotification.details.description}</p>
                    </div>
                  </Card>
                </div>
              )}

              {selectedNotification.type === "achievement" && selectedNotification.details && (
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Achievement Details
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Achievement</p>
                        <p className="font-medium">{selectedNotification.details.achievementName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Level Reached</p>
                        <Badge className="bg-primary/20 text-primary">
                          {selectedNotification.details.level}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Points Earned</p>
                        <p className="font-medium text-accent">{selectedNotification.details.pointsEarned}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Points</p>
                        <p className="font-medium">{selectedNotification.details.totalPoints}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Next Level</p>
                        <p className="font-medium">{selectedNotification.details.nextLevel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Points to Next Level</p>
                        <p className="font-medium">{selectedNotification.details.pointsToNext}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">New Benefits</p>
                      <div className="space-y-1">
                        {selectedNotification.details.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-3 h-3 text-primary" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {selectedNotification.type === "sponsor" && selectedNotification.details && (
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Sponsor Update Details
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Sponsor</p>
                        <p className="font-medium">{selectedNotification.details.sponsorName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Update Type</p>
                        <p className="font-medium">{selectedNotification.details.updateType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Locations Added</p>
                        <p className="font-medium text-accent">{selectedNotification.details.locationsAdded}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">New Locations</p>
                      <div className="space-y-1">
                        {selectedNotification.details.newLocations.map((location, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3 text-primary" />
                            {location}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{selectedNotification.details.description}</p>
                    </div>
                  </Card>
                </div>
              )}

              {/* Action Button */}
              {selectedNotification.details?.actionUrl && (
                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    className="bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleActionClick(selectedNotification.details.actionUrl)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {selectedNotification.details.actionText}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;
