"use client";

import React from "react";
import ProfileSettingsForm from "@/components/widgets/ProfileSettingsForm";

export default function ProfileSettingsPage() {
  return (
    <div className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
      <ProfileSettingsForm />
    </div>
  );
}
