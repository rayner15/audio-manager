"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Dynamically import SwaggerUI with SSR disabled
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <div className="p-4">Loading API documentation...</div>,
});

interface SwaggerClientProps {
  spec: Record<string, any>;
}

export default function SwaggerClient({ spec }: SwaggerClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-4">Loading API documentation...</div>;
  }

  return <SwaggerUI spec={spec} />;
}
