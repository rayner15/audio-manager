"use client";

import {
  CheckCircleIcon,
  CloudIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Form from "@/components/form/Form";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/widgets/Logo";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const methods = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const validateForm = (data: RegisterFormData) => {
    if (!data.username.trim()) return "Username is required";
    if (!data.email.trim()) return "Email is required";
    if (!data.password) return "Password is required";
    if (data.password.length < 6)
      return "Password must be at least 6 characters";
    if (data.password !== data.confirmPassword) return "Passwords do not match";
    if (!data.firstName.trim()) return "First name is required";
    if (!data.lastName.trim()) return "Last name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email))
      return "Please enter a valid email address";

    return null;
  };

  const onSubmit = async (data: RegisterFormData) => {
    const validationError = validateForm(data);
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
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-6 apple-hover-scale shadow-2xl">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Audio Hub!
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Your account has been created successfully.
            </p>
            <p className="text-gray-500">
              Redirecting you to the login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 float">
          <SparklesIcon className="w-6 h-6 text-purple-300 opacity-60" />
        </div>
        <div
          className="absolute top-1/3 right-1/4 float"
          style={{ animationDelay: "2s" }}
        >
          <CloudIcon className="w-8 h-8 text-pink-300 opacity-50" />
        </div>
        <div
          className="absolute bottom-1/3 left-1/3 float"
          style={{ animationDelay: "4s" }}
        >
          <ShieldCheckIcon className="w-7 h-7 text-indigo-300 opacity-40" />
        </div>
      </div>

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

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <Form
                useFormMethods={methods}
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Input
                    name="firstName"
                    label="First Name"
                    placeholder="Enter your first name"
                    rules={{ required: "First name is required" }}
                    className="apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                  />
                  <Form.Input
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter your last name"
                    rules={{ required: "Last name is required" }}
                    className="apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                  />
                </div>
                <Form.Input
                  name="username"
                  label="Username"
                  placeholder="Choose a username"
                  rules={{ required: "Username is required" }}
                  icon={<UserIcon className="w-4 h-4 text-gray-400" />}
                  className="apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                />
                <Form.Input
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  }}
                  icon={<MailIcon className="w-4 h-4 text-gray-400" />}
                  className="apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                />
                <Form.Input
                  name="password"
                  label="Password"
                  type={isVisible ? "text" : "password"}
                  placeholder="Create a secure password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  icon={
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="text-gray-400 hover:text-purple-500 focus:outline-none transition-colors duration-200"
                    >
                      {isVisible ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  }
                  className="apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                />
                <Form.Input
                  name="confirmPassword"
                  label="Confirm Password"
                  type={isConfirmVisible ? "text" : "password"}
                  placeholder="Confirm your password"
                  rules={{
                    required: "Please confirm your password",
                    validate: (value: string, formValues: RegisterFormData) =>
                      value === formValues.password || "Passwords do not match",
                  }}
                  icon={
                    <button
                      type="button"
                      onClick={toggleConfirmVisibility}
                      className="text-gray-400 hover:text-purple-500 focus:outline-none transition-colors duration-200"
                    >
                      {isConfirmVisible ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  }
                  className="apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                />
                <div className="space-y-4">
                  <div className="h-px bg-gray-200"></div>
                  <Form.Button
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                    size="lg"
                    variant="gradient"
                    className="rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Form.Button>
                  <p className="text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/"
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </Form>
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
