import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Filter } from "lucide-react";

const stateData = [
  {
    id: "odisha",
    name: "Odisha",
    position: { top: "45%", left: "65%" },
    stats: { narcotics: 167, nbw: 112, convictions: 142, missing: 45 },
    color: "bg-gold",
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    position: { top: "35%", left: "68%" },
    stats: { narcotics: 203, nbw: 156, convictions: 178, missing: 52 },
    color: "bg-primary",
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    position: { top: "50%", left: "45%" },
    stats: { narcotics: 312, nbw: 267, convictions: 289, missing: 78 },
    color: "bg-accent",
  },
  {
    id: "karnataka",
    name: "Karnataka",
    position: { top: "58%", left: "48%" },
    stats: { narcotics: 198, nbw: 145, convictions: 167, missing: 43 },
    color: "bg-primary",
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    position: { top: "68%", left: "52%" },
    stats: { narcotics: 234, nbw: 189, convictions: 201, missing: 56 },
    color: "bg-accent",
  },
];

export const GISMapping = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const selectedStateData = stateData.find((s) => s.id === selectedState);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">GIS-Based Mapping</h1>
        <p className="text-muted-foreground">National crime performance visualization</p>
      </div>

      {/* Filter Options */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Category Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {["all", "narcotics", "nbw", "convictions", "missing"].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "neon-glow" : ""}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              India Map
            </CardTitle>
            <CardDescription>Hover over states to view statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[500px] bg-muted/10 rounded-lg border border-border flex items-center justify-center">
              {/* Simplified India Map Representation */}
              <div className="relative w-full h-full">
                {stateData.map((state) => (
                  <div
                    key={state.id}
                    className={`absolute w-12 h-12 rounded-full ${state.color} cursor-pointer hover:scale-125 transition-transform animate-glow flex items-center justify-center`}
                    style={state.position}
                    onMouseEnter={() => setSelectedState(state.id)}
                    onMouseLeave={() => setSelectedState(null)}
                  >
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                ))}
                
                {/* Central India Label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <h3 className="text-2xl font-bold text-muted-foreground/30">INDIA</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State Info Panel */}
        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle>
              {selectedStateData ? selectedStateData.name : "State Information"}
            </CardTitle>
            <CardDescription>
              {selectedStateData ? "Performance Statistics" : "Hover over a state to view data"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStateData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Narcotics Cases</span>
                  <Badge className="bg-primary/20 text-primary">
                    {selectedStateData.stats.narcotics}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">NBW Executed</span>
                  <Badge className="bg-accent/20 text-accent">
                    {selectedStateData.stats.nbw}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Convictions</span>
                  <Badge className="bg-gold/20 text-gold">
                    {selectedStateData.stats.convictions}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Missing Persons</span>
                  <Badge className="bg-destructive/20 text-destructive">
                    {selectedStateData.stats.missing}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Select a state to view detailed statistics</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
