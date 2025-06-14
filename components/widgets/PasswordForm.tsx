"use client";

import Form from "@/components/form/Form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const methods = useForm<PasswordFormData>();

  const toggleVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      methods.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Updating password...");

    try {
      console.log("Updating password...");

      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (response.ok) {
        methods.reset();
        toast.success("Password updated successfully!", { id: toastId });
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to update password" }));
        toast.error(errorData.message || "Failed to update password", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error updating password", error);
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      useFormMethods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <Form.Input
        name="currentPassword"
        label="Current Password"
        type={passwordVisibility.currentPassword ? "text" : "password"}
        placeholder="Enter your current password"
        rules={{ required: "Current password is required" }}
        icon={
          <button
            type="button"
            onClick={() => toggleVisibility("currentPassword")}
            className="text-gray-400 hover:text-blue-500 focus:outline-none transition-colors duration-200"
          >
            {passwordVisibility.currentPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        }
      />

      <Form.Input
        name="newPassword"
        label="New Password"
        type={passwordVisibility.newPassword ? "text" : "password"}
        placeholder="Enter your new password"
        rules={{
          required: "New password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters long",
          },
        }}
        icon={
          <button
            type="button"
            onClick={() => toggleVisibility("newPassword")}
            className="text-gray-400 hover:text-blue-500 focus:outline-none transition-colors duration-200"
          >
            {passwordVisibility.newPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        }
      />

      <Form.Input
        name="confirmPassword"
        label="Confirm New Password"
        type={passwordVisibility.confirmPassword ? "text" : "password"}
        placeholder="Confirm your new password"
        rules={{
          required: "Please confirm your new password",
          validate: (value: string) =>
            value === methods.watch("newPassword") || "Passwords do not match",
        }}
        icon={
          <button
            type="button"
            onClick={() => toggleVisibility("confirmPassword")}
            className="text-gray-400 hover:text-blue-500 focus:outline-none transition-colors duration-200"
          >
            {passwordVisibility.confirmPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        }
      />

      <Form.Button
        type="submit"
        disabled={isLoading}
        size="lg"
        variant="primary"
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </Form.Button>
    </Form>
  );
};

export default PasswordForm;
