import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const DashboardAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
const [report, setReport] = useState<any>(null);
const [predictions, setPredictions] = useState<number[]>([]);
const [datasetName, setDatasetName] = useState<string>("");
const [districts, setDistricts] = useState<string[]>([]);
const [graphs, setGraphs] = useState<{ folder: string; files: string[] }>({ folder: "", files: [] }); // ✅ holds backend graph info
const [selectedGraph, setSelectedGraph] = useState<string>(""); // ✅ holds which file user selected


  const { toast } = useToast();

  const handleFileUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

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
        setPredictions(result.predictions || []);
        setReport(result.analysis_report || {});
        setDistricts(result.districts || []);
        setGraphs(result.graphs || null); // ✅ store graph folder + files
        setSelectedGraph("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to backend.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Color palette for pie charts
  const COLORS = ["hsl(220, 90%, 55%)", "hsl(195, 100%, 50%)", "hsl(45, 100%, 60%)", "hsl(150, 80%, 50%)"];

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
      {report && (
        <>
          {/* Summary Card */}
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Dataset:</strong> {datasetName}
              </p>
              {typeof report === "object" ? (
                <>
                  <p className="text-lg font-semibold mb-2">{report.summary}</p>
                  <div className="prose prose-invert max-w-none leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {report.analysis_report}
                    </ReactMarkdown>
                  </div>

                </>
              ) : (
                <p>{report}</p>
              )}
            </CardContent>
          </Card>

          

          {graphs && Array.isArray(graphs.files) && graphs.files.length > 0 && (
  <Card className="glass-card border-primary/20">
    <CardHeader>
      <CardTitle>Visualization Explorer</CardTitle>
      <CardDescription>Select a generated graph to view</CardDescription>
    </CardHeader>
    <CardContent>
      <select
        className="bg-transparent border border-primary/30 rounded-lg p-2 text-sm text-foreground"
        onChange={(e) => setSelectedGraph(e.target.value)}
        value={selectedGraph}
      >
        <option value="">Select a Graph</option>
        {graphs.files.map((file: string, i: number) => (
          <option key={i} value={file}>
            {file.replace(".png", "").replace(/_/g, " ")}
          </option>
        ))}
      </select>

      {selectedGraph && (
        <div className="mt-4 flex justify-center">
          <img
            src={`${API_BASE_URL}/graphs/${graphs.folder}/${selectedGraph}`}
            alt="Generated Graph"
            className="rounded-xl shadow-lg border border-primary/30 w-full max-w-2xl"
          />
        </div>
      )}
    </CardContent>
  </Card>
)}
        </>
      )}
    </div>
  );
};