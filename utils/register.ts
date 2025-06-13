import { MIN_PASSWORD_LENGTH } from "@/constants/register";
import { RegisterFormData } from "@/interface/register";



/**
 * Validates the registration form data
 * @param data The form data to validate
 * @returns Error message if validation fails, null if validation passes
 */
export const validateRegisterForm = (data: RegisterFormData): string | null => {
  if (!data.username.trim()) return "Username is required";
  if (!data.email.trim()) return "Email is required";
  if (!data.password) return "Password is required";
  if (data.password.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  if (data.password !== data.confirmPassword) return "Passwords do not match";
  if (!data.firstName.trim()) return "First name is required";
  if (!data.lastName.trim()) return "Last name is required";
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email))
    return "Please enter a valid email address";
  
  return null;
};
