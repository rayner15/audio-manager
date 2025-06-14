"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Form from "@/components/form/Form";

interface ProfileFormData {
  firstName: string;
  lastName: string;
}

const ProfileSettingsForm = () => {
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ProfileFormData>();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          methods.reset({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
          });
        } else {
          console.error("Failed to fetch profile:", await response.text());
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [methods]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    const toastId = toast.loading("Updating profile...");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        methods.reset(data);
        await update();

        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to update profile" }));
        toast.error(errorData.message || "Failed to update profile", {
          id: toastId,
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Input
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
        />

        <Form.Input
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
        />
      </div>

      <Form.Button
        type="submit"
        disabled={isLoading}
        size="lg"
        variant="primary"
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Form.Button>
    </Form>
  );
};

export default ProfileSettingsForm;
