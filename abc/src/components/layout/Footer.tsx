import { useNavigate } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from "lucide-react";
import { useHybridTranslation } from "@/hooks/useHybridTranslation";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { t } = useHybridTranslation();

  const quickLinks = [
    { nameKey: "nav.home", path: "/" },
    { nameKey: "nav.about", path: "/about" },
    { nameKey: "nav.register", path: "/register" },
  ];

  const legalLinks = [
    { nameKey: "footer.privacyPolicy", path: "#" },
    { nameKey: "footer.termsOfService", path: "#" },
    { nameKey: "footer.cookiePolicy", path: "#" },
    { nameKey: "footer.accessibility", path: "#" },
  ];

  const contactInfo = [
    { icon: Mail, textKey: "footer.email", href: "mailto:contact@copsight.gov.in" },
    { icon: Phone, textKey: "footer.phone", href: "tel:+911800XXXXXX" },
    { icon: MapPin, textKey: "footer.address", href: "#" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="bg-gradient-to-br from-background via-card to-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">{t('footer.brand')}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors group"
                  >
                    <Icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {t(link.nameKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(link.nameKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <li key={index}>
                    <a
                      href={contact.href}
                      className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span>{t(contact.textKey)}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {currentYear} {t('footer.copyright')}
              </p>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">
                {t('footer.developedBy')} <span className="text-primary font-semibold">{t('footer.team')}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">
                {t('footer.secured')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};