import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, UserIcon, MailIcon } from "lucide-react";

import Form from "@/components/form/Form";
import { MIN_PASSWORD_LENGTH } from "@/constants/register";
import { RegisterFormData } from "@/interface/register";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  // Password visibility state
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  // Form methods
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

  // Toggle handlers
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  // Password field icons
  const passwordIcon = (
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
  );

  const confirmPasswordIcon = (
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
  );

  // Common input styles
  const inputClassName =
    "apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50";

  return (
    <>
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Registration form */}
      <Form
        useFormMethods={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Name fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Input
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
            rules={{ required: "First name is required" }}
            className={inputClassName}
          />

          <Form.Input
            name="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            rules={{ required: "Last name is required" }}
            className={inputClassName}
          />
        </div>

        {/* Username field */}
        <Form.Input
          name="username"
          label="Username"
          placeholder="Choose a username"
          rules={{ required: "Username is required" }}
          icon={<UserIcon className="w-4 h-4 text-gray-400" />}
          className={inputClassName}
        />

        {/* Email field */}
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
          className={inputClassName}
        />

        {/* Password field */}
        <Form.Input
          name="password"
          label="Password"
          type={isVisible ? "text" : "password"}
          placeholder="Create a secure password"
          rules={{
            required: "Password is required",
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
            },
          }}
          icon={passwordIcon}
          className={inputClassName}
        />

        {/* Confirm password field */}
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
          icon={confirmPasswordIcon}
          className={inputClassName}
        />

        {/* Form actions */}
        <div className="space-y-4">
          <div className="h-px bg-gray-200"></div>

          {/* Submit button */}
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

          {/* Login link */}
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
    </>
  );
};

export default RegisterForm;
