import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const hideHeader = location.pathname === "/dashboard" || location.pathname === "/register";
  const hideFooter = location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className={`flex-1 ${!hideHeader ? "mt-16" : ""}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};