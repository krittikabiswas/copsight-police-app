import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const leaderboardData = [
  {
    rank: 1,
    name: "Inspector Rajesh Kumar",
    district: "Bhubaneswar",
    badges: 8,
    score: 945,
    trend: "+12",
  },
  {
    rank: 2,
    name: "SI Priya Sharma",
    district: "Cuttack",
    badges: 7,
    score: 912,
    trend: "+8",
  },
  {
    rank: 3,
    name: "Inspector Anil Patel",
    district: "Puri",
    badges: 6,
    score: 887,
    trend: "+15",
  },
  {
    rank: 4,
    name: "ASI Meera Das",
    district: "Balasore",
    badges: 6,
    score: 856,
    trend: "+5",
  },
  {
    rank: 5,
    name: "CI Vikram Singh",
    district: "Sambalpur",
    badges: 5,
    score: 834,
    trend: "+7",
  },
  {
    rank: 6,
    name: "SI Anjali Rao",
    district: "Bhubaneswar",
    badges: 5,
    score: 812,
    trend: "+3",
  },
  {
    rank: 7,
    name: "Inspector Suresh Nayak",
    district: "Cuttack",
    badges: 4,
    score: 789,
    trend: "+9",
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
  return (
    <div className="space-y-6">
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
              <CardTitle className="text-lg">{officer.name}</CardTitle>
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
                  <h4 className="font-semibold text-foreground">{officer.name}</h4>
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
