import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Shield, 
  Users, 
  Activity, 
  AlertCircle,
  TrendingUp,
  Navigation,
  Eye
} from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom police icon
const policeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzI1NjNlYiIvPgo8cGF0aCBkPSJNMTYgN2M0LjQxIDAgOCAzLjU5IDggOHMtMy41OSA4LTggOC04LTMuNTktOC04IDMuNTktOCA4LTh6IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTYgMTNjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMtMy0xLjM0LTMtMyAxLjM0LTMgMy0zeiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowSize: [41, 41]
});

// Indian cities with coordinates
const indianCities = [
  { name: "New Delhi", lat: 28.6139, lng: 77.2090, officers: 245, incidents: 12, status: "active" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, officers: 320, incidents: 8, status: "active" },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, officers: 180, incidents: 5, status: "active" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, officers: 195, incidents: 7, status: "active" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, officers: 210, incidents: 15, status: "busy" },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, officers: 165, incidents: 6, status: "active" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, officers: 140, incidents: 4, status: "active" },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, officers: 155, incidents: 9, status: "active" },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, officers: 125, incidents: 3, status: "quiet" },
  { name: "Surat", lat: 21.1702, lng: 72.8311, officers: 110, incidents: 2, status: "quiet" }
];

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const GISMapping = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'quiet': return '#6b7280';
      default: return '#10b981';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>;
      case 'busy': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Busy</Badge>;
      case 'quiet': return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">Quiet</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const handleCityClick = (city: typeof indianCities[0]) => {
    setSelectedCity(city.name);
    setMapCenter([city.lat, city.lng]);
    setMapZoom(10);
  };

  const totalOfficers = indianCities.reduce((sum, city) => sum + city.officers, 0);
  const totalIncidents = indianCities.reduce((sum, city) => sum + city.incidents, 0);
  const activeCities = indianCities.filter(city => city.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            <MapPin className="h-4 w-4 mr-2" />
            GIS-Based Crime Mapping
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Real-Time Crime Analytics
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interactive mapping system providing real-time insights into law enforcement activities 
            across India's major cities with advanced geospatial analytics.
          </p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{totalOfficers}</div>
                <div className="text-sm text-muted-foreground">Active Officers</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="text-2xl font-bold text-red-400 mb-1">{totalIncidents}</div>
                <div className="text-sm text-muted-foreground">Active Incidents</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">{activeCities}</div>
                <div className="text-sm text-muted-foreground">Active Cities</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Response Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Card className="glass-card overflow-hidden">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Interactive Crime Map</CardTitle>
                  <CardDescription>
                    Real-time law enforcement data visualization across India
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={showHeatmap ? "bg-primary/20 text-primary" : ""}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Heatmap
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMapCenter([20.5937, 78.9629]);
                      setMapZoom(5);
                      setSelectedCity(null);
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Reset View
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] relative">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-lg"
                >
                  <MapController center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {indianCities.map((city, index) => (
                    <div key={city.name}>
                      <Marker
                        position={[city.lat, city.lng]}
                        icon={policeIcon}
                        eventHandlers={{
                          click: () => handleCityClick(city),
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-lg mb-2">{city.name}</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Officers:</span>
                                <Badge variant="outline" className="border-primary/50 text-primary">
                                  {city.officers}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Incidents:</span>
                                <Badge variant="outline" className="border-red-500/50 text-red-400">
                                  {city.incidents}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                {getStatusBadge(city.status)}
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                      
                      {showHeatmap && (
                        <Circle
                          center={[city.lat, city.lng]}
                          radius={city.incidents * 1000}
                          pathOptions={{
                            fillColor: getStatusColor(city.status),
                            fillOpacity: 0.3,
                            color: getStatusColor(city.status),
                            opacity: 0.5,
                            weight: 2
                          }}
                        />
                      )}
                    </div>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* City List */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>City Overview</CardTitle>
              <CardDescription>
                Click on any city to focus the map view
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indianCities.map((city) => (
                  <div
                    key={city.name}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                      selectedCity === city.name 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleCityClick(city)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{city.name}</h3>
                      {getStatusBadge(city.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Officers:</span>
                        <div className="font-semibold text-primary">{city.officers}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Incidents:</span>
                        <div className="font-semibold text-red-400">{city.incidents}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              GIS Mapping Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced geospatial analytics for enhanced law enforcement capabilities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Real-Time Tracking</h3>
                <p className="text-sm text-muted-foreground">Live location tracking of officers and vehicles</p>
              </CardContent>
            </Card>
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <Activity className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Crime Heatmaps</h3>
                <p className="text-sm text-muted-foreground">Visual crime density analysis across regions</p>
              </CardContent>
            </Card>
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Resource Allocation</h3>
                <p className="text-sm text-muted-foreground">Optimal deployment of law enforcement resources</p>
              </CardContent>
            </Card>
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Predictive Analytics</h3>
                <p className="text-sm text-muted-foreground">AI-powered crime prediction and prevention</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GISMapping;