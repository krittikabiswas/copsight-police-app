import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { OfficerDetailsModal, OfficerDetails } from "./OfficerDetailsModal";

const leaderboardData: OfficerDetails[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-gold" />;
    case 2:
      return <Medal className="h-6 w-6 text-accent" />;
    case 3:
      return <Award className="h-6 w-6 text-primary" />;
    default:
      return null;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "border-gold/50 bg-gold/5";
    case 2:
      return "border-accent/50 bg-accent/5";
    case 3:
      return "border-primary/50 bg-primary/5";
    default:
      return "border-border";
  }
};

export const Leaderboard = () => {
  const [selectedOfficer, setSelectedOfficer] = useState<OfficerDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOfficerClick = (officer: OfficerDetails) => {
    setSelectedOfficer(officer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOfficer(null);
  };

  return (
    <div className="space-y-6">
      <OfficerDetailsModal officer={selectedOfficer} isOpen={isModalOpen} onClose={handleCloseModal} />
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top performers across all districts</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboardData.slice(0, 3).map((officer, index) => (
          <Card
            key={officer.rank}
            className={`glass-card ${getRankColor(officer.rank)} border-2 ${
              index === 0 ? "md:order-2 animate-glow" : index === 1 ? "md:order-1" : "md:order-3"
            }`}
          >
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                {getRankIcon(officer.rank)}
              </div>
              <CardTitle className="text-lg cursor-pointer hover:text-primary transition-colors" onClick={() => handleOfficerClick(officer)}>
                {officer.name}
              </CardTitle>
              <CardDescription>{officer.district}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-3xl font-bold text-primary">{officer.score}</div>
              <div className="flex justify-center gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Badges</div>
                  <div className="font-semibold text-gold">{officer.badges}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Trend</div>
                  <div className="font-semibold text-accent flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {officer.trend}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
          <CardDescription>District-wise performance comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.map((officer) => (
              <div
                key={officer.rank}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  officer.rank <= 3 ? getRankColor(officer.rank) : "bg-card/30"
                } border transition-all hover:scale-[1.02] cursor-pointer`}
              >
                <div className="flex items-center justify-center w-12 h-12">
                  {officer.rank <= 3 ? (
                    getRankIcon(officer.rank)
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">#{officer.rank}</span>
                  )}
                </div>

                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {officer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h4 className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleOfficerClick(officer)}>
                    {officer.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{officer.district}</p>
                </div>

                <div className="text-right">
                  <Badge variant="outline" className="mb-2">
                    {officer.badges} Badges
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-accent">
                    <TrendingUp className="h-3 w-3" />
                    {officer.trend}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{officer.score}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
