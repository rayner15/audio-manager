/**
 * Utility functions for handling encrypted passwords on the server side
 */

/**
 * Decrypts a password that was encrypted on the client
 * @param encryptedPassword The encrypted password string
 * @returns The decrypted password or null if invalid format
 */
export function decryptPassword(encryptedPassword: string): string | null {
  if (!encryptedPassword.startsWith('encrypted:')) {
    // Not encrypted with our method, return as is (for backward compatibility)
    return encryptedPassword;
  }
  
  try {
    // Extract the base64 part
    const base64 = encryptedPassword.substring('encrypted:'.length);
    // Decode from base64
    return atob(base64);
  } catch (error) {
    console.error('Failed to decrypt password:', error);
    return null;
  }
}

/**
 * Process request data to decrypt any encrypted passwords
 * @param data The request data object
 * @returns A new object with decrypted passwords
 */
export function processEncryptedPasswords<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data } as { [K in keyof T]: unknown };
  
  // Look for any field that might contain a password
  for (const key in result) {
    if (
      typeof result[key] === 'string' && 
      key.toLowerCase().includes('password') &&
      (result[key] as string).startsWith('encrypted:')
    ) {
      const decrypted = decryptPassword(result[key] as string);
      if (decrypted) {
        result[key] = decrypted as unknown as T[keyof T];
      }
    }
  }
  
  return result as T;
} 