import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { MapMarker } from '@/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Clock, Building2, Zap, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import MapMarkerDetails from './MapMarkerDetails';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different scan types
const createCustomIcon = (type: string, color: string) => {
  const iconHtml = `
    <div style="
      background: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 0 15px ${color}80;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">
        ${type === 'QR Scan' ? 'QR' : type === 'NFC Tap' ? 'NFC' : 'SC'}
      </div>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

interface MapViewProps {
  markers: MapMarker[];
  center?: LatLngTuple;
  zoom?: number;
  height?: string;
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  highlightedMarkerId?: string | number;
  onMapReady?: () => void;
}

const MapView = ({ 
  markers, 
  center = [52.3676, 4.9041] as LatLngTuple, // Amsterdam coordinates
  zoom = 10,
  height = "400px",
  className = "",
  onMarkerClick,
  highlightedMarkerId,
  onMapReady
}: MapViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate map center based on most recent scan marker
  const mapCenter = (() => {
    if (markers.length === 0) return center;
    
    // Find the most recent scan marker (by timestamp)
    const scanMarkers = markers.filter(marker => marker.type === 'scan');
    if (scanMarkers.length > 0) {
      const mostRecentScan = scanMarkers.reduce((latest, current) => {
        const latestTime = new Date(latest.timestamp || 0).getTime();
        const currentTime = new Date(current.timestamp || 0).getTime();
        return currentTime > latestTime ? current : latest;
      });
      return [mostRecentScan.lat, mostRecentScan.lng] as LatLngTuple;
    }
    
    // Fallback to average of all markers
    return [
      markers.reduce((sum, marker) => sum + marker.lat, 0) / markers.length,
      markers.reduce((sum, marker) => sum + marker.lng, 0) / markers.length
    ] as LatLngTuple;
  })();

  // MapController component to handle programmatic map control
  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      if (highlightedMarkerId && markers.length > 0) {
        const targetMarker = markers.find(marker => marker.id === highlightedMarkerId);
        if (targetMarker) {
          // Center map on the highlighted marker
          map.setView([targetMarker.lat, targetMarker.lng], 15);
          
          // Open popup for the highlighted marker
          setTimeout(() => {
            const markerElement = document.querySelector(`[data-marker-id="${targetMarker.id}"]`);
            if (markerElement) {
              (markerElement as any)._leaflet_id && map.openPopup(
                L.popup().setLatLng([targetMarker.lat, targetMarker.lng]).setContent(`
                  <div class="p-3 min-w-[250px]">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: ${getMarkerColor(targetMarker)}">
                        ${targetMarker.type === 'scan' ? '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/></svg>' : '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"/></svg>'}
                      </div>
                      <div class="flex-1">
                        <h3 class="font-semibold text-sm mb-1">${targetMarker.title}</h3>
                        <p class="text-xs text-muted-foreground mb-2">${targetMarker.description}</p>
                        <div class="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                          📍 Highlighted Location
                        </div>
                      </div>
                    </div>
                  </div>
                `)
              );
            }
          }, 500);
        }
      }
    }, [highlightedMarkerId, markers, map]);
    
    return null;
  };

  useEffect(() => {
    // Set loading timeout
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Set error timeout
    const errorTimer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 10000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(errorTimer);
    };
  }, [isLoading]);

  const getMarkerIcon = (marker: MapMarker) => {
    if (marker.type === 'scan') {
      // Determine scan type from description
      const isQR = marker.description?.includes('QR') || marker.description?.includes('QR Scan');
      const isNFC = marker.description?.includes('NFC') || marker.description?.includes('NFC Tap');
      
      if (isQR) {
        return createCustomIcon('QR Scan', '#3b82f6'); // Blue for QR scans
      } else if (isNFC) {
        return createCustomIcon('NFC Tap', '#10b981'); // Green for NFC taps
      } else {
        return createCustomIcon('Scan', '#8b5cf6'); // Purple for other scans
      }
    } else if (marker.type === 'sponsor') {
      return createCustomIcon('Sponsor', '#f59e0b'); // Orange for sponsors
    } else {
      return createCustomIcon('Location', '#6b7280'); // Gray for other locations
    }
  };

  const getMarkerColor = (marker: MapMarker) => {
    if (marker.type === 'scan') {
      const isQR = marker.description?.includes('QR') || marker.description?.includes('QR Scan');
      const isNFC = marker.description?.includes('NFC') || marker.description?.includes('NFC Tap');
      
      if (isQR) return '#3b82f6';
      if (isNFC) return '#10b981';
      return '#8b5cf6';
    } else if (marker.type === 'sponsor') {
      return '#f59e0b';
    } else {
      return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Unknown time';
    return new Date(timestamp).toLocaleString();
  };

  const handleViewDetails = (marker: MapMarker) => {
    setSelectedMarker(marker);
    setShowDetails(true);
    
    // Close any open popups on the map
    setTimeout(() => {
      const mapElement = document.querySelector('.leaflet-map-pane');
      if (mapElement) {
        const popups = mapElement.querySelectorAll('.leaflet-popup');
        popups.forEach(popup => {
          const closeButton = popup.querySelector('.leaflet-popup-close-button');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
        });
      }
    }, 100);
  };

  return (
    <div className={`w-full relative ${className}`} style={{ height, zIndex: 1 }}>
      {isLoading ? (
        <div className="w-full h-full bg-secondary/30 rounded-lg flex items-center justify-center border border-border/50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-3 animate-spin" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      ) : hasError ? (
        <div className="w-full h-full bg-secondary/30 rounded-lg flex items-center justify-center border border-border/50">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">Map failed to load</p>
            <p className="text-xs text-muted-foreground">Please check your internet connection</p>
          </div>
        </div>
      ) : (
        <>
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
            className="rounded-lg"
            zoomControl={true}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            dragging={true}
            attributionControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              maxZoom={20}
              tileSize={256}
              zoomOffset={0}
              subdomains={['a', 'b', 'c', 'd']}
            />
            <MapController />
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={getMarkerIcon(marker)}
                eventHandlers={{
                  click: () => {
                    if (onMarkerClick) {
                      onMarkerClick(marker);
                    }
                  }
                }}
              >
                <Popup className="custom-popup" maxWidth={300}>
                  <div className="p-3 min-w-[250px]">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: getMarkerColor(marker) }}
                      >
                        {marker.type === 'scan' ? (
                          <MapPin className="w-4 h-4 text-white" />
                        ) : marker.type === 'sponsor' ? (
                          <Building2 className="w-4 h-4 text-white" />
                        ) : (
                          <Shield className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{marker.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{marker.description}</p>
                        
                        {/* Scan Details */}
                        {marker.type === 'scan' && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {formatTimestamp(marker.timestamp)}
                              </span>
                            </div>
                            
                            {marker.points && (
                              <div className="flex items-center gap-2 text-xs">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                <span className="text-yellow-600 font-medium">
                                  +{marker.points} points
                                </span>
                              </div>
                            )}
                            
                            {marker.status && (
                              <div className="flex items-center gap-2">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  marker.status === 'success' 
                                    ? 'bg-green-100 text-green-800' 
                                    : marker.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {marker.status}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Sponsor Details */}
                        {marker.type === 'sponsor' && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <Building2 className="w-3 h-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Partner Location
                              </span>
                            </div>
                            
                            {marker.scanCount && (
                              <div className="flex items-center gap-2 text-xs">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {marker.scanCount} scans recorded
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Action Button */}
                        <button 
                          className="mt-3 w-full bg-primary/10 text-primary hover:bg-primary/20 text-xs py-2 px-3 rounded-md transition-colors"
                          onClick={() => handleViewDetails(marker)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Map Legend - positioned relative to map container */}
          <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-2xl z-[1000] max-w-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <h4 className="font-semibold text-sm text-foreground">Scan Types</h4>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 group">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all"></div>
                <span className="text-xs font-medium text-foreground group-hover:text-blue-400 transition-colors">QR Scans</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-all"></div>
                <span className="text-xs font-medium text-foreground group-hover:text-green-400 transition-colors">NFC Taps</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-4 h-4 rounded-full bg-purple-500 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all"></div>
                <span className="text-xs font-medium text-foreground group-hover:text-purple-400 transition-colors">Other Scans</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all"></div>
                <span className="text-xs font-medium text-foreground group-hover:text-orange-400 transition-colors">Sponsor Locations</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total Locations</span>
                <span className="font-semibold text-primary">{markers.length}</span>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Map Marker Details Modal */}
      <MapMarkerDetails
        marker={selectedMarker}
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedMarker(null);
        }}
      />
    </div>
  );
};

export default MapView;
