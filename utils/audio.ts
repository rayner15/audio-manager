/**
 * Utility functions for audio-related operations
 */

// Colors for categories
const CATEGORY_COLORS: Record<string, string> = {
  "Sound Effect": "rgba(221, 160, 221, 0.7)",
  "Music": "rgba(152, 251, 152, 0.7)",
  "Field Recording": "rgba(255, 218, 185, 0.7)",
  "Podcast": "rgba(173, 216, 230, 0.7)",
  "Interview": "rgba(176, 224, 230, 0.7)",
};

// Default color
const DEFAULT_COLOR = "rgba(200, 200, 200, 0.7)";

/**
 * Returns a consistent pastel color for a given category ID
 * @param categoryId - The ID of the category
 * @param categories - An array of category objects (optional)
 * @returns A CSS rgba color string
 */
export const getCategoryColor = (categoryId: string, categories: any[]): string => {
  if (!categories) return DEFAULT_COLOR;
  
  const category = categories.find(cat => cat.id === categoryId);
  return category ? (CATEGORY_COLORS[category.name] || DEFAULT_COLOR) : DEFAULT_COLOR;
};

