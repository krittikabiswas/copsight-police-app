import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useNavigate, useLocation } from "react-router-dom";
import { useHybridTranslation } from "@/hooks/useHybridTranslation";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useHybridTranslation();

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
              {t('nav.home')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/about")}
              className="text-foreground hover:text-primary"
            >
              {t('nav.about')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/register")}
              className="text-foreground hover:text-primary"
            >
              {t('nav.register')}
            </Button>
            <LanguageSelector />
            <ThemeToggle />
            <Button
              variant="default"
              onClick={handleLoginClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t('nav.login')}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};