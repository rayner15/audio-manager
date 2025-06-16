/**
 * Client-side utility functions
 */

/**
 * Simple encryption function to protect passwords during transmission
 * @param password The password to encrypt
 * @returns Encrypted password string
 */
export function encryptPassword(password: string): string {
  // Convert password to base64 and add a simple transformation
  // This is a basic implementation - in production, use a stronger algorithm
  const base64 = btoa(password);
  return `encrypted:${base64}`;
} 