"use client";

import { ArrowLeft, Settings, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import React from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      <div className="mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-2xl p-4 shadow-lg">
              <nav className="space-y-1">
                <Link
                  href="/settings/profile"
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                    pathname === "/settings/profile"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <UserIcon className="w-5 h-5 mr-3" />
                  <span className="font-medium">Profile Settings</span>
                </Link>

                <Link
                  href="/settings/account"
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                    pathname === "/settings/account"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span className="font-medium">Account Settings</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow">{children}</div>
        </div>
      </div>
    </div>
  );
}
