/**
 * Utility functions for audio-related operations
 */

/**
 * Returns a consistent pastel color for a given category ID
 * @param categoryId - The ID of the category
 * @returns A CSS rgba color string
 */
export const getCategoryColor = (categoryId: number): string => {
  // Rotate through these colors based on category ID with higher opacity
  const colors = [
    "rgba(255, 182, 193, 0.7)", // Light pink
    "rgba(173, 216, 230, 0.7)", // Light blue
    "rgba(152, 251, 152, 0.7)", // Light green
    "rgba(255, 218, 185, 0.7)", // Peach
    "rgba(221, 160, 221, 0.7)", // Plum
    "rgba(176, 224, 230, 0.7)", // Powder blue
  ];
  
  return colors[categoryId % colors.length];
};

