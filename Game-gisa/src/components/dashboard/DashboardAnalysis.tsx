import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";

const districtData = [
  { district: "Bhubaneswar", arrests: 42, convictions: 35 },
  { district: "Cuttack", arrests: 38, convictions: 30 },
  { district: "Puri", arrests: 29, convictions: 24 },
  { district: "Balasore", arrests: 31, convictions: 26 },
  { district: "Sambalpur", arrests: 27, convictions: 22 },
];

const categoryData = [
  { name: "NDPS Cases", value: 42, color: "hsl(220, 90%, 55%)" },
  { name: "NBW Executed", value: 28, color: "hsl(195, 100%, 50%)" },
  { name: "Missing Persons", value: 15, color: "hsl(45, 100%, 60%)" },
  { name: "Convictions", value: 35, color: "hsl(150, 80%, 50%)" },
];

export const DashboardAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setDataLoaded(true);
      toast({
        title: "Analysis Complete",
        description: "Your dataset has been processed successfully.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Analysis</h1>
          <p className="text-muted-foreground">Upload and analyze police performance data</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Upload Dataset
          </CardTitle>
          <CardDescription>Upload your .csv file to generate insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-primary mb-4" />
            <p className="text-sm text-muted-foreground mb-4">Drag & drop your CSV file here, or click to browse</p>
            <Button onClick={handleFileUpload} disabled={isAnalyzing} className="neon-glow">
              {isAnalyzing ? "Analyzing Data..." : "Upload Dataset (.csv)"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {(dataLoaded || isAnalyzing) && (
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
              <p className="text-foreground leading-relaxed">
                This month, <span className="text-primary font-semibold">Bhubaneswar</span> led in NDPS arrests with{" "}
                <span className="text-accent font-semibold">42 cases closed</span>. Overall conviction ratio stands at{" "}
                <span className="text-gold font-semibold">83%</span>, showing excellent performance across all districts.
                Cuttack and Balasore show consistent improvement in NBW execution rates.
              </p>
            </CardContent>
          </Card>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>District-Wise Performance</CardTitle>
                <CardDescription>Arrests vs Convictions by District</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={districtData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
                    <XAxis dataKey="district" stroke="hsl(210, 100%, 98%)" />
                    <YAxis stroke="hsl(210, 100%, 98%)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(220, 25%, 12%)", 
                        border: "1px solid hsl(220, 90%, 55%)",
                        borderRadius: "8px"
                      }} 
                    />
                    <Bar dataKey="arrests" fill="hsl(220, 90%, 55%)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="convictions" fill="hsl(195, 100%, 50%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Case Category Distribution</CardTitle>
                <CardDescription>Breakdown by case type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(220, 25%, 12%)", 
                        border: "1px solid hsl(220, 90%, 55%)",
                        borderRadius: "8px"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Export Section */}
          <Card className="glass-card border-gold/20">
            <CardHeader>
              <CardTitle>Export Report</CardTitle>
              <CardDescription>Download your analysis in multiple formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export as Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
