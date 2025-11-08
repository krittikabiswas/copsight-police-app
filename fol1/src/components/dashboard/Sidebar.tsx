import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BarChart3, Trophy, Map, Users, MessageSquare, LogOut, Shield, FileSpreadsheet } from "lucide-react";
import { DashboardSection } from "@/pages/Dashboard";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const navigate = useNavigate();

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
      {/* Profile Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sidebar-foreground">Officer Name</h3>
            <p className="text-sm text-muted-foreground">Inspector</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">District: Bhubaneswar</p>
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

      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </aside>
  );
};
