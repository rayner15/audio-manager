"use client";

import { LogOutIcon, MusicIcon, SettingsIcon, UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function NavigationBar() {
  const { data: session } = useSession();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const dropdown = document.getElementById("user-dropdown");
      const profileButton = document.getElementById("profile-button");

      if (
        profileDropdownOpen &&
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        profileButton &&
        !profileButton.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [profileDropdownOpen]);

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <MusicIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Audio Hub
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Professional
                </p>
              </div>
            </div>
            {session && (
              <div className="relative">
                <motion.button
                  id="profile-button"
                  className="flex items-center focus:outline-none relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md transition-all duration-200 hover:shadow-lg">
                    {session.user?.name?.[0] ||
                      (session.user as any)?.username?.[0] ||
                      "U"}
                  </div>
                  {profileDropdownOpen && (
                    <motion.span
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>

                <div
                  id="user-dropdown"
                  className={`${
                    profileDropdownOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  } absolute right-0 mt-2 w-56 rounded-xl bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200 overflow-hidden z-50 transition-all duration-200 ease-in-out`}
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="font-medium text-blue-600">
                      {(session.user as any)?.username || session.user?.name}
                    </p>
                  </div>
                  <div className="p-2">
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150 ease-in-out">
                      <UserIcon className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150 ease-in-out">
                      <SettingsIcon className="h-4 w-4" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 ease-in-out"
                      onClick={() => signOut()}
                    >
                      <LogOutIcon className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
