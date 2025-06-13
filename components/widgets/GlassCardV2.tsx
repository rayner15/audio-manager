import { ReactNode, CSSProperties } from "react";
import "../../styles/glass.css";

interface GlassCardV2Props {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function GlassCardV2({
  children,
  className = "",
  style,
}: GlassCardV2Props) {
  return (
    <div
      className={`glass-card glass-card-profile w-full ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
