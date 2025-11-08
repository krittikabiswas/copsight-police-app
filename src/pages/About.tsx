import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, Smartphone, Globe, Camera, Bell, TrendingUp, Eye, Users, Zap, Target, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHybridTranslation } from "@/hooks/useHybridTranslation";

const About = () => {
  const navigate = useNavigate();
  const { t } = useHybridTranslation();

  const features = [
    {
      icon: MapPin,
      title: t('about.gpsTracking'),
      description: t('about.gpsTrackingDesc'),
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Eye,
      title: t('about.surveillance'),
      description: t('about.surveillanceDesc'),
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Users,
      title: t('about.community'),
      description: t('about.communityDesc'),
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Zap,
      title: t('about.alerts'),
      description: t('about.alertsDesc'),
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Target,
      title: t('about.analytics'),
      description: t('about.analyticsDesc'),
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Trophy,
      title: t('about.achievements'),
      description: t('about.achievementsDesc'),
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ];

  const smallFeatures = [
    {
      icon: Smartphone,
      title: t('about.mobileFirst'),
      description: t('about.mobileFirstDesc')
    },
    {
      icon: Globe,
      title: t('about.multiLanguage'),
      description: t('about.multiLanguageDesc')
    },
    {
      icon: Camera,
      title: t('about.photoEvidence'),
      description: t('about.photoEvidenceDesc')
    },
    {
      icon: Bell,
      title: t('about.pushNotifications'),
      description: t('about.pushNotificationsDesc')
    },
    {
      icon: TrendingUp,
      title: t('about.performanceMetrics'),
      description: t('about.performanceMetricsDesc')
    }
  ];

  const stats = [
    { label: t('about.activeOfficers'), value: "2,500+", suffix: "" },
    { label: t('about.citiesCovered'), value: "45+", suffix: "" },
    { label: t('about.incidentsResolved'), value: "15,000+", suffix: "" },
    { label: t('about.responseTime'), value: "3.5", suffix: t('about.min') }
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
              {t('about.badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('about.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                onClick={() => navigate('/register')}
              >
                {t('about.getStarted')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/gis-mapping')}
              >
                {t('about.viewGIS')}
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
              {t('about.coreFeatures')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.coreFeaturesDesc')}
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
              {t('about.additionalFeatures')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('about.additionalFeaturesDesc')}
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
                  {t('about.mission')}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {t('about.missionText')}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    {t('about.transparency')}
                  </Badge>
                  <Badge variant="outline" className="border-accent/50 text-accent">
                    {t('about.innovation')}
                  </Badge>
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    {t('about.community')}
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                    {t('about.safety')}
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
            {t('about.ctaTitle')}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('about.ctaDesc')}
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            onClick={() => navigate('/register')}
          >
            {t('about.startJourney')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;