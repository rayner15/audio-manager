import { MIN_PASSWORD_LENGTH } from "@/constants/register";
import { RegisterFormData } from "@/interface/register";

/**
 * Validates the registration form data
 * @param data The form data to validate
 * @returns Error message if validation fails, null if validation passes
 */
export const validateRegisterForm = (data: RegisterFormData): string | null => {
  const { username, email, password, confirmPassword, firstName, lastName } = data;
  
  // Check for empty required fields
  if (!username.trim()) {
    return "Username is required";
  }
  
  if (!email.trim()) {
    return "Email is required";
  }
  
  if (!password) {
    return "Password is required";
  }
  
  if (!firstName.trim()) {
    return "First name is required";
  }
  
  if (!lastName.trim()) {
    return "Last name is required";
  }
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  return null;
};
