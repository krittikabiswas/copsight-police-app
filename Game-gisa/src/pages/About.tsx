import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, Smartphone, Globe, Camera, Bell, TrendingUp, Eye, Users, Zap, Target, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: "Real-Time GPS Tracking",
      description: "Monitor officer locations and patrol routes with precise GPS technology",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Eye,
      title: "Live Surveillance",
      description: "Integrated camera systems for real-time monitoring and evidence collection",
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Users,
      title: "Community Connect",
      description: "Bridge the gap between law enforcement and citizens through digital platforms",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Rapid emergency response with automated alert systems and notifications",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Target,
      title: "Crime Analytics",
      description: "AI-powered crime pattern analysis and predictive policing capabilities",
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Gamified approach to encourage officer excellence and community engagement",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ];

  const smallFeatures = [
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized for mobile devices with responsive design"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Support for multiple Indian languages"
    },
    {
      icon: Camera,
      title: "Photo Evidence",
      description: "Capture and upload incident photos instantly"
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Real-time alerts and updates"
    },
    {
      icon: TrendingUp,
      title: "Performance Metrics",
      description: "Track and analyze system performance"
    }
  ];

  const stats = [
    { label: "Active Officers", value: "2,500+", suffix: "" },
    { label: "Cities Covered", value: "45+", suffix: "" },
    { label: "Incidents Resolved", value: "15,000+", suffix: "" },
    { label: "Response Time", value: "3.5", suffix: "min" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
              <Shield className="h-4 w-4 mr-2" />
              Securing Communities Through Technology
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6">
              About CopSight
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Revolutionizing law enforcement with cutting-edge technology, real-time monitoring,
              and community engagement for a safer India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/gis-mapping')}
              >
                View GIS Mapping
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card text-center">
                <CardContent className="py-6">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                    {stat.suffix && <span className="text-lg text-muted-foreground ml-1">{stat.suffix}</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Core Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced tools and technologies designed to enhance law enforcement capabilities
              and strengthen community relationships.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass-card hover:scale-105 transition-transform duration-300 group">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Small Features Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Additional Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thoughtful details that enhance user experience and system functionality.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {smallFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="glass-card max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  To empower law enforcement agencies with state-of-the-art technology solutions
                  that enhance public safety, improve response times, and foster trust between
                  police officers and the communities they serve.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    Transparency
                  </Badge>
                  <Badge variant="outline" className="border-accent/50 text-accent">
                    Innovation
                  </Badge>
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    Community
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                    Safety
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Law Enforcement?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join us in building safer communities through technology. Get started with CopSight today.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            onClick={() => navigate('/register')}
          >
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;