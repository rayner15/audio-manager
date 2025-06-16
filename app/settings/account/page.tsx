"use client";

import DeleteAccountForm from "@/components/widgets/DeleteAccountForm";
import PasswordForm from "@/components/widgets/PasswordForm";
import UsernameForm from "@/components/widgets/UsernameForm";
import { ReactNode } from "react";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsCard title="Change Username">
        <UsernameForm />
      </SettingsCard>

      <SettingsCard title="Change Password">
        <PasswordForm />
      </SettingsCard>

      <SettingsCard title="Delete Account" titleColor="text-red-600">
        <DeleteAccountForm />
      </SettingsCard>
    </div>
  );
}

interface SettingsCardProps {
  title: string;
  children: ReactNode;
  titleColor?: string;
}

function SettingsCard({
  title,
  children,
  titleColor = "text-black",
}: SettingsCardProps) {
  return (
    <div className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-2xl p-6 shadow-lg">
      <h2 className={`text-2xl font-semibold mb-6 ${titleColor}`}>{title}</h2>
      {children}
    </div>
  );
}
