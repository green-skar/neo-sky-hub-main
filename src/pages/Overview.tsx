import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, Calendar, Building2, CheckCircle2, TrendingUp, Loader2, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { scanService } from "@/services/scans";
import { authService } from "@/services/auth";
import { rewardsService } from "@/services/rewards";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const navigate = useNavigate();
  
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
  });

  const { data: scanChartData, isLoading: chartLoading } = useQuery({
    queryKey: ['scans', 'chart'],
    queryFn: () => scanService.getChartData(),
  });

  const { data: recentScans, isLoading: scansLoading } = useQuery({
    queryKey: ['scans', 'recent'],
    queryFn: () => scanService.getRecentScans(),
  });

  const { data: scanStats, isLoading: statsLoading } = useQuery({
    queryKey: ['scans', 'stats'],
    queryFn: () => scanService.getStatistics(),
  });

  const { data: recentRewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards', 'history'],
    queryFn: () => rewardsService.getRewardHistory(),
  });

  if (userLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neon-cyan">My NeoCard</h1>
        <p className="text-muted-foreground">Your digital loyalty card dashboard</p>
      </div>

      {/* AI Alert Banner */}
      <Card className="border-accent/20 bg-accent/5 p-4 card-glow glow-gold">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 text-neon-gold" />
          <p className="text-sm">
            <span className="font-semibold text-accent text-neon-gold">Keep scanning!</span> Missions with more scans earn bigger rewards.
          </p>
        </div>
      </Card>

      {/* Profile & Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="p-6 border-primary/20 bg-gradient-to-br from-card to-card/50 card-glow card-glow-hover">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 mb-4 overflow-hidden flex items-center justify-center glow-cyan">
              {user?.data?.avatar ? (
                <img 
                  src={user.data.avatar} 
                  alt={user.data.name || "User"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20" style={{ display: user?.data?.avatar ? 'none' : 'flex' }}>
                <User className="w-16 h-16 text-primary/60" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">{user?.data?.name || "Loading..."}</h2>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="border-primary/30 text-primary">
                {user?.data?.uid || "Loading..."}
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {user?.data?.status?.toUpperCase() || "ACTIVE"}
              </Badge>
            </div>
            <Button
              variant="outline" 
              className="border-primary/30 hover:bg-primary/10 btn-glow"
              onClick={() => navigate('/settings')}
            >
              Edit Profile
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Recent rewards claimed</h3>
            {rewardsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : recentRewards?.data && recentRewards.data.length > 0 ? (
              <div className="space-y-2">
                {recentRewards.data.slice(0, 3).map((reward, index) => (
                  <div key={reward.id || index} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{reward.title}</p>
                      <p className="text-xs text-muted-foreground">{reward.category}</p>
                    </div>
                    <Badge variant={reward.status === 'redeemed' ? 'default' : 'secondary'} className="text-xs">
                      {reward.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No recent claims</p>
            )}
          </div>
        </Card>

        {/* Stats & Rewards */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 border-primary/20 card-glow glow-cyan">
              <p className="text-xs text-muted-foreground mb-1">REWARDS</p>
              <p className="text-2xl font-bold text-primary text-neon-cyan">€16.50</p>
            </Card>
            <Card className="p-4 border-primary/20 card-glow glow-purple">
              <p className="text-xs text-muted-foreground mb-1">TOTAL SCANS</p>
              <p className="text-lg font-bold text-neon-purple">{scanStats?.data?.totalScans || "Loading..."}</p>
            </Card>
            <Card className="p-4 border-primary/20 card-glow glow-gold">
              <p className="text-xs text-muted-foreground mb-1">THIS WEEK</p>
              <p className="text-lg font-bold text-neon-gold">{scanStats?.data?.thisWeek || "Loading..."}</p>
            </Card>
          </div>

          {/* M-Pesa Rewards */}
          <Card className="p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent card-glow glow-gold">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-bold">₵</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rewards</p>
                <p className="text-2xl font-bold text-accent">M-PESA 60</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total earned</p>
          </Card>

          {/* Proof of Activation */}
          <Card className="p-6 border-primary/20">
            <h3 className="text-sm font-semibold mb-3">Proof of activation</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Proof-on-Chain</p>
                <p className="text-sm text-muted-foreground">Blockchain Hash</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Scan History Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Scans Table */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Scan History</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 text-xs font-semibold text-muted-foreground pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                TIME
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                LOCATION
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3 h-3" />
                SPONSOR
              </div>
            </div>
            {scansLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 py-2">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                  </div>
                ))}
              </div>
            ) : (
              recentScans?.data?.map((scan, index) => (
                <div key={scan.id || index} className="grid grid-cols-3 text-sm py-2 hover:bg-secondary/50 rounded transition-colors">
                  <div>{new Date(scan.timestamp).toLocaleDateString()}</div>
                  <div>{scan.location}</div>
                  <div>{scan.details?.brand || 'N/A'}</div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Scans Over Time Chart */}
        <Card className="p-6 card-glow chart-glow">
          <h3 className="text-lg font-bold mb-4 text-neon-cyan">Scans Over Time</h3>
          {chartLoading ? (
            <div className="h-[200px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scanChartData?.data || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="day" 
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
                dataKey="scans" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="p-6 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold">
            AI INSIGHTS
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Scans are most active on Friday afternoons
        </p>
      </Card>
    </div>
  );
};

export default Overview;
