
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cva } from "class-variance-authority";

const statCardVariants = cva(
  "flex items-center justify-between p-4 h-full", 
  {
    variants: {
      variant: {
        default: "bg-white",
        primary: "bg-gradient-to-br from-whatsapp-light to-whatsapp-dark text-white",
        outline: "border-2 border-whatsapp",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: "default" | "primary" | "outline";
  description?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  variant = "default",
  description 
}: StatCardProps) {
  return (
    <Card className="hover-scale overflow-hidden">
      <CardContent className={statCardVariants({ variant })}>
        <div>
          <p className={`font-medium text-sm ${variant === "primary" ? "text-white/80" : "text-muted-foreground"}`}>
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && (
            <p className={`text-xs mt-1 ${variant === "primary" ? "text-white/70" : "text-muted-foreground"}`}>
              {description}
            </p>
          )}
        </div>
        <div className={`text-2xl ${variant === "primary" ? "text-white" : "text-whatsapp"}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
