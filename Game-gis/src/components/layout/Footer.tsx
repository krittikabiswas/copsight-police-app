export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CopSight. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ by Team Star Quintet
          </p>
        </div>
      </div>
    </footer>
  );
};