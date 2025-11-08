import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const Firreport = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/analyze_case_document/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Backend returned an error");
      }

      const data = await res.json();

      // Try parsing analysis if it's a stringified JSON
      if (data.analysis && typeof data.analysis === "string") {
        try {
          data.analysis = JSON.parse(data.analysis);
        } catch {
          // fallback: sometimes Gemini returns "json\n{...}"
          const clean = data.analysis.replace(/^json\s*/i, "").trim();
          try {
            data.analysis = JSON.parse(clean);
          } catch {
            data.analysis = { raw_text: data.analysis };
          }
        }
      }

      // If backend gives only raw_text, try to extract JSON part
      if (data.analysis?.raw_text && typeof data.analysis.raw_text === "string") {
        try {
          // Clean unwanted prefixes and escape sequences
          let cleanText = data.analysis.raw_text
            .replace(/^```json\s*/i, "") // remove ```json prefix
            .replace(/^json\s*/i, "") // remove 'json' prefix
            .replace(/```\s*$/i, "") // remove trailing ```
            .replace(/\\n/g, "\n") // convert literal '\n' to real newlines
            .replace(/\\"/g, '"') // unescape quotes
            .trim();

          // If still wrapped in quotes, unwrap it
          if ((cleanText.startsWith('"') && cleanText.endsWith('"')) || 
              (cleanText.startsWith("'") && cleanText.endsWith("'"))) {
            cleanText = cleanText.slice(1, -1);
            // Unescape again after unwrapping
            cleanText = cleanText
              .replace(/\\n/g, "\n")
              .replace(/\\"/g, '"')
              .trim();
          }

          // Find the actual JSON object start
          if (cleanText.startsWith("{") === false && cleanText.includes("{")) {
            cleanText = cleanText.slice(cleanText.indexOf("{"));
          }
          // Trim trailing non-JSON characters
          if (!cleanText.endsWith("}")) {
            cleanText = cleanText.slice(0, cleanText.lastIndexOf("}") + 1);
          }

          // Parse into structured object
          data.analysis = JSON.parse(cleanText);
        } catch (err) {
          console.warn("⚠️ Could not parse analysis.raw_text:", err, data.analysis.raw_text);
          data.analysis = { raw_text: data.analysis.raw_text };
        }
      }

      setResult(data);
      toast({ title: "✅ Analysis complete", description: `File analyzed: ${file.name}` });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "❌ Analysis failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      });
      setResult({ error: err?.message || String(err) });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">FIR / Case Document Analyzer</h1>
        <p className="text-muted-foreground">
          Upload an FIR, case document, or image to get an AI-driven summary and actionable recommendations.
        </p>
      </div>

      {/* Upload Card */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Upload Case Document
          </CardTitle>
          <CardDescription>
            Supports PDF, TXT, JPG, PNG — text is extracted, analyzed, and summarized by AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-primary mb-4" />
            <input
              type="file"
              accept=".pdf,.txt,.jpg,.jpeg,.png"
              onChange={handleUpload}
              className="hidden"
              id="fir-upload"
            />
            <label htmlFor="fir-upload">
              <Button asChild disabled={isProcessing} className="neon-glow">
                <span>{isProcessing ? "Processing..." : "Upload Document"}</span>
              </Button>
            </label>
            {fileName && (
              <p className="text-sm text-muted-foreground mt-2">Selected: {fileName}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Card */}
      {result && (
        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              AI Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-destructive">{result.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  <strong>File:</strong> {result.filename || fileName}
                </p>
                {result.language && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Language Detected:</strong> {result.language}
                  </p>
                )}
                {result.text_excerpt && (
                  <details className="bg-transparent border border-primary/20 p-3 rounded">
                    <summary className="cursor-pointer">Show Extracted Text Excerpt</summary>
                    <pre className="whitespace-pre-wrap mt-2 text-sm">
                      {result.text_excerpt}
                    </pre>
                  </details>
                )}

                {/* Main Analysis Section */}
                <div className="prose prose-invert max-w-none">
                  <h4>AI Analysis</h4>
                  {result.analysis &&
                  typeof result.analysis === "object" &&
                  (result.analysis.laws ||
                    result.analysis.recommendations ||
                    result.analysis.missing_elements) ? (
                    <div className="space-y-4">
                      {/* Laws */}
                      {Array.isArray(result.analysis.laws) &&
                        result.analysis.laws.length > 0 && (
                          <div>
                            <h5 className="font-semibold">📜 Relevant Laws</h5>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                              {result.analysis.laws.map((l: string, i: number) => (
                                <li key={i} className="text-sm leading-relaxed">
                                  {l}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Recommendations */}
                      {Array.isArray(result.analysis.recommendations) &&
                        result.analysis.recommendations.length > 0 && (
                          <div>
                            <h5 className="font-semibold">🧭 Recommendations</h5>
                            <ol className="list-decimal pl-6 mt-2 space-y-1">
                              {result.analysis.recommendations.map(
                                (r: string, i: number) => (
                                  <li key={i} className="text-sm leading-relaxed">
                                    {r}
                                  </li>
                                )
                              )}
                            </ol>
                          </div>
                        )}

                      {/* Missing Elements */}
                      {Array.isArray(result.analysis.missing_elements) &&
                        result.analysis.missing_elements.length > 0 && (
                          <div>
                            <h5 className="font-semibold">⚠️ Missing Elements</h5>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                              {result.analysis.missing_elements.map(
                                (m: string, i: number) => (
                                  <li key={i} className="text-sm leading-relaxed">
                                    {m}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {typeof result.analysis === "string"
                        ? result.analysis
                        : JSON.stringify(result.analysis, null, 2)}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Firreport;