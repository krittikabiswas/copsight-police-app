import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/leaflet-custom.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Filter, Layers, Navigation, TrendingUp, AlertCircle } from "lucide-react";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Crime data with geolocation (Indian states and major cities)
const crimeData = [
  // Odisha
  { id: 1, lat: 20.2961, lng: 85.8245, type: "narcotics", cases: 45, city: "Bhubaneswar", state: "Odisha" },
  { id: 2, lat: 21.2514, lng: 81.6296, type: "nbw", cases: 32, city: "Rourkela", state: "Odisha" },
  { id: 3, lat: 20.4625, lng: 85.8830, type: "conviction", cases: 28, city: "Cuttack", state: "Odisha" },
  { id: 4, lat: 19.3150, lng: 84.7941, type: "missing", cases: 12, city: "Berhampur", state: "Odisha" },

  // West Bengal
  { id: 5, lat: 22.5726, lng: 88.3639, type: "narcotics", cases: 78, city: "Kolkata", state: "West Bengal" },
  { id: 6, lat: 22.8056, lng: 88.3628, type: "nbw", cases: 52, city: "Barrackpur", state: "West Bengal" },
  { id: 7, lat: 23.5204, lng: 87.3119, type: "conviction", cases: 41, city: "Asansol", state: "West Bengal" },
  { id: 8, lat: 26.7271, lng: 88.3953, type: "missing", cases: 18, city: "Siliguri", state: "West Bengal" },

  // Maharashtra
  { id: 9, lat: 19.0760, lng: 72.8777, type: "narcotics", cases: 95, city: "Mumbai", state: "Maharashtra" },
  { id: 10, lat: 18.5204, lng: 73.8567, type: "nbw", cases: 67, city: "Pune", state: "Maharashtra" },
  { id: 11, lat: 19.8762, lng: 75.3433, type: "conviction", cases: 53, city: "Aurangabad", state: "Maharashtra" },
  { id: 12, lat: 21.1458, lng: 79.0882, type: "missing", cases: 22, city: "Nagpur", state: "Maharashtra" },

  // Karnataka
  { id: 13, lat: 12.9716, lng: 77.5946, type: "narcotics", cases: 62, city: "Bangalore", state: "Karnataka" },
  { id: 14, lat: 15.3647, lng: 75.1240, type: "nbw", cases: 38, city: "Hubli", state: "Karnataka" },
  { id: 15, lat: 12.2958, lng: 76.6394, type: "conviction", cases: 44, city: "Mysore", state: "Karnataka" },
  { id: 16, lat: 13.3409, lng: 74.7421, type: "missing", cases: 15, city: "Mangalore", state: "Karnataka" },

  // Tamil Nadu
  { id: 17, lat: 13.0827, lng: 80.2707, type: "narcotics", cases: 71, city: "Chennai", state: "Tamil Nadu" },
  { id: 18, lat: 11.0168, lng: 76.9558, type: "nbw", cases: 49, city: "Coimbatore", state: "Tamil Nadu" },
  { id: 19, lat: 9.9252, lng: 78.1198, type: "conviction", cases: 56, city: "Madurai", state: "Tamil Nadu" },
  { id: 20, lat: 10.7905, lng: 78.7047, type: "missing", cases: 19, city: "Trichy", state: "Tamil Nadu" },

  // Delhi
  { id: 21, lat: 28.7041, lng: 77.1025, type: "narcotics", cases: 88, city: "New Delhi", state: "Delhi" },
  { id: 22, lat: 28.6139, lng: 77.2090, type: "nbw", cases: 61, city: "South Delhi", state: "Delhi" },
  { id: 23, lat: 28.7196, lng: 77.0369, type: "conviction", cases: 74, city: "North Delhi", state: "Delhi" },

  // Rajasthan
  { id: 24, lat: 26.9124, lng: 75.7873, type: "narcotics", cases: 43, city: "Jaipur", state: "Rajasthan" },
  { id: 25, lat: 26.4499, lng: 73.1132, type: "nbw", cases: 29, city: "Jodhpur", state: "Rajasthan" },

  // Gujarat
  { id: 26, lat: 23.0225, lng: 72.5714, type: "narcotics", cases: 54, city: "Ahmedabad", state: "Gujarat" },
  { id: 27, lat: 21.1702, lng: 72.8311, type: "conviction", cases: 39, city: "Surat", state: "Gujarat" },

  // Kerala
  { id: 28, lat: 8.5241, lng: 76.9366, type: "narcotics", cases: 36, city: "Trivandrum", state: "Kerala" },
  { id: 29, lat: 9.9312, lng: 76.2673, type: "missing", cases: 13, city: "Kochi", state: "Kerala" },
];

// State-wise statistics
const stateStats = [
  { name: "Odisha", narcotics: 167, nbw: 112, convictions: 142, missing: 45, total: 466 },
  { name: "West Bengal", narcotics: 203, nbw: 156, convictions: 178, missing: 52, total: 589 },
  { name: "Maharashtra", narcotics: 312, nbw: 267, convictions: 289, missing: 78, total: 946 },
  { name: "Karnataka", narcotics: 198, nbw: 145, convictions: 167, missing: 43, total: 553 },
  { name: "Tamil Nadu", narcotics: 234, nbw: 189, convictions: 201, missing: 56, total: 680 },
  { name: "Delhi", narcotics: 288, nbw: 201, convictions: 234, missing: 67, total: 790 },
  { name: "Rajasthan", narcotics: 156, nbw: 98, convictions: 134, missing: 38, total: 426 },
  { name: "Gujarat", narcotics: 189, nbw: 123, convictions: 167, missing: 42, total: 521 },
  { name: "Kerala", narcotics: 134, nbw: 87, convictions: 112, missing: 34, total: 367 },
];

export const GISMapping = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [mapView, setMapView] = useState<"markers" | "heatmap">("markers");
  const [selectedCrime, setSelectedCrime] = useState<typeof crimeData[0] | null>(null);

  const selectedStateData = stateStats.find((s) => s.name === selectedState);

  // Get crime type color
  const getCrimeColor = (type: string) => {
    switch (type) {
      case "narcotics": return "#059669";
      case "nbw": return "#3B82F6";
      case "conviction": return "#EAB308";
      case "missing": return "#DC2626";
      default: return "#6B7280";
    }
  };

  // Get crime type icon
  const getCrimeIcon = (type: string) => {
    const color = getCrimeColor(type);
    return L.divIcon({
      className: 'crime-marker',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map centered on India
    const map = L.map(mapContainerRef.current).setView([22.5937, 78.9629], 5);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Create markers layer
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Add legend using custom control
    const LegendControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: function () {
        const div = L.DomUtil.create('div', 'map-legend');
        div.innerHTML = `
          <h4>Crime Categories</h4>
          <div class="map-legend-item">
            <div class="map-legend-color" style="background-color: #059669;"></div>
            <span>Narcotics</span>
          </div>
          <div class="map-legend-item">
            <div class="map-legend-color" style="background-color: #3B82F6;"></div>
            <span>NBW</span>
          </div>
          <div class="map-legend-item">
            <div class="map-legend-color" style="background-color: #EAB308;"></div>
            <span>Convictions</span>
          </div>
          <div class="map-legend-item">
            <div class="map-legend-color" style="background-color: #DC2626;"></div>
            <span>Missing Persons</span>
          </div>
        `;
        return div;
      }
    });

    new LegendControl().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers based on filter
  useEffect(() => {
    if (!markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Filter data
    const filteredData = activeFilter === "all"
      ? crimeData
      : crimeData.filter(crime => crime.type === activeFilter);

    // Add markers
    filteredData.forEach(crime => {
      const marker = L.marker([crime.lat, crime.lng], {
        icon: getCrimeIcon(crime.type)
      });

      marker.bindPopup(`
        <div style="min-width: 180px;">
          <h3 style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">${crime.city}</h3>
          <p style="font-size: 0.875rem; color: hsl(var(--muted-foreground)); margin-bottom: 0.5rem;">${crime.state}</p>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
            <span style="font-size: 0.875rem;">Type:</span>
            <span style="font-weight: 600; text-transform: capitalize; font-size: 0.875rem;">${crime.type}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 0.875rem;">Cases:</span>
            <span style="font-weight: 700; color: ${getCrimeColor(crime.type)}; font-size: 0.875rem;">${crime.cases}</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedCrime(crime);
        setSelectedState(crime.state);
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [activeFilter]);

  // Get total cases by type
  const getTotalByType = (type: string) => {
    return crimeData
      .filter(crime => crime.type === type)
      .reduce((sum, crime) => sum + crime.cases, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">GIS-Based Crime Mapping</h1>
        <p className="text-muted-foreground">Interactive visualization of crime data across India</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-emerald-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
              Narcotics Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{getTotalByType("narcotics")}</div>
            <p className="text-xs text-muted-foreground mt-1">Total across all states</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              NBW Executed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{getTotalByType("nbw")}</div>
            <p className="text-xs text-muted-foreground mt-1">Non-bailable warrants</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              Convictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{getTotalByType("conviction")}</div>
            <p className="text-xs text-muted-foreground mt-1">Successful prosecutions</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-red-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              Missing Persons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getTotalByType("missing")}</div>
            <p className="text-xs text-muted-foreground mt-1">Active cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Options */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Crime Category Filters
          </CardTitle>
          <CardDescription>Select a category to filter map markers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "all", label: "All Categories", icon: Layers },
              { id: "narcotics", label: "Narcotics", icon: AlertCircle },
              { id: "nbw", label: "NBW", icon: Navigation },
              { id: "conviction", label: "Convictions", icon: TrendingUp },
              { id: "missing", label: "Missing Persons", icon: MapPin }
            ].map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter.id)}
                  className={activeFilter === filter.id ? "neon-glow" : ""}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Interactive Crime Map
            </CardTitle>
            <CardDescription>
              Click on markers to view detailed crime statistics • {crimeData.filter(c => activeFilter === "all" || c.type === activeFilter).length} locations shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={mapContainerRef}
              className="w-full h-[500px] rounded-lg border border-border"
            />
          </CardContent>
        </Card>

        {/* Info Panel */}
        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle>
              {selectedCrime ? selectedCrime.city : selectedState || "Location Information"}
            </CardTitle>
            <CardDescription>
              {selectedCrime ? `${selectedCrime.state} • ${selectedCrime.type.toUpperCase()}` : "Click a marker to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCrime ? (
              <div className="space-y-4">
                <div className="p-4 bg-card/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Crime Type</span>
                    <Badge
                      className="capitalize"
                      style={{
                        backgroundColor: `${getCrimeColor(selectedCrime.type)}20`,
                        color: getCrimeColor(selectedCrime.type),
                        border: `1px solid ${getCrimeColor(selectedCrime.type)}50`
                      }}
                    >
                      {selectedCrime.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Cases</span>
                    <span className="text-2xl font-bold" style={{ color: getCrimeColor(selectedCrime.type) }}>
                      {selectedCrime.cases}
                    </span>
                  </div>
                </div>

                {selectedStateData && (
                  <>
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-semibold mb-3">{selectedState} Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-emerald-600/10 rounded-lg">
                          <span className="text-sm text-muted-foreground">Narcotics Cases</span>
                          <Badge className="bg-emerald-600/20 text-emerald-600 border-emerald-600/30">
                            {selectedStateData.narcotics}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                          <span className="text-sm text-muted-foreground">NBW Executed</span>
                          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                            {selectedStateData.nbw}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg">
                          <span className="text-sm text-muted-foreground">Convictions</span>
                          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                            {selectedStateData.convictions}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-600/10 rounded-lg">
                          <span className="text-sm text-muted-foreground">Missing Persons</span>
                          <Badge className="bg-red-600/20 text-red-600 border-red-600/30">
                            {selectedStateData.missing}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">Click on a map marker to view detailed crime statistics</p>
                <p className="text-xs mt-2">Or select a filter to view specific crime types</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* State-wise Statistics Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            State-wise Performance Overview
          </CardTitle>
          <CardDescription>Comprehensive statistics across all major states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">State</th>
                  <th className="text-right p-3 font-semibold">Narcotics</th>
                  <th className="text-right p-3 font-semibold">NBW</th>
                  <th className="text-right p-3 font-semibold">Convictions</th>
                  <th className="text-right p-3 font-semibold">Missing</th>
                  <th className="text-right p-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {stateStats
                  .sort((a, b) => b.total - a.total)
                  .map((state, index) => (
                    <tr
                      key={state.name}
                      className={`border-b border-border/50 hover:bg-accent/5 cursor-pointer transition-colors ${selectedState === state.name ? 'bg-accent/10' : ''
                        }`}
                      onClick={() => setSelectedState(state.name)}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{state.name}</span>
                          {index < 3 && (
                            <Badge variant="gold" className="text-xs">
                              Top {index + 1}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-right p-3 text-emerald-600 font-semibold">{state.narcotics}</td>
                      <td className="text-right p-3 text-blue-500 font-semibold">{state.nbw}</td>
                      <td className="text-right p-3 text-yellow-500 font-semibold">{state.convictions}</td>
                      <td className="text-right p-3 text-red-600 font-semibold">{state.missing}</td>
                      <td className="text-right p-3 font-bold">{state.total}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
