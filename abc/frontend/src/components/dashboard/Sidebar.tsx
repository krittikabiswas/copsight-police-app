import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BarChart3, Trophy, Map, Users, MessageSquare, LogOut, Shield, FileSpreadsheet } from "lucide-react";
import { DashboardSection } from "@/pages/Dashboard";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { OfficerDetailsModal } from "./OfficerDetailsModal";
import { OfficerDetails } from "./OfficerDetailsModal";

interface SidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const navigate = useNavigate();
  const [selectedOfficer, setSelectedOfficer] = useState<OfficerDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Current logged-in officer
  const currentOfficer: OfficerDetails = {
    rank: 1,
    name: "Saptarshi Mondal",
    designation: "Inspector",
    district: "Bhubaneswar",
    badges: 8,
    score: 945,
    trend: "+12",
    email: "officer@statepolice.gov",
    phone: "+91-9876-543210",
    yearsOfService: 12,
    casesResolved: 234,
    successRate: 94,
    specialization: "Cyber Crime",
    achievements: [
      "Crime Prevention Excellence 2023",
      "Leadership Award 2022",
      "Outstanding Performance 2021",
    ],
    recentActivity: [
      { date: "2024-11-08", activity: "Resolved 3 cases" },
      { date: "2024-11-07", activity: "Earned 'Swift Action' badge" },
      { date: "2024-11-06", activity: "Completed training on Digital Forensics" },
    ],
  };

  const handleProfileClick = () => {
    setSelectedOfficer(currentOfficer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOfficer(null);
  };

  const menuItems = [
    { id: "analysis" as DashboardSection, label: "Dashboard Analysis", icon: BarChart3 },
    { id: "firreport" as DashboardSection, label: "FIR Report", icon: FileSpreadsheet },
    { id: "badges" as DashboardSection, label: "Badges & Gamification", icon: Trophy },
    { id: "gis" as DashboardSection, label: "GIS Mapping", icon: Map },
    { id: "leaderboard" as DashboardSection, label: "Leaderboard", icon: Users },
    { id: "community" as DashboardSection, label: "Open Community", icon: MessageSquare },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Officer Details Modal */}
      <OfficerDetailsModal officer={selectedOfficer} isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Profile Section */}
      <div className="p-6 border-b border-sidebar-border cursor-pointer hover:bg-sidebar-accent/50 transition-colors" onClick={handleProfileClick}>
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sidebar-foreground hover:text-primary transition-colors">{currentOfficer.name}</h3>
            <p className="text-sm text-muted-foreground">{currentOfficer.designation}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">District: {currentOfficer.district}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                isActive ? "bg-primary text-primary-foreground neon-glow" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Logout Button and Theme Toggle */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="flex gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            className="flex-1 justify-start gap-3 border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};
