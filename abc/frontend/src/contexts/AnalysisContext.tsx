import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type AnalysisPerformanceBand = "high" | "moderate" | "watch";

export interface AnalysisMapPoint {
  district: string;
  state?: string | null;
  latitude: number;
  longitude: number;
  efficiency: number;
  raw_score?: number;
  dataset?: string;
  category?: string;
  month?: string | null;
  band?: AnalysisPerformanceBand;
}

type AnalysisContextValue = {
  mapPoints: AnalysisMapPoint[];
  setMapPoints: (points: AnalysisMapPoint[]) => void;
  datasetName: string;
  setDatasetName: (name: string) => void;
};

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [mapPoints, setMapPoints] = useState<AnalysisMapPoint[]>([]);
  const [datasetName, setDatasetName] = useState<string>("");

  const value = useMemo(
    () => ({ mapPoints, setMapPoints, datasetName, setDatasetName }),
    [mapPoints, datasetName]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};

export const useAnalysisContext = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysisContext must be used within AnalysisProvider");
  }
  return context;
};
