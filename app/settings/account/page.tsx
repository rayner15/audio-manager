"use client";

import React from "react";
import UsernameForm from "@/components/widgets/UsernameForm";
import PasswordForm from "@/components/widgets/PasswordForm";
import DeleteAccountForm from "@/components/widgets/DeleteAccountForm";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Username Form */}
      <div className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Change Username</h2>
        <UsernameForm />
      </div>

      {/* Password Form */}
      <div className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
        <PasswordForm />
      </div>

      {/* Delete Account Form */}
      <div className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-2xl p-6 shadow-lg border-red-100">
        <h2 className="text-2xl font-semibold mb-6 text-red-600">
          Delete Account
        </h2>
        <DeleteAccountForm />
      </div>
    </div>
  );
}
