"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import Form from "@/components/form/Form";

interface DeleteAccountFormData {
  password: string;
  confirmation: string;
}

const DeleteAccountForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<DeleteAccountFormData>();

  const handleSignOut = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const onSubmit = async (data: DeleteAccountFormData) => {
    if (data.confirmation !== "DELETE") {
      methods.setError("confirmation", {
        type: "manual",
        message: "Please type DELETE to confirm",
      });
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Deleting account...");

    try {
      const response = await fetch("/api/user/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: data.password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to delete account", {
          id: toastId,
        });
        return;
      }

      toast.success("Account deleted successfully", { id: toastId });

      await handleSignOut();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-amber-700 text-sm font-medium">
          Warning: This action cannot be undone. All your data will be
          permanently deleted.
        </p>
      </div>

      <Form
        useFormMethods={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Form.Input
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password to confirm"
          rules={{ required: "Password is required" }}
        />

        <Form.Input
          name="confirmation"
          label="Confirm Deletion"
          placeholder="Type DELETE to confirm"
          rules={{
            required: "Please type DELETE to confirm",
            validate: (value: string) =>
              value === "DELETE" || "Please type DELETE to confirm",
          }}
        />

        <Form.Button
          type="submit"
          disabled={isLoading}
          size="lg"
          variant="primary"
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
        >
          {isLoading ? "Deleting..." : "Delete My Account"}
        </Form.Button>
      </Form>
    </>
  );
};

export default DeleteAccountForm;
