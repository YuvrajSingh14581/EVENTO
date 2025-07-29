import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  height?: string;
  className?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  zoom = 15,
  markers = [],
  onLocationSelect,
  height = '400px',
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      // For demo purposes, we'll simulate Google Maps
      // In a real app, you would use the actual Google Maps API
      if (mapRef.current) {
        setIsLoaded(true);
        
        // Simulate map initialization
        const mockMap = {
          setCenter: (center: { lat: number; lng: number }) => {
            console.log('Map centered at:', center);
          },
          setZoom: (zoom: number) => {
            console.log('Map zoom set to:', zoom);
          }
        };
        
        setMap(mockMap as any);
      }
    };

    initMap();
  }, []);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onLocationSelect) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Simulate coordinate calculation
      const lat = center.lat + (y - rect.height / 2) * 0.0001;
      const lng = center.lng + (x - rect.width / 2) * 0.0001;
      
      onLocationSelect({
        lat,
        lng,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });
    }
  };

  if (!isLoaded) {
    return (
      <div 
        className={`bg-muted animate-pulse rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      className={`bg-muted rounded-lg relative overflow-hidden ${className}`}
      style={{ height }}
      onClick={handleMapClick}
    >
      {/* Mock map display */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Center marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        {/* Additional markers */}
        {markers.map((marker, index) => (
          <div 
            key={index}
            className="absolute w-4 h-4 bg-blue-500 rounded-full border border-white shadow-md"
            style={{
              top: `${50 + (marker.position.lat - center.lat) * 1000}%`,
              left: `${50 + (marker.position.lng - center.lng) * 1000}%`,
              transform: 'translate(-50%, -50%)'
            }}
            title={marker.title}
          />
        ))}
        
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow text-sm">
          📍 {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
        </div>
        
        {onLocationSelect && (
          <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow text-sm">
            Click to select location
          </div>
        )}
      </div>
    </div>
  );
};