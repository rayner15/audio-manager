import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Form from "@/components/form/Form";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
  error?: string;
}

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const methods = useForm<LoginFormData>();

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      <Form
        useFormMethods={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 relative z-20"
      >
        <div className="space-y-4">
          <Form.Input
            name="username"
            label="Username"
            placeholder="Enter your username"
            rules={{ required: "Username is required" }}
          />

          <Form.Input
            name="password"
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            rules={{ required: "Password is required" }}
            icon={
              <button
                type="button"
                onClick={toggleVisibility}
                className="text-gray-400 hover:text-blue-500 focus:outline-none transition-colors duration-200"
              >
                {isVisible ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            }
          />
        </div>
        <div className="h-px bg-gray-200"></div>

        <Form.Button
          type="submit"
          disabled={isLoading}
          fullWidth
          size="lg"
          variant="gradient"
          className="relative z-20"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Form.Button>
        <div className="h-px bg-gray-200"></div>
      </Form>
    </>
  );
};

export default LoginForm;
