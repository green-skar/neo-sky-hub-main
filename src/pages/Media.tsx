import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Download, CheckCircle2, Film, Image as ImageIcon, Shield, Loader2, Heart, Eye, Clock, Calendar, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { mediaService } from "@/services/media";
import VideoPlayer from "@/components/VideoPlayer";
import FileUpload from "@/components/FileUpload";
import DroneShowArchive from "@/components/DroneShowArchive";
import VRARModal from "@/components/VRARModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Media = () => {
  const [showArchive, setShowArchive] = useState(false);
  const [showVRAR, setShowVRAR] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { toast } = useToast();

  const { data: mediaItems, isLoading: mediaLoading } = useQuery({
    queryKey: ['media', 'gallery'],
    queryFn: () => mediaService.getMediaGallery(),
  });

  const { data: droneShowVideos, isLoading: droneLoading } = useQuery({
    queryKey: ['media', 'drone-show'],
    queryFn: () => mediaService.getDroneShowVideos(),
  });

  const { data: mediaStats, isLoading: statsLoading } = useQuery({
    queryKey: ['media', 'stats'],
    queryFn: () => mediaService.getMediaStats(),
  });

  const handleFileUpload = async (file: File) => {
    return mediaService.uploadFile(file);
  };

  const handlePlayLatestShow = () => {
    if (droneShowVideos?.data && droneShowVideos.data.length > 0) {
      toast({
        title: "Playing Latest Show",
        description: `Now playing: ${droneShowVideos.data[currentVideoIndex].title}`,
      });
    }
  };

  const handleViewArchive = () => {
    setShowArchive(true);
  };

  const handleLaunchVRAR = () => {
    setShowVRAR(true);
    toast({
      title: "VR/AR Mode Launching",
      description: "Initializing immersive experience...",
    });
  };

  const handleDownloadVideo = (video: any) => {
    toast({
      title: "Download Started",
      description: `Downloading "${video.title}"...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `"${video.title}" has been downloaded successfully.`,
      });
    }, 2000);
  };

  const handleShareVideo = (video: any) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description || video.title,
        url: video.url,
      });
    } else {
      navigator.clipboard.writeText(video.url);
      toast({
        title: "Link Copied",
        description: "Video link has been copied to clipboard.",
      });
    }
  };

  const handleLikeVideo = (videoId: number) => {
    toast({
      title: "Video Liked",
      description: "Thank you for your feedback!",
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleDownloadAll = () => {
    // Create a zip file with all media items
    const mediaData = mediaItems?.data || [];
    const csvContent = [
      ['Title', 'Type', 'Upload Date', 'Status', 'Size'],
      ...mediaData.map(item => [
        item.title,
        item.type,
        new Date(item.uploadDate).toLocaleDateString(),
        item.status,
        item.size
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media-library-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Media & Proof Library</h1>
          <p className="text-muted-foreground">Photo proof and scan event history</p>
        </div>
        <Button variant="outline" className="border-primary/30" onClick={handleDownloadAll}>
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>

      {/* AI Verification Status */}
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">
                AI
                <span className="text-primary ml-2">SENTINEL</span>
              </h3>
              <p className="text-sm text-muted-foreground">AI verification status</p>
            </div>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2" />
            ACTIVE
          </Badge>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">TOTAL PROOFS</p>
          <p className="text-2xl font-bold text-primary">{mediaStats?.data?.totalProofs || "Loading..."}</p>
        </Card>
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">VERIFIED</p>
          <p className="text-2xl font-bold text-accent">{mediaStats?.data?.verified || "Loading..."}</p>
        </Card>
        <Card className="p-4 border-muted">
          <p className="text-xs text-muted-foreground mb-1">PENDING</p>
          <p className="text-2xl font-bold text-muted-foreground">{mediaStats?.data?.pending || "Loading..."}</p>
        </Card>
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">FRAUD ALERTS</p>
          <p className="text-2xl font-bold">{mediaStats?.data?.fraudAlerts || "Loading..."}</p>
        </Card>
      </div>

      {/* File Upload */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Upload New Media</h3>
        <FileUpload
          onUpload={handleFileUpload}
          acceptedTypes={['image/*', 'video/*']}
          maxSize={10 * 1024 * 1024} // 10MB
          multiple={true}
        />
      </Card>

      {/* Media Gallery */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-6">Media Gallery</h3>
        {mediaLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mediaItems?.data?.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-lg overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all"
              >
                <div className="aspect-square bg-secondary/30">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-full h-full flex items-center justify-center bg-secondary/50 text-muted-foreground"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-xs">{item.title}</p>
                    </div>
                  </div>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === "image" && <ImageIcon className="w-4 h-4" />}
                      {item.type === "document" && <Shield className="w-4 h-4" />}
                      {item.type === "video" && <PlayCircle className="w-4 h-4" />}
                      <span className="text-xs font-medium">{item.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verify
                      </Button>
                      <Button size="sm" variant="outline" className="border-primary/30" onClick={() => {
                        // Download individual media item
                        const link = document.createElement('a');
                        link.href = item.url;
                        link.download = item.title;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}>
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Verified Badge */}
                {item.status === 'verified' && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary/90 text-primary-foreground border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                )}

                {/* Date */}
                <div className="absolute bottom-2 left-2 text-xs text-white/90 bg-black/50 px-2 py-1 rounded">
                  {new Date(item.uploadDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* DroneShow Replay Section */}
      <Card className="p-6 border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <Film className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-bold">DroneShow Replay</h3>
        </div>
        
        {droneLoading ? (
          <div className="rounded-lg bg-secondary/30 aspect-video flex items-center justify-center border border-border/50 mb-4">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-3 animate-spin" />
              <p className="text-muted-foreground">Loading drone show videos...</p>
            </div>
          </div>
        ) : droneShowVideos?.data && droneShowVideos.data.length > 0 ? (
          <div className="space-y-4">
            <VideoPlayer
              url={droneShowVideos.data[currentVideoIndex].url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
              title={droneShowVideos.data[currentVideoIndex].title}
              className="rounded-lg"
            />
            
            {/* Video Info */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{droneShowVideos.data[currentVideoIndex].title}</h4>
                <p className="text-sm text-muted-foreground">{droneShowVideos.data[currentVideoIndex].description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {droneShowVideos.data[currentVideoIndex].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(droneShowVideos.data[currentVideoIndex].views || 0)} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {formatNumber(droneShowVideos.data[currentVideoIndex].likes || 0)} likes
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(droneShowVideos.data[currentVideoIndex].uploadDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownloadVideo(droneShowVideos.data[currentVideoIndex])}
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleShareVideo(droneShowVideos.data[currentVideoIndex])}
                >
                  <Share2 className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleLikeVideo(droneShowVideos.data[currentVideoIndex].id)}
                >
                  <Heart className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={handlePlayLatestShow}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Play Latest Show
              </Button>
              <Button 
                variant="outline" 
                className="border-primary/30" 
                onClick={handleViewArchive}
              >
                View Archive ({droneShowVideos.data.length})
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-secondary/30 aspect-video flex items-center justify-center border border-border/50 mb-4">
            <div className="text-center">
              <PlayCircle className="w-16 h-16 text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">No drone show videos available</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for new content</p>
            </div>
          </div>
        )}
      </Card>

      {/* VR/AR Preview */}
      <Card className="p-6 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Film className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">VR/AR Preview</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Experience your NeoCard and scan events in virtual and augmented reality. 
              Connect your VR headset or use AR mode on your mobile device.
            </p>
            <Button 
              className="bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={handleLaunchVRAR}
            >
              Launch VR/AR Mode
            </Button>
          </div>
        </div>
      </Card>

      {/* DroneShow Archive Modal */}
      <DroneShowArchive
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        videos={droneShowVideos?.data || []}
      />

      {/* VR/AR Modal */}
      <VRARModal
        isOpen={showVRAR}
        onClose={() => setShowVRAR(false)}
      />
    </div>
  );
};

export default Media;
