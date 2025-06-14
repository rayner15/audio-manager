import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Providers } from "../components/providers";
import "./globals.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Audio Hub - Manage Your Audio Files",
  description: "Upload, manage, and play your audio files with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={roboto.className}>
        <Providers>
          <main className="min-h-screen bg-white">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
