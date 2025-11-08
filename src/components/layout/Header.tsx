import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    if (location.pathname === '/') {
      // If on home page, scroll to login section
      const loginSection = document.getElementById('login-section');
      if (loginSection) {
        loginSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on other pages, navigate to home and then scroll
      navigate('/', { state: { scrollToLogin: true } });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">CopSight</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-foreground hover:text-primary"
            >
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/about")}
              className="text-foreground hover:text-primary"
            >
              About Us
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/register")}
              className="text-foreground hover:text-primary"
            >
              Register
            </Button>
            <Button
              variant="default"
              onClick={handleLoginClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Login
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};