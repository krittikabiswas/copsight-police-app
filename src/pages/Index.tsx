import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LoginCard } from "@/components/landing/LoginCard";
import heroImage from "@/assets/police-hero-bg.jpg";
import badgeImage from "@/assets/police-badge.png";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100 && !showLogin) {
        setShowLogin(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showLogin]);

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 space-y-6 max-w-4xl mx-auto animate-fade-in">
          <img 
            src={badgeImage} 
            alt="Police Badge" 
            className="w-24 h-24 mx-auto animate-float"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Smart Analytics Dashboard
            <br />
            <span className="text-primary">for Police Good Work Recognition</span>
          </h1>
          <p className="text-lg md:text-xl text-accent font-medium">
            AI-Powered Transparency & Recognition System
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A futuristic platform designed to analyze, recognize, and reward exceptional police performance 
            through data-driven insights and gamified achievements.
          </p>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToLogin}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-2 text-accent group-hover:text-primary transition-colors">
            <span className="text-sm font-medium">Swipe Down to Login</span>
            <ChevronDown className="h-8 w-8" />
          </div>
        </button>
      </section>

      {/* Login Section */}
      <section 
        ref={loginRef}
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20"
      >
        <div className={`transition-all duration-700 ${showLogin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <LoginCard />
        </div>
      </section>
    </div>
  );
};

export default Index;
