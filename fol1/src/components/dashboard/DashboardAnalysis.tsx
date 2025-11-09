import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, TrendingUp, Download } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LabelList,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAnalysisContext } from "@/contexts/AnalysisContext";
import jsPDF from "jspdf";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

type ReportPayload = {
  summary?: string;
  headline?: string;
  analysis_report?: string;
};

type GraphBundle = {
  folder: string;
  files: string[];
};

export const DashboardAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [report, setReport] = useState<ReportPayload | string | null>(null);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [datasetName, setDatasetName] = useState<string>("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [graphs, setGraphs] = useState<GraphBundle | string[] | null>(null);
  const [selectedGraph, setSelectedGraph] = useState<string>("");
  const { setMapPoints, setDatasetName: setSharedDatasetName } = useAnalysisContext();
  const { toast } = useToast();

  const handleFileUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setSharedDatasetName("");
    setMapPoints([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "error") {
        toast({
          title: "Analysis Failed",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: `Dataset: ${result.dataset}`,
        });

        setDatasetName(result.dataset);
        setSharedDatasetName(result.dataset || "");
        setPredictions(result.predictions || []);
        setReport(result.analysis_report || null);
        setDistricts(result.districts || []);
        setGraphs(result.graphs || null);
        setSelectedGraph("");
        setMapPoints(Array.isArray(result.map_points) ? result.map_points : []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to backend.",
        variant: "destructive",
      });
      setMapPoints([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!hasReport) {
      toast({
        title: "No Report Available",
        description: "Upload a dataset to generate a report before downloading.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const margin = 15;
      const lineHeight = 7;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let cursorY = margin;

      const ensureSpace = (height = lineHeight) => {
        if (cursorY + height > pageHeight - margin) {
          pdf.addPage();
          cursorY = margin;
        }
      };

      const setFont = (style: "normal" | "bold", size: number, color = 50) => {
        pdf.setFont("helvetica", style);
        pdf.setFontSize(size);
        pdf.setTextColor(color);
      };

      const sanitize = (text: string) =>
        text
          .replace(/\r/g, "")
          .replace(/\s+/g, " ")
          .replace(/[#*_`>-]+/g, "")
          .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
          .trim();

      const addHeading = (text: string, size = 16) => {
        const cleaned = sanitize(text);
        if (!cleaned) return;
        setFont("bold", size, 30);
        ensureSpace();
        pdf.text(cleaned, margin, cursorY);
        cursorY += lineHeight;
      };

      const addSpacer = (height = lineHeight / 2) => {
        ensureSpace(height);
        cursorY += height;
      };

      const addParagraph = (text: string, size = 11) => {
        const cleaned = sanitize(text);
        if (!cleaned) return;
        setFont("normal", size);
        const lines = pdf.splitTextToSize(cleaned, pageWidth - margin * 2);
        lines.forEach((line) => {
          ensureSpace();
          pdf.text(line, margin, cursorY);
          cursorY += lineHeight;
        });
      };

      const addBulletList = (items: string[]) => {
        if (!items.length) return;
        setFont("normal", 11);
        items.forEach((item) => {
          const cleaned = sanitize(item);
          if (!cleaned) return;
          const lines = pdf.splitTextToSize(`• ${cleaned}`, pageWidth - margin * 2);
          lines.forEach((line) => {
            ensureSpace();
            pdf.text(line, margin, cursorY);
            cursorY += lineHeight;
          });
        });
      };

      const safeDatasetName = (datasetName || "analysis").replace(/[^a-z0-9_\-]+/gi, "_");

      addHeading("Copsight AI – Dashboard Analysis Report", 18);
      setFont("normal", 10);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, cursorY);
      cursorY += lineHeight;
      pdf.text(`Dataset: ${datasetName || "Unknown Dataset"}`, margin, cursorY);
      cursorY += lineHeight;
      addSpacer();

      if (structuredReport?.headline) {
        addHeading(structuredReport.headline, 14);
      }

      if (structuredReport?.summary) {
        addParagraph(structuredReport.summary, 12);
        addSpacer();
      }

      if (narrativeText) {
        addHeading("Narrative Insights", 13);
        addParagraph(narrativeText, 11);
        addSpacer();
      }

      if (metrics.length > 0) {
        addHeading("Operational Metrics", 13);
        addBulletList(
          metrics.map((metric) => {
            const contextText = metric.context ? ` – ${metric.context}` : "";
            return `${metric.label}: ${metric.value}${contextText}`;
          })
        );
        addSpacer();
      }

      if (hasPerformanceData) {
        addHeading("Performance Distribution Summary", 13);
        addParagraph(chartNarrative, 11);
        addSpacer();

        if (sortedPerformance.top.length > 0) {
          addHeading("Top Performing Districts", 12);
          addBulletList(
            sortedPerformance.top.map(
              (item, index) => `${index + 1}. ${item.district} – ${item.efficiency.toFixed(1)}%`
            )
          );
          addSpacer();
        }

        if (sortedPerformance.bottom.length > 0) {
          addHeading("Districts Requiring Support", 12);
          addBulletList(
            sortedPerformance.bottom.map(
              (item, index) => `${index + 1}. ${item.district} – ${item.efficiency.toFixed(1)}%`
            )
          );
          addSpacer();
        }
      }

      if (graphFolder && graphFiles.length > 0) {
        addHeading("Generated Visuals", 13);
        addParagraph(
          `Graphs are available on the server at /graphs/${graphFolder}. Each visualization is accompanied by AI context within the dashboard.`,
          11
        );
        addSpacer();
      }

      pdf.save(`${safeDatasetName}_report.pdf`);
      toast({ title: "Download Complete", description: "The analysis report has been saved as a PDF." });
    } catch (error) {
      console.error("Failed to export PDF", error);
      toast({
        title: "Export Failed",
        description: "We could not generate the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const structuredReport = useMemo<ReportPayload | null>(() => {
    return typeof report === "object" && report !== null ? report : null;
  }, [report]);

  const hasReport = useMemo(() => {
    if (structuredReport) {
      return Boolean(structuredReport.summary || structuredReport.analysis_report);
    }
    if (typeof report === "string") {
      return report.trim().length > 0;
    }
    return false;
  }, [report, structuredReport]);

  const narrativeText = useMemo(() => {
    if (structuredReport?.analysis_report) {
      return structuredReport.analysis_report;
    }
    if (typeof report === "string") {
      return report;
    }
    return "";
  }, [report, structuredReport]);

  const normalizedPredictions = useMemo(() => {
    if (!Array.isArray(predictions)) {
      return [];
    }
    return predictions.map((value) => {
      if (typeof value !== "number" || Number.isNaN(value)) {
        return 0;
      }
      return value <= 1 ? value * 100 : value;
    });
  }, [predictions]);

  const performanceData = useMemo(() => {
    if (!Array.isArray(districts) || districts.length === 0) {
      return [];
    }

    return districts
      .map((district, index) => {
        const efficiency = normalizedPredictions[index];
        if (typeof efficiency !== "number" || Number.isNaN(efficiency)) {
          return null;
        }
        return {
          district,
          efficiency: Number(efficiency.toFixed(2)),
        };
      })
      .filter((item): item is { district: string; efficiency: number } => item !== null);
  }, [districts, normalizedPredictions]);

  const hasPerformanceData = performanceData.length > 0;
  const efficiencies = performanceData.map((item) => item.efficiency);
  const averageEfficiency = hasPerformanceData
    ? efficiencies.reduce((total, value) => total + value, 0) / performanceData.length
    : 0;
  const topPerformer = hasPerformanceData
    ? performanceData.reduce((prev, curr) => (curr.efficiency > prev.efficiency ? curr : prev))
    : null;
  const bottomPerformer = hasPerformanceData
    ? performanceData.reduce((prev, curr) => (curr.efficiency < prev.efficiency ? curr : prev))
    : null;
  const efficiencySpread = topPerformer && bottomPerformer ? topPerformer.efficiency - bottomPerformer.efficiency : 0;

  const standardDeviation = useMemo(() => {
    if (!hasPerformanceData) {
      return 0;
    }
    const mean = averageEfficiency;
    const variance = efficiencies.reduce((total, value) => {
      const diff = value - mean;
      return total + diff * diff;
    }, 0) / efficiencies.length;
    return Math.sqrt(variance);
  }, [averageEfficiency, efficiencies, hasPerformanceData]);

  const chartNarrative = useMemo(() => {
    if (!hasPerformanceData || !topPerformer || !bottomPerformer) {
      return "";
    }

    const spreadDescriptor = efficiencySpread < 5 ? "tight" : efficiencySpread < 12 ? "moderate" : "wide";
    const volatilityDescriptor = standardDeviation < 4 ? "stable" : standardDeviation < 8 ? "mixed" : "volatile";

    return (
      `District ${topPerformer.district} leads the drive at ${topPerformer.efficiency.toFixed(1)}% while ` +
      `${bottomPerformer.district} is trailing by ${efficiencySpread.toFixed(1)} points. ` +
      `The statewide average sits at ${averageEfficiency.toFixed(1)}%, indicating a ${spreadDescriptor} spread ` +
      `with overall performance looking ${volatilityDescriptor}. Focus coaching on the lower quartile to close the gap.`
    );
  }, [averageEfficiency, bottomPerformer, efficiencySpread, hasPerformanceData, standardDeviation, topPerformer]);

  const chartDomainMax = useMemo(() => {
    if (!hasPerformanceData || efficiencies.length === 0) {
      return 100;
    }
    const maxValue = Math.max(...efficiencies);
    return Math.min(120, Math.ceil((maxValue + 5) / 5) * 5);
  }, [efficiencies, hasPerformanceData]);

  const metrics = useMemo(() => {
    if (!hasPerformanceData) {
      return [];
    }

    const improvementPotential = bottomPerformer
      ? `${(averageEfficiency - bottomPerformer.efficiency).toFixed(1)} pts to reach average`
      : "";

    return [
      {
        label: "Average Efficiency",
        value: `${averageEfficiency.toFixed(1)}%`,
        context: standardDeviation < 4 ? "Consistent delivery across districts" : "Variation requires targeted supervision",
      },
      {
        label: "Top Performer",
        value: topPerformer ? `${topPerformer.district} (${topPerformer.efficiency.toFixed(1)}%)` : "–",
        context: topPerformer ? "Use as benchmark for peer learning" : "Awaiting data",
      },
      {
        label: "Lowest Performer",
        value: bottomPerformer ? `${bottomPerformer.district} (${bottomPerformer.efficiency.toFixed(1)}%)` : "–",
        context: improvementPotential,
      },
      {
        label: "Performance Spread",
        value: `${efficiencySpread.toFixed(1)} pts`,
        context: standardDeviation < 4 ? "Spread within acceptable band" : "Escalate review for bottom quartile",
      },
    ];
  }, [averageEfficiency, bottomPerformer, efficiencySpread, hasPerformanceData, standardDeviation, topPerformer]);

  const graphFiles = useMemo(() => {
    if (!graphs) {
      return [];
    }
    return Array.isArray(graphs) ? graphs : graphs.files || [];
  }, [graphs]);

  const graphFolder = useMemo(() => {
    if (!graphs || Array.isArray(graphs)) {
      return "";
    }
    return graphs.folder;
  }, [graphs]);

  const graphNarratives = useMemo(() => {
    if (!hasPerformanceData || !topPerformer || !bottomPerformer) {
      return {
        default: "Each visualization highlights the predicted efficiency distribution derived from the uploaded dataset.",
      };
    }

    const baselineNarrative = `The visualised efficiencies range from ${bottomPerformer.efficiency.toFixed(1)}% in ${bottomPerformer.district} to ${topPerformer.efficiency.toFixed(1)}% in ${topPerformer.district}.`;

    return {
      "bar_chart.png": `${baselineNarrative} Taller bars indicate districts exceeding the state average of ${averageEfficiency.toFixed(1)}%. Use it to prioritise high-impact mentoring visits.`,
      "line_trend.png": `${baselineNarrative} The trajectory line connects districts to expose sudden dips or surges that warrant verification in CCTNS data.`,
      "scatter_actual_vs_pred.png": `${baselineNarrative} Points hugging the diagonal show districts where predicted and actual efficiencies align, signalling reliable operational reporting.`,
      "histogram_efficiency.png": `${baselineNarrative} The distribution curve reveals whether most districts cluster near the target band or if there are outliers dragging performance.`,
      "heatmap_correlation.png": `${baselineNarrative} Strong correlations highlight data fields that most influence drive outcomes—track these closely during weekly crime meetings.`,
      default: `${baselineNarrative} Use this view to brief divisional DIGs on where to deploy additional support.`,
    };
  }, [averageEfficiency, bottomPerformer, hasPerformanceData, topPerformer]);

  const selectedGraphNarrative = useMemo(() => {
    if (!selectedGraph) {
      return "Select a graph to view its explanation.";
    }
    const narrative = graphNarratives[selectedGraph as keyof typeof graphNarratives] || graphNarratives.default;
    return narrative;
  }, [graphNarratives, selectedGraph]);

  const sortedPerformance = useMemo(() => {
    if (!hasPerformanceData) {
      return { top: [] as { district: string; efficiency: number }[], bottom: [] as { district: string; efficiency: number }[] };
    }

    const sorted = [...performanceData].sort((a, b) => b.efficiency - a.efficiency);
    const top = sorted.slice(0, 5);
    const bottom = sorted.slice(-5).reverse();

    return { top, bottom };
  }, [hasPerformanceData, performanceData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Analysis</h1>
        <p className="text-muted-foreground">Upload and analyze police performance data</p>
      </div>

      {/* Upload Section */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Upload Dataset
          </CardTitle>
          <CardDescription>Upload your .csv file to generate AI-driven insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-primary mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild disabled={isAnalyzing} className="neon-glow">
                <span>{isAnalyzing ? "Analyzing Data..." : "Upload Dataset (.csv)"}</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {hasReport && (
        <>
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    AI-Generated Insights
                  </CardTitle>
                  <CardDescription>
                    Strategic narrative and key takeaways generated from the uploaded dataset
                  </CardDescription>
                </div>
                <Button
                  variant="secondary"
                  className="neon-glow"
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Preparing PDF..." : "Download Report (PDF)"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="uppercase tracking-wide text-xs">
                  {datasetName || "Dataset"}
                </Badge>
                {structuredReport?.headline && (
                  <span className="text-base font-semibold text-foreground/90">
                    {structuredReport.headline}
                  </span>
                )}
              </div>
              {structuredReport?.summary && (
                <p className="text-lg font-semibold text-foreground/95">
                  {structuredReport.summary}
                </p>
              )}
              {narrativeText ? (
                <div className="prose prose-invert max-w-none leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{narrativeText}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  The backend did not provide a detailed narrative for this dataset.
                </p>
              )}
            </CardContent>
          </Card>

          {hasPerformanceData && metrics.length > 0 && (
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle>Operational Performance Snapshot</CardTitle>
                <CardDescription>Derived metrics to support command-level decision making</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-primary/10 bg-background/40 p-4">
                    <p className="text-xs uppercase text-muted-foreground tracking-wide">{metric.label}</p>
                    <p className="text-lg font-semibold text-foreground mt-1">{metric.value}</p>
                    {metric.context && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {metric.context}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {hasPerformanceData && (
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Predicted efficiency by district with state average reference line</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={performanceData}>
                    <defs>
                      <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(220 90% 60%)" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="hsl(220 90% 45%)" stopOpacity={0.75} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 25%)" />
                    <XAxis dataKey="district" stroke="hsl(210 100% 96%)" tick={{ fontSize: 12 }} />
                    <YAxis
                      stroke="hsl(210 100% 96%)"
                      domain={[0, chartDomainMax]}
                      tick={{ fontSize: 12 }}
                      unit="%"
                    />
                    <Tooltip
                      formatter={(value: number | string) => `${Number(value).toFixed(1)}%`}
                      contentStyle={{
                        backgroundColor: "hsl(220 25% 12%)",
                        border: "1px solid hsl(220 90% 55%)",
                        borderRadius: "8px",
                        color: "hsl(210 100% 96%)",
                      }}
                    />
                    <ReferenceLine
                      y={Number(averageEfficiency.toFixed(2))}
                      stroke="hsl(195 82% 60%)"
                      strokeDasharray="6 3"
                      label={{
                        position: "insideTopRight",
                        value: `Avg ${averageEfficiency.toFixed(1)}%`,
                        fill: "hsl(210 100% 96%)",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="efficiency" fill="url(#efficiencyGradient)" radius={[8, 8, 0, 0]}>
                      <LabelList
                        dataKey="efficiency"
                        position="top"
                        formatter={(value: number) => `${value.toFixed(0)}%`}
                        style={{ fill: "hsl(210 100% 96%)", fontSize: 12 }}
                      />
                    </Bar>
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="hsl(220 85% 68%)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "hsl(220 90% 55%)" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{chartNarrative}</p>
              </CardContent>
            </Card>
          )}

          {hasPerformanceData && (sortedPerformance.top.length > 0 || sortedPerformance.bottom.length > 0) && (
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle>District Ranking</CardTitle>
                <CardDescription>Top and bottom performers derived from predicted efficiency</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Top 5 Performing Districts</h3>
                  {sortedPerformance.top.map((item, index) => (
                    <div key={`top-${item.district}`} className="flex items-center justify-between rounded-lg border border-primary/10 bg-background/40 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground">#{index + 1}</span>
                        <span className="font-medium text-foreground">{item.district}</span>
                        {index === 0 && <Badge variant="secondary">Leader</Badge>}
                      </div>
                      <span className="font-semibold text-foreground">{item.efficiency.toFixed(1)}%</span>
                    </div>
                  ))}
                  {sortedPerformance.top.length === 0 && (
                    <p className="text-xs text-muted-foreground">Not enough data to compute top performers.</p>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Bottom 5 Districts Requiring Support</h3>
                  {sortedPerformance.bottom.map((item, index) => (
                    <div key={`bottom-${item.district}`} className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-destructive">#{index + 1}</span>
                        <span className="font-medium text-foreground">{item.district}</span>
                        {index === sortedPerformance.bottom.length - 1 && <Badge variant="destructive">Critical Watch</Badge>}
                      </div>
                      <span className="font-semibold text-foreground">{item.efficiency.toFixed(1)}%</span>
                    </div>
                  ))}
                  {sortedPerformance.bottom.length === 0 && (
                    <p className="text-xs text-muted-foreground">Not enough data to compute bottom performers.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {graphFiles.length > 0 && (
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle>Visualization Explorer</CardTitle>
                <CardDescription>Select a generated graph to view with AI context</CardDescription>
              </CardHeader>
              <CardContent>
                <select
                  className="bg-transparent border border-primary/30 rounded-lg p-2 text-sm text-foreground"
                  onChange={(e) => setSelectedGraph(e.target.value)}
                  value={selectedGraph}
                >
                  <option value="">Select a graph</option>
                  {graphFiles.map((file) => (
                    <option key={file} value={file}>
                      {file.replace(".png", "").replace(/_/g, " ")}
                    </option>
                  ))}
                </select>

                {selectedGraph ? (
                  graphFolder ? (
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-center">
                        <img
                          src={`${API_BASE_URL}/graphs/${graphFolder}/${selectedGraph}`}
                          alt={`Visualization ${selectedGraph}`}
                          className="rounded-xl shadow-lg border border-primary/30 w-full max-w-2xl"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedGraphNarrative}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-4">
                      Graph preview is unavailable because the backend did not provide a graph folder path for this dataset.
                    </p>
                  )
                ) : (
                  <p className="text-xs text-muted-foreground mt-4">Choose a graph to preview and read its AI interpretation.</p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};