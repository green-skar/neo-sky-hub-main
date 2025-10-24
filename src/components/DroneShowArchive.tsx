import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  PlayCircle, 
  Download, 
  Share2, 
  Heart, 
  Eye, 
  Clock, 
  Calendar,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X
} from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { useToast } from "@/hooks/use-toast";

interface VideoItem {
  id: number;
  title: string;
  uploadDate: string;
  duration: string;
  quality: string;
  description: string;
  views: number;
  likes: number;
  tags: string[];
  thumbnail: string;
  url: string;
  size: string;
}

interface DroneShowArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoItem[];
}

const DroneShowArchive = ({ isOpen, onClose, videos }: DroneShowArchiveProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "views" | "likes" | "duration">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterTag, setFilterTag] = useState<string>("all");
  const { toast } = useToast();

  // Get all unique tags
  const allTags = Array.from(new Set(videos.flatMap(video => video.tags)));

  // Filter and sort videos
  const filteredVideos = videos
    .filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          video.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = filterTag === "all" || video.tags.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
        case "views":
          comparison = a.views - b.views;
          break;
        case "likes":
          comparison = a.likes - b.likes;
          break;
        case "duration":
          const aDuration = parseDuration(a.duration);
          const bDuration = parseDuration(b.duration);
          comparison = aDuration - bDuration;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const parseDuration = (duration: string): number => {
    const parts = duration.split(":");
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  const handlePlayVideo = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  const handleDownloadVideo = (video: VideoItem) => {
    // Simulate download
    toast({
      title: "Download Started",
      description: `Downloading "${video.title}"...`,
    });
    
    // In a real app, this would trigger an actual download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `"${video.title}" has been downloaded successfully.`,
      });
    }, 2000);
  };

  const handleShareVideo = (video: VideoItem) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-primary" />
            DroneShow Archive
          </DialogTitle>
          <DialogDescription>
            Explore our collection of spectacular drone shows and tech demonstrations
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search and Filter Controls */}
          <div className="flex-shrink-0 space-y-4 mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                >
                  <option value="all">All Categories</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field as any);
                    setSortOrder(order as any);
                  }}
                  className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="views-desc">Most Viewed</option>
                  <option value="likes-desc">Most Liked</option>
                  <option value="duration-asc">Shortest First</option>
                  <option value="duration-desc">Longest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-full h-48 flex items-center justify-center bg-secondary/50 text-muted-foreground"
                      style={{ display: 'none' }}
                    >
                      <PlayCircle className="w-12 h-12" />
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    
                    {/* Quality Badge */}
                    <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                      {video.quality}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(video.views)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {formatNumber(video.likes)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(video.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {video.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{video.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handlePlayVideo(video)}
                      >
                        <PlayCircle className="w-3 h-3 mr-1" />
                        Play
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadVideo(video)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShareVideo(video)}
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleLikeVideo(video.id)}
                      >
                        <Heart className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <PlayCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No videos found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>{selectedVideo.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedVideo.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(selectedVideo.views)} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {formatNumber(selectedVideo.likes)} likes
                      </span>
                    </DialogDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedVideo(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-hidden">
                <VideoPlayer
                  url={selectedVideo.url}
                  title={selectedVideo.title}
                  className="w-full h-full"
                />
              </div>
              
              <div className="flex-shrink-0 flex gap-2 pt-4">
                <Button onClick={() => handleDownloadVideo(selectedVideo)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => handleShareVideo(selectedVideo)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={() => handleLikeVideo(selectedVideo.id)}>
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DroneShowArchive;
