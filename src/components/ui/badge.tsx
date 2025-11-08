import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-lg shadow-primary/20 hover:shadow-primary/40",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg shadow-secondary/20 hover:shadow-secondary/40",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-lg shadow-destructive/20 hover:shadow-destructive/40",
        outline: "text-foreground border-border/50 hover:border-border hover:bg-card/50",
        
        // Police-themed premium variants
        gold: "border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 hover:border-gold/50 shadow-lg shadow-gold/20 hover:shadow-gold/40 animate-glow",
        silver: "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent/50 shadow-lg shadow-accent/20 hover:shadow-accent/40",
        bronze: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/50 shadow-lg shadow-primary/20 hover:shadow-primary/40",
        
        // Achievement badges
        achievement: "border-gradient-to-r from-gold/50 to-accent/50 bg-gradient-to-br from-gold/20 via-accent/10 to-primary/20 text-gold hover:from-gold/30 hover:via-accent/20 hover:to-primary/30 shadow-xl shadow-gold/30 hover:shadow-gold/50",
        elite: "border-gradient-to-r from-gold/60 to-primary/60 bg-gradient-to-br from-gold/30 via-primary/20 to-accent/20 text-foreground hover:from-gold/40 hover:via-primary/30 hover:to-accent/30 shadow-2xl shadow-gold/40 hover:shadow-gold/60 animate-pulse",
        
        // Modern glass variants
        glass: "border-border/20 bg-background/30 text-foreground backdrop-blur-md hover:bg-background/40 hover:border-border/40 shadow-lg",
        glassPrimary: "border-primary/30 bg-primary/20 text-primary backdrop-blur-md hover:bg-primary/30 hover:border-primary/50 shadow-lg shadow-primary/20",
        glassGold: "border-gold/30 bg-gold/20 text-gold backdrop-blur-md hover:bg-gold/30 hover:border-gold/50 shadow-lg shadow-gold/20",
        
        // Animated variants
        animated: "border-transparent bg-gradient-to-r from-primary via-accent to-gold text-background font-bold animate-gradient-x hover:scale-105 shadow-lg",
        neon: "border-accent/50 bg-accent/10 text-accent animate-pulse hover:bg-accent/20 hover:border-accent/70 shadow-lg shadow-accent/30 hover:shadow-accent/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
