/**
 * Utility functions for audio-related operations
 */

/**
 * Returns a consistent pastel color for a given category ID
 * @param categoryId - The ID of the category
 * @returns A CSS rgba color string
 */
export const getCategoryColor = (categoryId: number): string => {
  const colors = [
    "rgba(173, 216, 230, 0.7)", // Light blue
    "rgba(152, 251, 152, 0.7)", // Light green
    "rgba(176, 224, 230, 0.7)", // Powder blue
    "rgba(221, 160, 221, 0.7)", // Plum
    "rgba(255, 218, 185, 0.7)", // Peach
  ];
  
  return colors[categoryId - 1];
};

