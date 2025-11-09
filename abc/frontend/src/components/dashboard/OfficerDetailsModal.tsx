import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp, MapPin, Mail, Phone, Award as AwardIcon } from "lucide-react";

export interface OfficerDetails {
  rank: number;
  name: string;
  designation: string;
  district: string;
  badges: number;
  score: number;
  trend: string;
  email?: string;
  phone?: string;
  yearsOfService?: number;
  casesResolved?: number;
  successRate?: number;
  specialization?: string;
  achievements?: string[];
  recentActivity?: {
    date: string;
    activity: string;
  }[];
}

interface OfficerDetailsModalProps {
  officer: OfficerDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const defaultOfficerDetails: { [key: string]: OfficerDetails } = {
  "Inspector Rajesh Kumar": {
    rank: 1,
    name: "Inspector Rajesh Kumar",
    designation: "Inspector",
    district: "Bhubaneswar",
    badges: 8,
    score: 945,
    trend: "+12",
    email: "rajesh.kumar@statepolice.gov",
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
  },
  "SI Priya Sharma": {
    rank: 2,
    name: "SI Priya Sharma",
    designation: "Sub-Inspector",
    district: "Cuttack",
    badges: 7,
    score: 912,
    trend: "+8",
    email: "priya.sharma@statepolice.gov",
    phone: "+91-9876-543211",
    yearsOfService: 8,
    casesResolved: 189,
    successRate: 92,
    specialization: "Community Policing",
    achievements: [
      "Community Safety Hero 2023",
      "Best Communicator 2022",
    ],
    recentActivity: [
      { date: "2024-11-08", activity: "Conducted community awareness program" },
      { date: "2024-11-07", activity: "Earned badge: Community Connect" },
      { date: "2024-11-05", activity: "Resolved 2 high-priority cases" },
    ],
  },
  "Inspector Anil Patel": {
    rank: 3,
    name: "Inspector Anil Patel",
    designation: "Inspector",
    district: "Puri",
    badges: 6,
    score: 887,
    trend: "+15",
    email: "anil.patel@statepolice.gov",
    phone: "+91-9876-543212",
    yearsOfService: 10,
    casesResolved: 198,
    successRate: 90,
    specialization: "Traffic Management",
    achievements: [
      "Road Safety Initiative Award 2023",
      "Discipline Excellence 2022",
    ],
    recentActivity: [
      { date: "2024-11-08", activity: "Implemented traffic control measures" },
      { date: "2024-11-07", activity: "Earned badge: Traffic Master" },
    ],
  },
  "ASI Meera Das": {
    rank: 4,
    name: "ASI Meera Das",
    designation: "Assistant Sub-Inspector",
    district: "Balasore",
    badges: 6,
    score: 856,
    trend: "+5",
    email: "meera.das@statepolice.gov",
    phone: "+91-9876-543213",
    yearsOfService: 6,
    casesResolved: 145,
    successRate: 88,
    specialization: "Women Safety",
    achievements: [
      "Women Empowerment Award 2023",
      "Bravery Recognition 2022",
    ],
    recentActivity: [
      { date: "2024-11-08", activity: "Attended women safety workshop" },
      { date: "2024-11-06", activity: "Resolved 2 cases" },
    ],
  },
  "CI Vikram Singh": {
    rank: 5,
    name: "CI Vikram Singh",
    designation: "Circle Inspector",
    district: "Sambalpur",
    badges: 5,
    score: 834,
    trend: "+7",
    email: "vikram.singh@statepolice.gov",
    phone: "+91-9876-543214",
    yearsOfService: 11,
    casesResolved: 210,
    successRate: 89,
    specialization: "Investigation",
    achievements: [
      "Investigation Excellence 2023",
      "Case Resolution Speed Award 2022",
    ],
    recentActivity: [
      { date: "2024-11-08", activity: "Closed major investigation" },
      { date: "2024-11-05", activity: "Earned badge: Crime Solver" },
    ],
  },
  "SI Anjali Rao": {
    rank: 6,
    name: "SI Anjali Rao",
    designation: "Sub-Inspector",
    district: "Bhubaneswar",
    badges: 5,
    score: 812,
    trend: "+3",
    email: "anjali.rao@statepolice.gov",
    phone: "+91-9876-543215",
    yearsOfService: 7,
    casesResolved: 156,
    successRate: 87,
    specialization: "Public Relations",
    achievements: [
      "Public Relations Excellence 2023",
      "Media Engagement Award 2022",
    ],
    recentActivity: [
      { date: "2024-11-08", activity: "Conducted press briefing" },
      { date: "2024-11-07", activity: "Resolved community complaint" },
    ],
  },
  "Inspector Suresh Nayak": {
    rank: 7,
    name: "Inspector Suresh Nayak",
    designation: "Inspector",
    district: "Cuttack",
    badges: 4,
    score: 789,
    trend: "+9",
    email: "suresh.nayak@statepolice.gov",
    phone: "+91-9876-543216",
    yearsOfService: 9,
    casesResolved: 167,
    successRate: 86,
    specialization: "Crime Prevention",
    achievements: [
      "Crime Prevention Initiative 2023",
      "Vigilance Award 2022",
    ],
    recentActivity: [
      { date: "2024-11-08", activity: "Initiated crime prevention campaign" },
      { date: "2024-11-06", activity: "Resolved 3 cases" },
    ],
  },
};

export const OfficerDetailsModal = ({ officer, isOpen, onClose }: OfficerDetailsModalProps) => {
  if (!officer) return null;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-gold" />;
      case 2:
        return <Medal className="h-5 w-5 text-accent" />;
      case 3:
        return <Award className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  const getDesignationBadgeVariant = (designation: string) => {
    if (designation.includes("Inspector") && designation === "Inspector") return "default";
    if (designation.includes("Sub-Inspector")) return "secondary";
    if (designation.includes("Circle")) return "outline";
    if (designation.includes("Assistant")) return "outline";
    return "default";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Officer Details</DialogTitle>
          <DialogDescription>Complete profile information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6 pb-6 border-b border-border">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
                {officer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{officer.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Badge variant={getDesignationBadgeVariant(officer.designation)}>
                      {officer.designation}
                    </Badge>
                  </p>
                </div>
                {officer.rank <= 3 && (
                  <div className="text-right">
                    {getRankIcon(officer.rank)}
                    <p className="text-xs text-muted-foreground mt-1">Rank #{officer.rank}</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="text-xl font-bold text-primary">{officer.score}</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="text-xs text-muted-foreground">Badges</p>
                  <p className="text-xl font-bold text-accent">{officer.badges}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-xs text-muted-foreground">Trend</p>
                  <p className="text-xl font-bold text-green-500 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {officer.trend}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">District</p>
                  <p className="text-sm font-medium">{officer.district}</p>
                </div>
              </div>
              {officer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{officer.email}</p>
                  </div>
                </div>
              )}
              {officer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{officer.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Years of Service</p>
                  <p className="text-2xl font-bold text-primary">{officer.yearsOfService} years</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Cases Resolved</p>
                  <p className="text-2xl font-bold text-accent">{officer.casesResolved}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Success Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-green-500">{officer.successRate}%</p>
                    <div className="flex-1 h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${officer.successRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Specialization</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="mb-4" variant="secondary">
                  {officer.specialization}
                </Badge>
                <div>
                  <p className="text-xs text-muted-foreground mb-3">Achievements</p>
                  <ul className="space-y-2">
                    {officer.achievements?.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <AwardIcon className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          {officer.recentActivity && officer.recentActivity.length > 0 && (
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Last activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officer.recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 last:pb-0 border-b last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.activity}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
