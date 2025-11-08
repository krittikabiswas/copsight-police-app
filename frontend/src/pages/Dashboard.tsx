import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardAnalysis } from "@/components/dashboard/DashboardAnalysis";
import { BadgesSection } from "@/components/dashboard/BadgesSection";
import { GISMapping } from "@/components/dashboard/GISMapping";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { Community } from "@/components/dashboard/Community";

export type DashboardSection = "analysis" | "badges" | "gis" | "leaderboard" | "community";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>("analysis");

  const renderSection = () => {
    switch (activeSection) {
      case "analysis":
        return <DashboardAnalysis />;
      case "badges":
        return <BadgesSection />;
      case "gis":
        return <GISMapping />;
      case "leaderboard":
        return <Leaderboard />;
      case "community":
        return <Community />;
      default:
        return <DashboardAnalysis />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;
