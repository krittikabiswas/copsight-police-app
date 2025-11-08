import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  Award,
  Star,
  Shield,
  Gavel,
  ScrollText,
  Crosshair,
  Truck,
  Compass,
  FolderCheck,
  Leaf,
  Wine,
  CarFront,
  Zap,
  Lock,
  Medal,
  Info,
  CheckCircle2
} from "lucide-react";

interface BadgeData {
  id: number;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  earned: boolean;
  date: string | null;
  criteria: string;
  category: "special-drives" | "convictions" | "elite-awards";
  tier: "gold" | "silver" | "bronze";
  description: string;
  issuingAuthority: string;
  requirements: string[];
}

const badges: BadgeData[] = [
  // PART 1: SPECIAL DRIVES
  {
    id: 1,
    name: "Conviction Excellence",
    icon: Gavel,
    color: "text-yellow-500",
    bgColor: "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20",
    borderColor: "border-yellow-500/50",
    earned: true,
    date: "2024-01-15",
    criteria: "Achieved 90%+ conviction rate in general cases",
    category: "convictions",
    tier: "gold",
    description: "This prestigious gold medal recognizes exceptional performance in securing convictions across all case types. Officers who achieve this badge demonstrate outstanding investigative skills, evidence collection, and prosecution support that leads to successful court outcomes.",
    issuingAuthority: "State Police Headquarters - Criminal Investigation Department",
    requirements: [
      "Maintain 90% or higher conviction rate for minimum 6 months",
      "Handle at least 50 cases during the evaluation period",
      "Zero cases dismissed due to procedural errors",
      "Receive commendation from Public Prosecutor's office"
    ]
  },
  {
    id: 2,
    name: "NBW Master",
    icon: ScrollText,
    color: "text-amber-700",
    bgColor: "bg-gradient-to-br from-amber-600/20 to-amber-800/20",
    borderColor: "border-amber-700/50",
    earned: true,
    date: "2024-01-10",
    criteria: "25+ Non-Bailable Warrants executed successfully",
    category: "special-drives",
    tier: "bronze",
    description: "Awarded for exemplary performance in executing Non-Bailable Warrants (NBW). This badge recognizes officers who demonstrate exceptional tracking skills, strategic planning, and successful apprehension of absconding accused persons.",
    issuingAuthority: "District Police - Warrant Execution Cell",
    requirements: [
      "Successfully execute 25 or more NBW within 12 months",
      "Maintain 80% success rate in warrant execution",
      "Complete mandatory training on warrant procedures",
      "Zero complaints regarding execution protocol"
    ]
  },
  {
    id: 3,
    name: "Firearm Control Commendation",
    icon: Crosshair,
    color: "text-slate-600",
    bgColor: "bg-gradient-to-br from-slate-500/20 to-slate-700/20",
    borderColor: "border-slate-600/50",
    earned: true,
    date: "2024-01-05",
    criteria: "Successful drive against illegal firearms",
    category: "special-drives",
    tier: "bronze",
    description: "This commendation bar honors officers who have made significant contributions in controlling illegal firearms. It recognizes dedication to making communities safer by removing illegal weapons from circulation.",
    issuingAuthority: "State Arms Control Authority",
    requirements: [
      "Participate in minimum 3 firearm seizure operations",
      "Successfully seize at least 15 illegal firearms",
      "Complete Arms Act training certification",
      "Submit detailed reports on each seizure"
    ]
  },
  {
    id: 4,
    name: "Sand Mining Enforcement Shield",
    icon: Truck,
    color: "text-gray-500",
    bgColor: "bg-gradient-to-br from-gray-400/20 to-gray-600/20",
    borderColor: "border-gray-500/50",
    earned: true,
    date: "2023-12-20",
    criteria: "Drive against illegal sand mining - 15+ cases resolved",
    category: "special-drives",
    tier: "silver",
    description: "Recognition for outstanding work in preventing environmental crimes related to illegal sand mining. Officers earning this shield have demonstrated commitment to protecting natural resources and enforcing environmental laws.",
    issuingAuthority: "State Environment & Mining Department",
    requirements: [
      "Register minimum 15 cases against illegal mining",
      "Conduct regular patrolling in mining zones",
      "Coordinate with Mining Department officials",
      "Achieve 70% conviction rate in filed cases"
    ]
  },
  {
    id: 5,
    name: "Missing Persons Recovery",
    icon: Compass,
    color: "text-blue-500",
    bgColor: "bg-gradient-to-br from-blue-400/20 to-blue-600/20",
    borderColor: "border-blue-500/50",
    earned: true,
    date: "2023-12-15",
    criteria: "Successfully traced and recovered 20+ missing persons",
    category: "special-drives",
    tier: "silver",
    description: "This silver and blue enamel badge symbolizes hope and dedication in search and rescue operations. It honors officers who have reunited families by successfully tracing and recovering missing persons.",
    issuingAuthority: "State Police - Missing Persons Bureau",
    requirements: [
      "Successfully trace and recover 20+ missing persons",
      "Maintain detailed case documentation",
      "Complete search and rescue training",
      "Coordinate with NGOs and community organizations"
    ]
  },
  {
    id: 6,
    name: "Case Closure Champion",
    icon: FolderCheck,
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-500/20 to-green-700/20",
    borderColor: "border-green-600/50",
    earned: false,
    date: null,
    criteria: "Close 50+ pending cognizable cases within 6 months",
    category: "special-drives",
    tier: "gold",
    description: "The most coveted award for officers who excel in closing pending cases efficiently. This gold badge represents dedication to justice and excellence in case management, ensuring timely closure of cognizable offenses.",
    issuingAuthority: "State Police Headquarters - Case Monitoring Cell",
    requirements: [
      "Close minimum 50 pending cognizable cases within 6 months",
      "Maintain quality standards in investigation",
      "Achieve 85% charge-sheet filing rate",
      "Reduce pendency in assigned jurisdiction by 30%"
    ]
  },
  {
    id: 7,
    name: "Narcotics Enforcement Shield",
    icon: Leaf,
    color: "text-emerald-600",
    bgColor: "bg-gradient-to-br from-emerald-500/20 to-emerald-700/20",
    borderColor: "border-emerald-600/50",
    earned: true,
    date: "2024-01-08",
    criteria: "35+ NDPS cases resolved with convictions",
    category: "special-drives",
    tier: "silver",
    description: "A prestigious silver police shield awarded for exceptional work in narcotics enforcement under the NDPS Act. This badge recognizes officers who have significantly contributed to the fight against drug trafficking.",
    issuingAuthority: "State Anti-Narcotics Cell",
    requirements: [
      "Register and investigate 35+ NDPS Act cases",
      "Achieve minimum 75% conviction rate",
      "Complete specialized narcotics investigation training",
      "Conduct at least 5 major drug seizure operations"
    ]
  },
  {
    id: 8,
    name: "Excise Violation Enforcer",
    icon: Wine,
    color: "text-orange-700",
    bgColor: "bg-gradient-to-br from-orange-600/20 to-orange-800/20",
    borderColor: "border-orange-700/50",
    earned: false,
    date: null,
    criteria: "Successfully prosecute 30+ excise act violations",
    category: "special-drives",
    tier: "bronze",
    description: "Recognition for diligent enforcement of excise laws and regulations. This circular bronze badge honors officers who work to prevent illegal liquor trade and excise violations.",
    issuingAuthority: "State Excise Department",
    requirements: [
      "Register minimum 30 excise violation cases",
      "Conduct regular raids on illegal distilleries",
      "Complete excise law enforcement training",
      "Achieve 60% conviction rate in excise cases"
    ]
  },

  // PART 2: CONVICTION SPECIFICS
  {
    id: 9,
    name: "DUI Conviction Badge",
    icon: CarFront,
    color: "text-red-600",
    bgColor: "bg-gradient-to-br from-red-500/20 to-red-700/20",
    borderColor: "border-red-600/50",
    earned: true,
    date: "2024-01-12",
    criteria: "20+ convictions in drunken driving cases",
    category: "convictions",
    tier: "silver",
    description: "A silver shield badge recognizing exceptional work in prosecuting Driving Under Influence cases. Officers earning this badge have demonstrated unwavering commitment to road safety and public welfare through successful DUI prosecutions.",
    issuingAuthority: "State Traffic Police Department",
    requirements: [
      "Successfully prosecute minimum 20 drunk driving cases",
      "Achieve 70% conviction rate in DUI prosecutions",
      "Complete breathalyzer operation certification",
      "Conduct public awareness campaigns on drunk driving"
    ]
  },
  {
    id: 10,
    name: "Speedy Trial Gold",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20",
    borderColor: "border-yellow-500/50",
    earned: false,
    date: null,
    criteria: "Secure 15+ convictions through speedy trials (< 3 months)",
    category: "convictions",
    tier: "gold",
    description: "The highest honor for officers who exemplify swift justice delivery. This golden lightning bolt badge represents efficiency, dedication, and excellence in fast-tracking criminal prosecutions while maintaining investigation quality standards.",
    issuingAuthority: "State Judiciary Liaison Cell - Police Headquarters",
    requirements: [
      "Achieve minimum 15 convictions within 3 months of charge-sheet",
      "Maintain investigation quality standards",
      "Ensure zero adjournments from prosecution side",
      "Complete fast-track court procedure training"
    ]
  },

  // PART 3: TOP-TIER AWARDS
  {
    id: 11,
    name: "Medal of Valor - Elite Detection",
    icon: Medal,
    color: "text-yellow-400",
    bgColor: "bg-gradient-to-br from-yellow-300/30 to-red-500/30",
    borderColor: "border-yellow-400/60",
    earned: false,
    date: null,
    criteria: "Most prestigious award - Major crime detection & resolution",
    category: "elite-awards",
    tier: "gold",
    description: "The most prestigious award in the Elite category, reserved for officers who demonstrate extraordinary investigative capabilities. This gold and red enamel medal symbolizes unparalleled excellence in crime detection, case resolution, and professional dedication.",
    issuingAuthority: "Director General of Police - State Police",
    requirements: [
      "Solve minimum 3 high-profile/sensitive cases OR achieve 95%+ detection rate",
      "Demonstrate exemplary investigation and analytical skills",
      "Receive special commendation from senior officers",
      "Maintain outstanding service record with no major complaints"
    ]
  },
  {
    id: 12,
    name: "Championship Trophy",
    icon: Trophy,
    color: "text-yellow-500",
    bgColor: "bg-gradient-to-br from-yellow-400/30 to-yellow-600/30",
    borderColor: "border-yellow-500/60",
    earned: false,
    date: null,
    criteria: "Overall excellence - Top 3 in district for consecutive 3 months",
    category: "elite-awards",
    tier: "gold",
    description: "The ultimate achievement - a golden championship trophy awarded to the overall best performing officers at the district level. This award represents comprehensive excellence across all policing parameters and sets the benchmark for others to follow.",
    issuingAuthority: "District Police Chief Office",
    requirements: [
      "Rank in Top 3 in district performance metrics for 3 consecutive months",
      "Achieve excellence across all KPIs (detection, conviction, community policing)",
      "Maintain exemplary discipline and conduct record",
      "Demonstrate leadership, innovation, and mentorship qualities"
    ]
  },
];

export const BadgesSection = () => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);

  const earnedCount = badges.filter(b => b.earned).length;
  const progressPercentage = (earnedCount / badges.length) * 100;

  const specialDrives = badges.filter(b => b.category === "special-drives");
  const convictions = badges.filter(b => b.category === "convictions");
  const eliteAwards = badges.filter(b => b.category === "elite-awards");

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "special-drives": return "Special Enforcement Drives";
      case "convictions": return "Conviction Excellence";
      case "elite-awards": return "Elite Awards & Honors";
      default: return "";
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "special-drives": return "Recognition for specialized law enforcement operations";
      case "convictions": return "Awards for prosecution and conviction achievements";
      case "elite-awards": return "Highest honors for exceptional service and performance";
      default: return "";
    }
  };

  const renderBadgeCard = (badge: BadgeData) => {
    const Icon = badge.icon;
    return (
      <Card
        key={badge.id}
        onClick={() => setSelectedBadge(badge)}
        className={`glass-card ${badge.borderColor} border-2 ${badge.earned ? "animate-glow hover:shadow-2xl" : "opacity-60 grayscale"
          } transition-all duration-500 hover:scale-105 cursor-pointer group overflow-hidden relative`}
      >
        {/* Background gradient for earned badges */}
        {badge.earned && (
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}

        {/* Tier badge */}
        <div className="absolute top-3 right-3 z-20">
          <Badge
            variant="outline"
            className={`text-xs font-bold ${badge.tier === 'gold' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' :
              badge.tier === 'silver' ? 'bg-gray-400/20 border-gray-400 text-gray-400' :
                'bg-amber-700/20 border-amber-700 text-amber-700'
              }`}
          >
            {badge.tier.toUpperCase()}
          </Badge>
        </div>

        <CardHeader className="relative z-10">
          <div className={`w-24 h-24 rounded-full ${badge.bgColor} flex items-center justify-center mx-auto mb-4 border-2 ${badge.borderColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className={`h-12 w-12 ${badge.color} ${badge.earned ? 'group-hover:animate-bounce' : ''}`} />
          </div>
          <CardTitle className="text-center text-base font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {badge.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-3 relative z-10">
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 min-h-[40px]">
            {badge.criteria}
          </p>

          {badge.earned ? (
            <div className="space-y-2">
              <Badge variant="achievement" className="animate-glow">
                <Star className="h-3 w-3 mr-1" />
                Earned
              </Badge>
              <p className="text-xs text-gold/70 font-medium">
                Awarded on {badge.date}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge variant="glass" className="border-dashed">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
              <div className="w-full bg-muted/30 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-primary/50 to-accent/50 h-1.5 rounded-full w-3/5 transition-all" />
              </div>
            </div>
          )}
        </CardContent>

        {/* Decorative elements for earned badges */}
        {badge.earned && (
          <>
            <div className="absolute top-2 left-2 w-2 h-2 bg-gold rounded-full animate-ping" />
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-accent rounded-full animate-pulse" />
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gold via-accent to-primary bg-clip-text text-transparent">
          Badges & Achievements
        </h1>
        <p className="text-muted-foreground text-lg">Recognition for excellence in law enforcement</p>
      </div>

      {/* Progress Overview */}
      <Card className="glass-card border-gold/30 bg-gradient-to-br from-gold/10 via-accent/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-accent/20 flex items-center justify-center shadow-lg">
                <Trophy className="h-5 w-5 text-gold animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent font-bold text-xl">
                Overall Achievement Progress
              </span>
            </span>
            <Badge variant="gold" className="animate-glow text-lg px-4 py-2">
              {earnedCount} / {badges.length} Earned
            </Badge>
          </CardTitle>
          <CardDescription className="text-muted-foreground/80">Your journey to excellence in service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Progress value={progressPercentage} className="h-4 bg-gradient-to-r from-primary/20 via-accent/30 to-gold/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              Next Badge: <span className="text-gold font-semibold">
                {badges.find(b => !b.earned)?.name || "All badges earned!"}
              </span>
            </p>
            <Badge variant="glassGold" className="text-sm px-3 py-1">
              {Math.round(progressPercentage)}% Complete
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Special Drives Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b border-gold/20">
          <Shield className="h-6 w-6 text-gold" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">{getCategoryTitle("special-drives")}</h2>
            <p className="text-sm text-muted-foreground">{getCategoryDescription("special-drives")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {specialDrives.map(renderBadgeCard)}
        </div>
      </div>

      {/* Conviction Excellence Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b border-accent/20">
          <Gavel className="h-6 w-6 text-accent" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">{getCategoryTitle("convictions")}</h2>
            <p className="text-sm text-muted-foreground">{getCategoryDescription("convictions")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {convictions.map(renderBadgeCard)}
        </div>
      </div>

      {/* Elite Awards Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b border-yellow-500/30">
          <Trophy className="h-7 w-7 text-yellow-500 animate-pulse" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">{getCategoryTitle("elite-awards")}</h2>
            <p className="text-sm text-muted-foreground">{getCategoryDescription("elite-awards")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eliteAwards.map(renderBadgeCard)}
        </div>
      </div>

      {/* Stats Summary */}
      <Card className="glass-card border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievement Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gold/10 border border-gold/20">
              <div className="text-3xl font-bold text-gold">{badges.filter(b => b.tier === 'gold' && b.earned).length}</div>
              <div className="text-sm text-muted-foreground">Gold Badges</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-400/10 border border-gray-400/20">
              <div className="text-3xl font-bold text-gray-400">{badges.filter(b => b.tier === 'silver' && b.earned).length}</div>
              <div className="text-sm text-muted-foreground">Silver Badges</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-amber-700/10 border border-amber-700/20">
              <div className="text-3xl font-bold text-amber-700">{badges.filter(b => b.tier === 'bronze' && b.earned).length}</div>
              <div className="text-sm text-muted-foreground">Bronze Badges</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-3xl font-bold text-primary">{earnedCount}</div>
              <div className="text-sm text-muted-foreground">Total Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge Details Dialog */}
      <Dialog open={selectedBadge !== null} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="max-w-2xl">
          {selectedBadge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  {selectedBadge.icon && <selectedBadge.icon className={`h-8 w-8 ${selectedBadge.color}`} />}
                  {selectedBadge.name}
                  <Badge
                    variant="outline"
                    className={`ml-auto text-xs font-bold ${selectedBadge.tier === 'gold' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' :
                      selectedBadge.tier === 'silver' ? 'bg-gray-400/20 border-gray-400 text-gray-400' :
                        'bg-amber-700/20 border-amber-700 text-amber-700'
                      }`}
                  >
                    {selectedBadge.tier.toUpperCase()}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed pt-2">
                  {selectedBadge.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Issuing Authority */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-1">Issuing Authority</h4>
                      <p className="text-sm text-muted-foreground">{selectedBadge.issuingAuthority}</p>
                    </div>
                  </div>
                </div>

                {/* Criteria */}
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-accent mb-1">Qualification Criteria</h4>
                      <p className="text-sm text-muted-foreground">{selectedBadge.criteria}</p>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {selectedBadge.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground mt-0.5">•</span>
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status */}
                {selectedBadge.earned ? (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-green-500">Badge Earned</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Awarded on {selectedBadge.date}</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold text-orange-500">Badge Locked - Requirements Not Met</span>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
