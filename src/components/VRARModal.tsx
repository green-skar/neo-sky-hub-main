import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Smartphone, 
  Monitor, 
  Headphones, 
  Camera, 
  Zap, 
  Eye, 
  RotateCcw,
  Play,
  Pause,
  Volume2,
  Settings,
  Download,
  Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VRARModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VRARModal = ({ isOpen, onClose }: VRARModalProps) => {
  const [mode, setMode] = useState<'vr' | 'ar'>('vr');
  const [device, setDevice] = useState<'headset' | 'mobile' | 'desktop'>('headset');
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentScene, setCurrentScene] = useState(0);
  const { toast } = useToast();

  const scenes = [
    {
      id: 0,
      name: "NeoCard 3D Model",
      description: "Interactive 3D visualization of your NeoCard",
      type: "3D Model",
      duration: "2:30"
    },
    {
      id: 1,
      name: "Scan Event Simulation",
      description: "Experience a QR code scan in virtual space",
      type: "Interactive",
      duration: "1:45"
    },
    {
      id: 2,
      name: "Blockchain Visualization",
      description: "See your transactions in 3D blockchain format",
      type: "Data Visualization",
      duration: "3:15"
    },
    {
      id: 3,
      name: "Drone Show VR",
      description: "Immersive drone light show experience",
      type: "Entertainment",
      duration: "4:20"
    }
  ];

  useEffect(() => {
    if (isOpen) {
      // Simulate device detection
      const timer = setTimeout(() => {
        setIsConnected(true);
        toast({
          title: "VR/AR Device Connected",
          description: `${device === 'headset' ? 'VR Headset' : device === 'mobile' ? 'Mobile AR' : 'Desktop AR'} is ready!`,
        });
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setIsConnected(false);
      setIsPlaying(false);
    }
  }, [isOpen, device, toast]);

  const handleModeChange = (newMode: 'vr' | 'ar') => {
    setMode(newMode);
    toast({
      title: `Switched to ${newMode.toUpperCase()} Mode`,
      description: `Now experiencing ${newMode === 'vr' ? 'Virtual Reality' : 'Augmented Reality'}`,
    });
  };

  const handleDeviceChange = (newDevice: 'headset' | 'mobile' | 'desktop') => {
    setDevice(newDevice);
    setIsConnected(false);
    toast({
      title: "Device Changed",
      description: `Switched to ${newDevice === 'headset' ? 'VR Headset' : newDevice === 'mobile' ? 'Mobile AR' : 'Desktop AR'}`,
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "VR/AR Experience Paused" : "VR/AR Experience Started",
      description: `Now ${isPlaying ? 'paused' : 'playing'}: ${scenes[currentScene].name}`,
    });
  };

  const handleSceneChange = (sceneId: number) => {
    setCurrentScene(sceneId);
    toast({
      title: "Scene Changed",
      description: `Now viewing: ${scenes[sceneId].name}`,
    });
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleDownloadScene = () => {
    toast({
      title: "Scene Download Started",
      description: `Downloading "${scenes[currentScene].name}" for offline viewing...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Scene downloaded successfully! You can now view it offline.",
      });
    }, 2000);
  };

  const handleShareScene = () => {
    if (navigator.share) {
      navigator.share({
        title: scenes[currentScene].name,
        text: scenes[currentScene].description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${scenes[currentScene].name} - ${scenes[currentScene].description}`);
      toast({
        title: "Scene Shared",
        description: "Scene information copied to clipboard!",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <Eye className="w-4 h-4 text-accent" />
            </div>
            VR/AR Experience Center
          </DialogTitle>
          <DialogDescription>
            Immersive virtual and augmented reality experiences for your NeoCard
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-6">
          {/* Left Panel - Controls */}
          <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
            {/* Mode Selection */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Experience Mode</h3>
              <div className="space-y-2">
                <Button
                  variant={mode === 'vr' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleModeChange('vr')}
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  Virtual Reality
                </Button>
                <Button
                  variant={mode === 'ar' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleModeChange('ar')}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Augmented Reality
                </Button>
              </div>
            </Card>

            {/* Device Selection */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Device</h3>
              <div className="space-y-2">
                <Button
                  variant={device === 'headset' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleDeviceChange('headset')}
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  VR Headset
                </Button>
                <Button
                  variant={device === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleDeviceChange('mobile')}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile AR
                </Button>
                <Button
                  variant={device === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleDeviceChange('desktop')}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop AR
                </Button>
              </div>
            </Card>

            {/* Connection Status */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Connection Status</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              {isConnected && (
                <p className="text-xs text-muted-foreground mt-1">
                  {device === 'headset' ? 'VR Headset Ready' : 
                   device === 'mobile' ? 'Mobile AR Ready' : 'Desktop AR Ready'}
                </p>
              )}
            </Card>

            {/* Scene Selection */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Available Scenes</h3>
              <div className="space-y-2">
                {scenes.map((scene) => (
                  <Button
                    key={scene.id}
                    variant={currentScene === scene.id ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleSceneChange(scene.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{scene.name}</div>
                      <div className="text-xs text-muted-foreground">{scene.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {scene.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{scene.duration}</span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Panel - VR/AR Viewport */}
          <div className="flex-1 flex flex-col">
            {/* VR/AR Viewport */}
            <Card className="flex-1 p-4 mb-4">
              <div className="h-full bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border-2 border-dashed border-accent/30 flex items-center justify-center">
                {isConnected ? (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                      <Eye className="w-16 h-16 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{scenes[currentScene].name}</h3>
                    <p className="text-muted-foreground mb-4">{scenes[currentScene].description}</p>
                    <div className="flex items-center justify-center gap-4">
                      <Badge className="bg-accent/20 text-accent">
                        {scenes[currentScene].type}
                      </Badge>
                      <Badge variant="outline">
                        {scenes[currentScene].duration}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                      <Zap className="w-16 h-16 text-muted-foreground animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Connecting...</h3>
                    <p className="text-muted-foreground">Setting up your {mode.toUpperCase()} experience</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Controls */}
            {isConnected && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      className="rounded-full w-12 h-12"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadScene}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareScene}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VRARModal;
