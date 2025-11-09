import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { LoginCard } from "@/components/landing/LoginCard";
import heroImage from "@/assets/police-hero-bg.jpg";
import badgeImage from "@/assets/police-badge.png";

const Index = () => {
  const location = useLocation();
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

     // Check if we should scroll to login or about section
    const state = location.state as { scrollToLogin?: boolean; scrollToAbout?: boolean };
    if (state?.scrollToLogin) {
      loginRef.current?.scrollIntoView({ behavior: "smooth" });
      // Clear the state
      window.history.replaceState({}, document.title);
    } else if (state?.scrollToAbout) {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
        // Clear the state
        window.history.replaceState({}, document.title);
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showLogin]);

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[85vh] flex flex-col items-center justify-center overflow-hidden"
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
          <h1 className="text-50xl md:text-6xl font-bold text-foreground leading-tight">
            CopSight
            <br />
            {/* <span className="text-primary">for Police Good Work Recognition</span> */}
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
          className="absolute bottom-8 inset-x-0 z-10 flex justify-center animate-slow-bounce cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-2 text-accent group-hover:text-primary transition-colors text-center">
            <span className="text-sm font-medium">Swipe Down to Login</span>
            <ChevronDown className="h-4 w-8" />
          </div>
        </button>
      </section>

      {/* About Us Section */}
      <section id="about-section" className="py-24 bg-gradient-to-b from-background via-background/90 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About CopSight</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg bg-card hover:bg-accent/10 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-muted-foreground">Promoting openness and accountability in law enforcement through data-driven insights.</p>
            </div>

            <div className="p-6 rounded-lg bg-card hover:bg-accent/10 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recognition</h3>
              <p className="text-muted-foreground">Acknowledging and rewarding exceptional police performance and community service.</p>
            </div>

            <div className="p-6 rounded-lg bg-card hover:bg-accent/10 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">Building stronger bonds between law enforcement and the communities they serve.</p>
            </div>
          </div>

          <div className="mt-16 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-muted-foreground">
              CopSight is dedicated to transforming law enforcement recognition through innovative technology. 
              We believe in creating a future where outstanding police work is consistently identified, 
              celebrated, and used as a benchmark for excellence in public service.
            </p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section 
        id="login-section"
        ref={loginRef}
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        
        {/* Login Card */}
        <div className={`relative z-10 w-full max-w-md mx-auto transition-all duration-700 ${showLogin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <LoginCard />
        </div>
      </section>
    </div>
  );
};

export default Index;
