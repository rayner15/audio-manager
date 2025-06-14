"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            padding: "12px",
            background: "#fff",
            color: "#333",
          },
          success: {
            style: {
              border: "1px solid #10B981",
              background: "#ECFDF5",
            },
            iconTheme: {
              primary: "#10B981",
              secondary: "#ECFDF5",
            },
          },
          error: {
            style: {
              border: "1px solid #EF4444",
              background: "#FEF2F2",
            },
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FEF2F2",
            },
          },
        }}
      />
    </SessionProvider>
  );
}
