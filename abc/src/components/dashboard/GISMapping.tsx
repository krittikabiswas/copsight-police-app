import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/leaflet-custom.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Filter, Target, TrendingUp, AlertCircle, Gauge, Info } from "lucide-react";
import { AnalysisPerformanceBand, useAnalysisContext } from "@/contexts/AnalysisContext";

// Normalize the default marker assets for Leaflet when bundled with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const BAND_METADATA: Record<AnalysisPerformanceBand, { label: string; color: string; description: string }> = {
  high: {
    label: "High Performance",
    color: "#16a34a",
    description: "On pace with the crime reduction directives and exceeding arrest KPIs.",
  },
  moderate: {
    label: "On Track",
    color: "#facc15",
    description: "Maintaining expected closure rates with room for tactical improvement.",
  },
  watch: {
    label: "Needs Support",
    color: "#ef4444",
    description: "Underperforming against baselines; requires supervisory follow-up.",
  },
};

const formatEfficiency = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)}%` : "–";

export const GISMapping = () => {
  const { mapPoints, datasetName } = useAnalysisContext();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<AnalysisPerformanceBand | "all">("all");
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const enrichedPoints = useMemo(() => {
    return mapPoints.map((point, index) => {
      const normalizedEff = typeof point.efficiency === "number" ? point.efficiency : 0;
      const derivedBand: AnalysisPerformanceBand =
        point.band ?? (normalizedEff >= 85 ? "high" : normalizedEff >= 75 ? "moderate" : "watch");
      return {
        ...point,
        efficiency: normalizedEff,
        band: derivedBand,
        _internalId: `${point.district}-${point.month ?? index}`,
      };
    });
  }, [mapPoints]);

  const selectedPoint = useMemo(
    () => enrichedPoints.find((point) => point._internalId === selectedPointId) ?? null,
    [enrichedPoints, selectedPointId],
  );

  const filteredPoints = useMemo(() => {
    if (activeFilter === "all") {
      return enrichedPoints;
    }
    return enrichedPoints.filter((point) => point.band === activeFilter);
  }, [activeFilter, enrichedPoints]);

  const averageEfficiency = useMemo(() => {
    if (enrichedPoints.length === 0) {
      return 0;
    }
    const total = enrichedPoints.reduce((sum, point) => sum + (point.efficiency ?? 0), 0);
    return total / enrichedPoints.length;
  }, [enrichedPoints]);

  const distribution = useMemo(() => ({
    high: enrichedPoints.filter((point) => point.band === "high").length,
    moderate: enrichedPoints.filter((point) => point.band === "moderate").length,
    watch: enrichedPoints.filter((point) => point.band === "watch").length,
  }), [enrichedPoints]);

  const extremes = useMemo(() => {
    if (enrichedPoints.length === 0) {
      return { best: null, worst: null };
    }
    const sorted = [...enrichedPoints].sort((a, b) => b.efficiency - a.efficiency);
    return {
      best: sorted[0] ?? null,
      worst: sorted[sorted.length - 1] ?? null,
    };
  }, [enrichedPoints]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const mapInstance = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
    });
    mapRef.current = mapInstance;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(mapInstance);

    const markersLayer = L.layerGroup().addTo(mapInstance);
    markersLayerRef.current = markersLayer;

    const LegendControl = L.Control.extend({
      options: { position: "bottomright" },
      onAdd: () => {
        const container = L.DomUtil.create("div", "map-legend");
        container.innerHTML = `
          <h4>Performance Bands</h4>
          ${Object.entries(BAND_METADATA)
            .map(
              ([band, meta]) => `
                <div class="map-legend-item">
                  <div class="map-legend-color" style="background-color: ${meta.color}"></div>
                  <span>${meta.label}</span>
                </div>
              `,
            )
            .join("")}
        `;
        return container;
      },
    });

    new LegendControl().addTo(mapInstance);

    return () => {
      mapInstance.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!markersLayerRef.current) {
      return;
    }

    markersLayerRef.current.clearLayers();

    if (filteredPoints.length === 0) {
      return;
    }

    filteredPoints.forEach((point) => {
      const meta = BAND_METADATA[point.band];
      const marker = L.marker([point.latitude, point.longitude], {
        icon: L.divIcon({
          className: "crime-marker",
          html: `<div style="background-color: ${meta.color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      });

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">${point.district}</h3>
          <p style="font-size: 0.85rem; color: hsl(var(--muted-foreground)); margin-bottom: 0.75rem;">${point.state ?? "Unknown State"}</p>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
            <span style="font-size: 0.85rem;">Efficiency</span>
            <strong style="font-size: 0.95rem; color: ${meta.color};">${formatEfficiency(point.efficiency)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
            <span style="font-size: 0.85rem;">Performance Band</span>
            <span style="font-size: 0.85rem; font-weight: 600;">${meta.label}</span>
          </div>
          ${point.month ? `<div style="font-size: 0.75rem; color: hsl(var(--muted-foreground));">Month: ${point.month}</div>` : ""}
        </div>
      `);

      marker.on("click", () => setSelectedPointId(point._internalId));
      marker.addTo(markersLayerRef.current!);
    });

    if (mapRef.current) {
      const bounds = L.latLngBounds(filteredPoints.map((point) => [point.latitude, point.longitude] as [number, number]));
      mapRef.current.fitBounds(bounds, { padding: [32, 32] });
    }
  }, [filteredPoints]);

  useEffect(() => {
    if (!selectedPointId) {
      return;
    }
    if (!enrichedPoints.some((point) => point._internalId === selectedPointId)) {
      setSelectedPointId(null);
    }
  }, [enrichedPoints, selectedPointId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">GIS-Based Performance Mapping</h1>
        <p className="text-muted-foreground">
          Live geospatial overlay powered by the current analysis dataset.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              Average Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatEfficiency(averageEfficiency)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {enrichedPoints.length || "no"} mapped districts
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-emerald-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              High Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{distribution.high}</div>
            <p className="text-xs text-muted-foreground mt-1">Exceeding deployment benchmarks</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Watchlist Districts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{distribution.watch}</div>
            <p className="text-xs text-muted-foreground mt-1">Prioritize ground interventions</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Dataset in View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-primary/90">
              {datasetName ? datasetName.replace(/_/g, " ") : "Upload a dataset"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Refresh via Analysis tab to update layers</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Performance Filters
          </CardTitle>
          <CardDescription>Highlight districts by their efficiency band</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {["all", "high", "moderate", "watch"].map((value) => {
            const isAll = value === "all";
            const band = value as AnalysisPerformanceBand | "all";
            const meta = isAll
              ? { label: "All Districts", color: "#6366f1", description: "Complete operational view" }
              : BAND_METADATA[band as AnalysisPerformanceBand];
            return (
              <Button
                key={value}
                variant={activeFilter === band ? "default" : "outline"}
                onClick={() => setActiveFilter(band as typeof activeFilter)}
                className={activeFilter === band ? "neon-glow" : ""}
                disabled={enrichedPoints.length === 0}
              >
                <span className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: meta.color }} />
                {meta.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Operational Map
            </CardTitle>
            <CardDescription>
              {filteredPoints.length > 0
                ? `${filteredPoints.length} district markers visible`
                : "Upload a dataset via the Analysis tab to populate the map"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div ref={mapContainerRef} className="w-full h-[500px] rounded-lg border border-border" />
              {filteredPoints.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 text-sm text-muted-foreground">
                  No geospatial insights yet. Run an analysis to see live GIS overlays.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle>
              {selectedPoint ? selectedPoint.district : enrichedPoints.length ? "Select a district" : "Awaiting data"}
            </CardTitle>
            <CardDescription>
              {selectedPoint
                ? `${selectedPoint.state ?? "Unknown State"} • ${BAND_METADATA[selectedPoint.band].label}`
                : "Click a marker to view district-level details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPoint ? (
              <>
                <div className="p-4 bg-card/50 rounded-lg border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Efficiency</span>
                    <span className="text-2xl font-bold" style={{ color: BAND_METADATA[selectedPoint.band].color }}>
                      {formatEfficiency(selectedPoint.efficiency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Performance Band</span>
                    <Badge
                      className="capitalize"
                      style={{
                        backgroundColor: `${BAND_METADATA[selectedPoint.band].color}20`,
                        color: BAND_METADATA[selectedPoint.band].color,
                        border: `1px solid ${BAND_METADATA[selectedPoint.band].color}40`,
                      }}
                    >
                      {BAND_METADATA[selectedPoint.band].label}
                    </Badge>
                  </div>
                  {selectedPoint.month && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reporting Month</span>
                      <span className="text-sm font-medium">{selectedPoint.month}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Delta vs Avg</span>
                    <span className="text-sm font-semibold">
                      {formatEfficiency(selectedPoint.efficiency - averageEfficiency)}
                    </span>
                  </div>
                </div>

                <Tabs defaultValue="state" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="state">State Overview</TabsTrigger>
                    <TabsTrigger value="notes">Field Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="state" className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-emerald-600/10 rounded-lg">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Average Efficiency</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        {formatEfficiency(averageEfficiency)}
                      </span>
                    </div>
                    {extremes.best && extremes.worst && (
                      <div className="grid gap-3">
                        <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Top District</span>
                          <span className="text-sm font-semibold text-blue-500">
                            {extremes.best.district} • {formatEfficiency(extremes.best.efficiency)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Lowest District</span>
                          <span className="text-sm font-semibold text-red-500">
                            {extremes.worst.district} • {formatEfficiency(extremes.worst.efficiency)}
                          </span>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="notes">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {BAND_METADATA[selectedPoint.band].description} Align follow-up actions with the AI-generated
                      action items in the Analysis tab.
                    </p>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                {enrichedPoints.length
                  ? "Use the map to identify priority districts. Bands refresh automatically with each upload."
                  : "Run an analysis to populate the map with live operational data."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {enrichedPoints.length > 0 && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Leadership Snapshot
            </CardTitle>
            <CardDescription>Comparative highlights from the current GIS dataset</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">Best District</p>
              {extremes.best ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{extremes.best.district}</p>
                    <p className="text-xs text-muted-foreground">{extremes.best.state ?? "Unknown State"}</p>
                  </div>
                  <span className="text-lg font-bold text-emerald-500">{formatEfficiency(extremes.best.efficiency)}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Awaiting data</p>
              )}
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">Lowest District</p>
              {extremes.worst ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{extremes.worst.district}</p>
                    <p className="text-xs text-muted-foreground">{extremes.worst.state ?? "Unknown State"}</p>
                  </div>
                  <span className="text-lg font-bold text-red-500">{formatEfficiency(extremes.worst.efficiency)}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Awaiting data</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
