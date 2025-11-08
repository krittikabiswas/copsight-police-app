import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  Shield, 
  Trophy, 
  MapPin, 
  Eye, 
  Users, 
  TrendingUp,
  Award,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useHybridTranslation } from "@/hooks/useHybridTranslation";
import { LoginCard } from "@/components/landing/LoginCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/police-hero-bg.jpg";
import badgeImage from "@/assets/police-badge.png";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useHybridTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100 && !showLogin) {
        setShowLogin(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Check if we should scroll to login section
    const state = location.state as { scrollToLogin?: boolean };
    if (state?.scrollToLogin) {
      loginRef.current?.scrollIntoView({ behavior: "smooth" });
      // Clear the state
      window.history.replaceState({}, document.title);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showLogin, location.state]);

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: Shield,
      title: "Real-Time Tracking",
      description: "Monitor police activities and case progress in real-time with GPS-enabled tracking",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Trophy,
      title: "Gamified Achievements",
      description: "Earn badges and rewards for excellent performance in special drives and convictions",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: MapPin,
      title: "GIS Mapping",
      description: "Visualize crime data across India with interactive maps and heatmaps",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Eye,
      title: "Transparent Analytics",
      description: "Data-driven insights for performance metrics and accountability",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Users,
      title: "Community Leaderboard",
      description: "Recognize top performers and foster healthy competition",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: TrendingUp,
      title: "Performance Dashboard",
      description: "Comprehensive analytics for narcotics, NBW, convictions, and more",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    }
  ];

  const stats = [
    { label: "Active Officers", value: "2,500+", icon: Users },
    { label: "Cases Resolved", value: "15,000+", icon: CheckCircle2 },
    { label: "Badges Earned", value: "8,500+", icon: Award },
    { label: "States Covered", value: "28", icon: MapPin }
  ];

  const steps = [
    {
      number: "01",
      title: "Register & Verify",
      description: "Create your account with Police ID verification"
    },
    {
      number: "02",
      title: "Track Performance",
      description: "Monitor your cases, convictions, and special drives"
    },
    {
      number: "03",
      title: "Earn Recognition",
      description: "Unlock badges and climb the leaderboard"
    },
    {
      number: "04",
      title: "Drive Excellence",
      description: "Use data insights to improve policing outcomes"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 space-y-6 max-w-4xl mx-auto animate-fade-in">
          <img
            src={badgeImage}
            alt="Police Badge"
            className="w-24 h-24 mx-auto animate-float"
          />
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Transparency
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-accent font-medium">
            {t('hero.subtitle')}
          </p>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={scrollToLogin}
            >
              {t('hero.getStarted')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
              onClick={() => navigate('/about')}
            >
              {t('hero.learnMore')}
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToLogin}
          className="absolute bottom-8 inset-x-0 z-10 flex justify-center animate-bounce cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-2 text-accent group-hover:text-primary transition-colors text-center">
            <span className="text-sm font-medium">{t('hero.scrollDown')}</span>
            <ChevronDown className="h-6 w-6" />
          </div>
        </button>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card border-primary/20 text-center hover:scale-105 transition-transform duration-300">
                <CardContent className="pt-6 space-y-3">
                  <stat.icon className="h-10 w-10 mx-auto text-primary" />
                  <div className="text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              <Target className="h-4 w-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to enhance police performance through technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              <Zap className="h-4 w-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="glass-card border-primary/30 h-full hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="text-6xl font-bold text-primary/20 mb-2">{step.number}</div>
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="border-primary/50 text-primary">
                <Award className="h-4 w-4 mr-2" />
                Why Choose CopSight
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Transform Law Enforcement
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                CopSight revolutionizes police performance tracking with cutting-edge technology, gamification, and data-driven insights. Recognize excellence, drive accountability, and build safer communities.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time performance analytics",
                  "Gamified badge system for motivation",
                  "Transparent accountability metrics",
                  "GIS-based crime visualization",
                  "Multi-language support (23+ languages)",
                  "Mobile-first design"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button 
                size="lg" 
                className="mt-4"
                onClick={() => navigate('/about')}
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <Card className="glass-card border-primary/30 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
                    <Trophy className="h-10 w-10 text-yellow-500" />
                    <div>
                      <div className="font-bold text-lg">12 Badge Categories</div>
                      <div className="text-sm text-muted-foreground">Gold, Silver & Bronze tiers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-lg">
                    <MapPin className="h-10 w-10 text-green-500" />
                    <div>
                      <div className="font-bold text-lg">GIS Crime Mapping</div>
                      <div className="text-sm text-muted-foreground">Interactive heatmaps & markers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg">
                    <TrendingUp className="h-10 w-10 text-blue-500" />
                    <div>
                      <div className="font-bold text-lg">Performance Dashboard</div>
                      <div className="text-sm text-muted-foreground">Real-time analytics & insights</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section
        id="login-section"
        ref={loginRef}
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20"
      >
        <div className={`w-full max-w-md mx-auto transition-all duration-700 ${showLogin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <LoginCard />
        </div>
      </section>
    </div>
  );
};

export default Index;
