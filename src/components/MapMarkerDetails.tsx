import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  Building2, 
  Zap, 
  Shield, 
  Calendar,
  Navigation,
  QrCode,
  Smartphone,
  Scan,
  ExternalLink,
  Copy,
  Share2
} from 'lucide-react';
import { MapMarker } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface MapMarkerDetailsProps {
  marker: MapMarker | null;
  isOpen: boolean;
  onClose: () => void;
}

const MapMarkerDetails = ({ marker, isOpen, onClose }: MapMarkerDetailsProps) => {
  const { toast } = useToast();

  if (!marker) return null;

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      full: date.toLocaleString()
    };
  };

  const getScanTypeIcon = (scanType?: string) => {
    switch (scanType) {
      case 'QR Scan':
        return <QrCode className="w-4 h-4" />;
      case 'NFC Tap':
        return <Smartphone className="w-4 h-4" />;
      case 'Barcode Scan':
        return <Scan className="w-4 h-4" />;
      default:
        return <Scan className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCopyLocation = () => {
    const locationText = `${marker.title} (${marker.lat}, ${marker.lng})`;
    navigator.clipboard.writeText(locationText);
    toast({
      title: "Location Copied",
      description: "Location coordinates copied to clipboard",
    });
  };

  const handleShareLocation = () => {
    const shareText = `Check out this location: ${marker.title}`;
    const shareUrl = `https://maps.google.com/?q=${marker.lat},${marker.lng}`;
    
    if (navigator.share) {
      navigator.share({
        title: marker.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
      toast({
        title: "Location Shared",
        description: "Location link copied to clipboard",
      });
    }
  };

  const handleOpenInMaps = () => {
    const mapsUrl = `https://maps.google.com/?q=${marker.lat},${marker.lng}`;
    window.open(mapsUrl, '_blank');
  };

  const timestamp = formatTimestamp(marker.timestamp);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {marker.type === 'scan' ? (
              <MapPin className="w-5 h-5 text-blue-500" />
            ) : marker.type === 'sponsor' ? (
              <Building2 className="w-5 h-5 text-orange-500" />
            ) : (
              <Shield className="w-5 h-5 text-purple-500" />
            )}
            {marker.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location Name</label>
                  <p className="text-sm font-semibold">{marker.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="text-sm font-semibold capitalize">{marker.type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Latitude</label>
                  <p className="text-sm font-mono">{marker.lat.toFixed(6)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Longitude</label>
                  <p className="text-sm font-mono">{marker.lng.toFixed(6)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm">{marker.description}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyLocation}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Coordinates
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareLocation}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Location
                </Button>
                <Button variant="outline" size="sm" onClick={handleOpenInMaps}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Maps
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scan Details (for scan markers) */}
          {marker.type === 'scan' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {getScanTypeIcon(marker.scanType)}
                  Scan Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Scan Type</label>
                    <p className="text-sm font-semibold">{marker.scanType || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={getStatusColor(marker.status)}>
                      {marker.status || 'Unknown'}
                    </Badge>
                  </div>
                </div>

                {marker.points && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Points Earned</label>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-lg font-semibold text-yellow-600">+{marker.points} points</span>
                    </div>
                  </div>
                )}

                {marker.timestamp && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Scan Time</label>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{timestamp.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{timestamp.time}</span>
                      </div>
                    </div>
                  </div>
                )}

                {marker.brand && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Brand/Partner</label>
                    <p className="text-sm font-semibold">{marker.brand}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sponsor Details (for sponsor markers) */}
          {marker.type === 'sponsor' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Sponsor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Partner Name</label>
                    <p className="text-sm font-semibold">{marker.brand || marker.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Scan Count</label>
                    <p className="text-sm font-semibold">{marker.scanCount || 0} scans</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{marker.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Partner Type</label>
                  <Badge variant="secondary">Official Partner</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Marker ID</span>
                <span className="text-sm font-mono">{marker.id}</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                <span className="text-sm">{timestamp.full}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapMarkerDetails;
