import { ReactNode, CSSProperties } from "react";
import "../../styles/glass.css";

interface GlassCardProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function GlassCard({
  children,
  className = "",
  style,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card glass-card-profile w-full ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
