import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Gift, ChevronRight, Zap } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { rewardsService } from "@/services/rewards";
import { authService } from "@/services/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Constants for better maintainability
const LEVELS = [
  { name: "Bronze", min: 0, max: 100, color: "from-orange-600/20 to-orange-500/20", trophyColor: "text-orange-500" },
  { name: "Silver", min: 100, max: 250, color: "from-slate-600/20 to-slate-500/20", trophyColor: "text-slate-400" },
  { name: "Gold", min: 250, max: 500, color: "from-yellow-600/20 to-yellow-500/20", trophyColor: "text-yellow-500" },
  { name: "Platinum", min: 500, max: 1000, color: "from-cyan-600/20 to-cyan-500/20", trophyColor: "text-cyan-500" },
  { name: "Diamond", min: 1000, max: 9999, color: "from-purple-600/20 to-purple-500/20", trophyColor: "text-purple-500" },
] as const;

const SAMPLE_REWARDS = [
  {
    id: 1,
    title: "€5 Discount Voucher",
    sponsor: "TechStore",
    points: 50,
    category: "Shopping",
    expires: "30 days",
  },
  {
    id: 2,
    title: "Free Coffee",
    sponsor: "CafeChain",
    points: 25,
    category: "Food & Drink",
    expires: "15 days",
  },
  {
    id: 3,
    title: "10% Off Next Purchase",
    sponsor: "FashionHub",
    points: 75,
    category: "Shopping",
    expires: "60 days",
  },
] as const;

const ACHIEVEMENTS = [
  { id: 1, title: "First Scan", icon: Zap, unlocked: true, color: "text-yellow-500" },
  { id: 2, title: "Week Warrior", icon: Star, unlocked: true, color: "text-purple-500" },
  { id: 3, title: "Multi-Location", icon: Trophy, unlocked: true, color: "text-green-500" },
  { id: 4, title: "100 Scans", icon: Gift, unlocked: false, color: "text-orange-500" },
] as const;

const Rewards = () => {
  const [showAllRewards, setShowAllRewards] = useState(false);
  const [redeemingReward, setRedeemingReward] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: rewardsData, isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards', 'available'],
    queryFn: () => rewardsService.getAvailableRewards(),
  });

  const { data: levelsData, isLoading: levelsLoading } = useQuery({
    queryKey: ['rewards', 'levels'],
    queryFn: () => rewardsService.getLevels(),
  });

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
  });

  // Use real user data if available, fallback to static data
  const currentPoints = userData?.data?.totalPoints || 165;
  const currentLevel = LEVELS.find(l => currentPoints >= l.min && currentPoints < l.max) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const progress = nextLevel 
    ? ((currentPoints - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 
    : 100;

  const handleClearRewardsCache = async () => {
    try {
      await fetch('/api/debug/clear-rewards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('demo_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Invalidate rewards query to refetch
      queryClient.invalidateQueries({ queryKey: ['rewards', 'available'] });
      
      toast({
        title: "Cache Cleared",
        description: "Rewards cache cleared successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const handleViewAll = () => {
    setShowAllRewards(!showAllRewards);
  };

  const handleRedeem = async (rewardId: number) => {
    setRedeemingReward(rewardId);
    
    try {
      const result = await rewardsService.redeemReward(rewardId);
      
      // Invalidate and refetch all related queries to update the UI
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['rewards', 'available'] }),
        queryClient.invalidateQueries({ queryKey: ['rewards', 'history'] }),
        queryClient.invalidateQueries({ queryKey: ['rewards', 'levels'] }),
        queryClient.invalidateQueries({ queryKey: ['scans', 'stats'] }),
        queryClient.invalidateQueries({ queryKey: ['user'] })
      ]);
      
      // Show success toast
      toast({
        title: "Reward Redeemed!",
        description: result.data.message || "Reward redeemed successfully!",
        variant: "default",
      });
      
    } catch (error: any) {
      // Show error toast
      const errorMessage = error.message || 'Failed to redeem reward. Please try again.';
      toast({
        title: "Redemption Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('Failed to redeem reward:', error);
    } finally {
      setRedeemingReward(null);
    }
  };

  // Use API data if available, fallback to static data
  const displayRewards = rewardsData?.data || SAMPLE_REWARDS;
  const displayLevels = levelsData?.data || { currentLevel: currentLevel, progress, points: currentPoints };
  
  // Calculate stats from real data
  const availableRewardsCount = displayRewards.filter(r => r.status === 'available').length;
  const redeemedRewardsCount = displayRewards.filter(r => r.status === 'redeemed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neon-gold neon-text-intense">Rewards & Ladder</h1>
        <p className="text-muted-foreground">Track your progress and redeem rewards</p>
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearRewardsCache}
            className="text-xs"
          >
            Clear Rewards Cache (Debug)
          </Button>
        </div>
      </div>

      {/* Current Level Card */}
      <Card className={`p-6 bg-gradient-to-br ${currentLevel.color} border-primary/20 card-glow`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Level</p>
            <h2 className="text-3xl font-bold text-neon-blue neon-text-intense">{currentLevel.name}</h2>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center card-glow">
            <Trophy className={`w-8 h-8 ${currentLevel.trophyColor}`} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="neon-text">{currentPoints} points</span>
            {nextLevel && <span className="neon-text">{nextLevel.min} points to {nextLevel.name}</span>}
          </div>
          <Progress value={progress} className="h-3 bg-primary/20" />
        </div>
      </Card>

      {/* Points Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 border-primary/20 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">TOTAL POINTS</p>
          <p className="text-2xl font-bold text-primary neon-text-intense">{currentPoints}</p>
        </Card>
        <Card className="p-4 border-accent/20 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">AVAILABLE REWARDS</p>
          <p className="text-2xl font-bold text-accent neon-text-intense">{availableRewardsCount}</p>
        </Card>
        <Card className="p-4 border-primary/20 card-glow">
          <p className="text-xs text-muted-foreground mb-1 neon-text">REDEEMED</p>
          <p className="text-2xl font-bold neon-text-intense">{redeemedRewardsCount}</p>
        </Card>
      </div>

      {/* Rewards Ladder */}
      <Card className="p-6 card-glow glow-purple">
        <h3 className="text-lg font-bold mb-6 text-neon-blue neon-text-intense">Progression Ladder</h3>
        <div className="space-y-4">
          {LEVELS.map((level, index) => {
            const isCompleted = currentPoints >= level.min;
            const isCurrent = level.name === currentLevel.name;
            
            return (
              <div
                key={level.name}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  isCurrent 
                    ? "bg-primary/10 border-2 border-primary/30 shadow-[0_0_20px_rgba(0,217,255,0.2)]" 
                    : "bg-secondary/30"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${level.color}`}>
                  <Trophy className={`w-6 h-6 ${level.trophyColor}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{level.name}</h4>
                    {isCurrent && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {level.min} - {level.max === 9999 ? "∞" : level.max} points
                  </p>
                </div>
                
                {isCompleted && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Unlocked
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Available Rewards */}
      <Card className="p-6 card-glow glow-purple">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-neon-blue neon-text-intense">Available Coupons & Rewards</h3>
          <Button 
            variant="outline" 
            className="border-primary/30 btn-glow" 
            size="sm"
            onClick={handleViewAll}
          >
            {showAllRewards ? "Show Less" : "View All"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {rewardsLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-4 border-primary/20 card-glow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-20" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            (showAllRewards ? displayRewards : displayRewards.slice(0, 3)).map((reward) => (
              <Card key={reward.id} className="p-4 border-primary/20 hover:border-primary/40 transition-colors card-glow">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-xs neon-text">
                    {reward.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground neon-text">{reward.expiryDate ? new Date(reward.expiryDate).toLocaleDateString() : reward.expires}</span>
                </div>
                
                <h4 className="font-semibold mb-1">{reward.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{reward.sponsor || 'N/A'}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-accent neon-text-intense">{reward.points} pts</span>
                  <Button 
                    size="sm" 
                    className="bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground btn-glow-primary"
                    onClick={() => handleRedeem(reward.id)}
                    disabled={redeemingReward === reward.id}
                  >
                    {redeemingReward === reward.id ? "Redeeming..." : "Redeem"}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6 card-glow glow-green">
        <h3 className="text-lg font-bold mb-6 text-neon-green neon-text-intense">Achievement Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg text-center card-glow ${
                  achievement.unlocked
                    ? "bg-primary/10 border-2 border-primary/30"
                    : "bg-secondary/30 opacity-50"
                }`}
              >
                <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center card-glow ${
                  achievement.unlocked
                    ? "bg-primary/20"
                    : "bg-muted"
                }`}>
                  <Icon className={`w-8 h-8 ${achievement.unlocked ? achievement.color : "text-muted-foreground"}`} />
                </div>
                <p className="text-sm font-medium neon-text">{achievement.title}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Rewards;
