"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Form from "@/components/form/Form";

interface UsernameFormData {
  username: string;
  password: string;
}

const UsernameForm = () => {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<UsernameFormData>();

  useEffect(() => {
    // Safely access username if it exists in the session
    const username = (session?.user as any)?.username || "";

    if (username) {
      methods.setValue("username", username);
    }
  }, [session, methods]);

  const onSubmit = async (data: UsernameFormData) => {
    setIsLoading(true);

    const toastId = toast.loading("Updating username...");

    try {
      // Create a copy of the data for logging that doesn't include the password
      const safeData = { username: data.username };
      console.log("Updating username:", safeData);

      const response = await fetch("/api/user/username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Update the form with the new values to reflect changes immediately
        methods.setValue("username", data.username);
        methods.setValue("password", "");

        // Update the session
        await update();

        toast.success("Username updated successfully!", { id: toastId });
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to update username" }));
        toast.error(errorData.message || "Failed to update username", {
          id: toastId,
        });
      }
    } catch (error: any) {
      console.error("Error updating username:", error);
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
        name="username"
        label="New Username"
        placeholder="Enter your new username"
        rules={{ required: "Username is required" }}
      />

      <Form.Input
        name="password"
        label="Current Password"
        type="password"
        placeholder="Enter your current password to confirm"
        rules={{ required: "Password is required to confirm this change" }}
      />

      <Form.Button
        type="submit"
        disabled={isLoading}
        size="lg"
        variant="primary"
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      >
        {isLoading ? "Updating..." : "Update Username"}
      </Form.Button>
    </Form>
  );
};

export default UsernameForm;
