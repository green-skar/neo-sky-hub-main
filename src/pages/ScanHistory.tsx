import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Building2, Download, Filter, Loader2, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { scanService } from "@/services/scans";
import MapView from "@/components/MapView";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MapMarker } from "@/types";

const ScanHistory = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [highlightedMarkerId, setHighlightedMarkerId] = useState<string | number | null>(null);
  const { toast } = useToast();

  const { data: scans, isLoading: scansLoading } = useQuery({
    queryKey: ['scans', 'history'],
    queryFn: () => scanService.getScanHistory(),
  });

  const { data: scanStats, isLoading: statsLoading } = useQuery({
    queryKey: ['scans', 'stats'],
    queryFn: () => scanService.getStatistics(),
  });

  const { data: mapMarkers, isLoading: mapLoading } = useQuery({
    queryKey: ['scans', 'map-markers'],
    queryFn: () => scanService.getMapMarkers(),
  });

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  const handleExport = () => {
    // Create CSV data
    const csvData = scans?.data?.data?.map(scan => ({
      time: new Date(scan.timestamp).toLocaleString(),
      location: scan.location,
      type: scan.type,
      status: scan.status,
      points: scan.points,
      brand: scan.details?.brand || 'N/A'
    })) || [];

    // Convert to CSV string
    const csvString = [
      ['Time', 'Location', 'Type', 'Status', 'Points', 'Brand'],
      ...csvData.map(row => [row.time, row.location, row.type, row.status, row.points, row.brand])
    ].map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleMarkerClick = (marker: MapMarker) => {
    if (marker.type === 'scan') {
      toast({
        title: "Scan Details",
        description: `${marker.title} - ${marker.description}`,
      });
    } else if (marker.type === 'sponsor') {
      toast({
        title: "Sponsor Location",
        description: `${marker.title} - ${marker.scanCount} scans recorded`,
      });
    }
  };

  const handleScanActivityClick = (scan: any) => {
    // Find the corresponding marker
    const correspondingMarker = mapMarkers?.data?.find(marker => 
      marker.title === scan.location && marker.type === 'scan'
    );
    
    if (correspondingMarker) {
      setHighlightedMarkerId(correspondingMarker.id);
      
      // Scroll to map section
      const mapElement = document.getElementById('scan-map');
      if (mapElement) {
        mapElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      
      toast({
        title: "Location Highlighted",
        description: `Map centered on ${scan.location}`,
      });
      
      // Clear highlight after 5 seconds
      setTimeout(() => {
        setHighlightedMarkerId(null);
      }, 5000);
    } else {
      toast({
        title: "Location Not Found",
        description: "This scan location is not available on the map",
        variant: "destructive",
      });
    }
  };

  // Filter scans based on current filters
  const filteredScans = scans?.data?.data?.filter(scan => {
    const typeMatch = filterType === 'all' || scan.type.toLowerCase() === filterType;
    const statusMatch = filterStatus === 'all' || scan.status === filterStatus;
    return typeMatch && statusMatch;
  }) || [];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-neon-blue neon-text-intense">Scan History</h1>
          <p className="text-muted-foreground">Timeline of all your QR/NFC interactions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-primary/30"
            onClick={handleFilter}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            className="border-primary/30"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">TOTAL SCANS</p>
          <p className="text-2xl font-bold text-primary neon-text-intense">{scanStats?.data?.totalScans || "Loading..."}</p>
        </Card>
        <Card className="p-4 border-accent/20">
          <p className="text-xs text-muted-foreground mb-1">THIS WEEK</p>
          <p className="text-2xl font-bold text-accent neon-text-intense">{scanStats?.data?.thisWeek || "Loading..."}</p>
        </Card>
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">UNIQUE LOCATIONS</p>
          <p className="text-2xl font-bold neon-text-intense">{scanStats?.data?.uniqueLocations || "Loading..."}</p>
        </Card>
        <Card className="p-4 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">SPONSORS</p>
          <p className="text-2xl font-bold neon-text-intense">{scanStats?.data?.sponsors || "Loading..."}</p>
        </Card>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4 border-primary/20">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Type</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Types</option>
                <option value="qr">QR Code</option>
                <option value="nfc">NFC</option>
                <option value="barcode">Barcode</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFilterType('all');
                  setFilterStatus('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Scan Timeline */}
      <Card className="p-6 card-glow glow-purple">
        <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {scansLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <div className="flex-1 grid md:grid-cols-4 gap-4">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            filteredScans.map((scan, index) => (
              <div
                key={scan.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                onClick={() => handleScanActivityClick(scan)}
              >
                {/* Timeline marker */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(0,217,255,0.5)]" />
                  {index !== filteredScans.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent mt-2" />
                  )}
                </div>

                {/* Scan Details */}
                <div className="flex-1 grid md:grid-cols-4 gap-4 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{new Date(scan.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(scan.timestamp).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-medium group-hover:text-primary transition-colors">{scan.location}</span>
                    </div>
                    <p className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">
                      Click to view on map
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{scan.details?.brand || 'N/A'}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {scan.type}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-end">
                    {scan.verified && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Map Integration */}
      <Card id="scan-map" className="p-6 border-primary/20 relative z-10 card-glow glow-cyan">
        <h3 className="text-lg font-bold mb-4">Scan Locations</h3>
        {mapLoading ? (
          <div className="h-64 rounded-lg bg-secondary/30 flex items-center justify-center border border-border/50">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-2 animate-spin" />
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <MapView 
              markers={mapMarkers?.data || []}
              height="400px"
              className="rounded-lg"
              onMarkerClick={handleMarkerClick}
              highlightedMarkerId={highlightedMarkerId}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ScanHistory;
