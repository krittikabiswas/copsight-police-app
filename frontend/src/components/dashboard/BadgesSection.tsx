import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, Shield, Target, Zap } from "lucide-react";

const badges = [
  {
    id: 1,
    name: "Gold Star in Convictions",
    icon: Star,
    color: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/30",
    earned: true,
    date: "2024-01-15",
    criteria: "Achieved 90% conviction rate",
  },
  {
    id: 2,
    name: "Silver Shield in Narcotics",
    icon: Shield,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
    earned: true,
    date: "2024-01-10",
    criteria: "35+ NDPS cases resolved",
  },
  {
    id: 3,
    name: "Bronze Award - NBW Master",
    icon: Award,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    earned: true,
    date: "2024-01-05",
    criteria: "25+ NBW executed successfully",
  },
  {
    id: 4,
    name: "Elite Performer Trophy",
    icon: Trophy,
    color: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/30",
    earned: false,
    date: null,
    criteria: "Top 3 in district for 3 months",
  },
  {
    id: 5,
    name: "Sharpshooter Badge",
    icon: Target,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    earned: false,
    date: null,
    criteria: "95% case closure rate",
  },
  {
    id: 6,
    name: "Lightning Response",
    icon: Zap,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
    earned: false,
    date: null,
    criteria: "Average response time < 10 min",
  },
];

export const BadgesSection = () => {
  const earnedCount = badges.filter(b => b.earned).length;
  const progressPercentage = (earnedCount / badges.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Badges & Gamification</h1>
        <p className="text-muted-foreground">Track your achievements and unlock rewards</p>
      </div>

      {/* Progress Overview */}
      <Card className="glass-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              Achievement Progress
            </span>
            <Badge variant="outline" className="text-gold border-gold">
              {earnedCount} / {badges.length} Earned
            </Badge>
          </CardTitle>
          <CardDescription>Your journey to excellence</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            Next Badge: <span className="text-gold font-semibold">Elite Performer Trophy</span> - Maintain top 3 ranking for 2 more months
          </p>
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <Card
              key={badge.id}
              className={`glass-card ${badge.borderColor} border-2 ${
                badge.earned ? "animate-glow" : "opacity-60"
              } transition-all hover:scale-105 cursor-pointer`}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-full ${badge.bgColor} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`h-8 w-8 ${badge.color}`} />
                </div>
                <CardTitle className="text-center text-lg">{badge.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">{badge.criteria}</p>
                {badge.earned ? (
                  <Badge className="bg-gold/20 text-gold border-gold">
                    Earned: {badge.date}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-muted-foreground/30">
                    Locked
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
