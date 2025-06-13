"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import RegisterForm from "@/components/form/RegisterForm";
import RegisterSuccess from "@/components/success/RegisterSuccess";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/widgets/Logo";
import { RegisterFormData } from "@/interface/register";
import { validateRegisterForm } from "@/utils/register";
import AnimatedBackground from "@/components/widgets/AnimatedBackground";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    const validationError = validateRegisterForm(data);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        const responseData = await response.json();
        setError(responseData.error || "Registration failed");
      }
    } catch {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return <RegisterSuccess />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg fade-in-up">
          <Logo
            title="Audio World"
            description="Create your premium audio management account"
          />
          <Card className="apple-card border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Start managing your audio files today
                </p>
              </div>

              <RegisterForm
                onSubmit={onSubmit}
                isLoading={isLoading}
                error={error}
              />
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
