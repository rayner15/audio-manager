import { ReactNode, CSSProperties } from "react";
import "../../styles/glass.css";

interface StaticGlassCardProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function StaticGlassCard({
  children,
  className = "",
  style,
}: StaticGlassCardProps) {
  return (
    <div
      className={`glass-card glass-card-profile w-full ${className}`}
      style={{
        transform: "none",
        transition: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
