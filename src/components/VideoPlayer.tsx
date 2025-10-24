import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  url: string;
  title?: string;
  thumbnail?: string;
  className?: string;
  controls?: boolean;
  onDownload?: () => void;
}

const VideoPlayer = ({ 
  url, 
  title, 
  thumbnail,
  className = "",
  controls = true,
  onDownload
}: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);
    const handleError = () => {
      setError(true);
      setLoading(false);
    };
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.play().catch(() => {
        setError(true);
        setPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [playing]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video flex items-center justify-center bg-secondary/30">
          <div className="text-center">
            <Play className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-semibold text-muted-foreground">Video Unavailable</p>
            <p className="text-sm text-muted-foreground">This video cannot be played at the moment</p>
            {onDownload && (
              <Button 
                className="mt-4 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={onDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Instead
              </Button>
            )}
          </div>
        </div>
        {title && (
          <div className="p-3 bg-card">
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          src={url}
          poster={thumbnail}
          className="w-full h-full object-cover"
          preload="metadata"
        />
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-white mx-auto mb-2 animate-spin" />
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}
        
        {/* Play Button Overlay */}
        {!playing && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer">
            <Button
              size="lg"
              className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={handlePlayPause}
            >
              <Play className="w-8 h-8 ml-1" />
            </Button>
          </div>
        )}

        {/* Custom Controls */}
        {controls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handlePlayPause}
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={handleMute}
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 text-white text-sm">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={onDownload}
                >
                  <Download className="w-5 h-5" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleFullscreen}
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {title && (
        <div className="p-3 bg-card">
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
