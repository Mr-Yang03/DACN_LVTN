// Utility functions for traffic monitoring dashboard

/**
 * Calculate congestion level percentage based on LOS (Level of Service)
 */
export const calculateCongestion = (congestionLevel: string): number => {
  // LOS is typically rated as A, B, C, D, E, F where A is best and F is worst
  switch (congestionLevel) {
    case "A":
      return 0; // Free flow
    case "B":
      return 30; // Reasonably free flow
    case "C":
      return 50; // Stable flow
    case "D":
      return 70; // Approaching unstable flow
    case "E":
      return 85; // Unstable flow
    case "F":
      return 100; // Forced or breakdown flow
    default:
      return 50; // Default to middle value if unknown
  }
};

/**
 * Get descriptive congestion level text
 */
export const getCongestionLevel = (congestionLevel: string): string => {
  switch (congestionLevel) {
    case "A":
      return "Mức A: Lưu thông tự do";
    case "B":
      return "Mức B: Lưu thông tương đối tự do";
    case "C":
      return "Mức C: Lưu thông ổn định";
    case "D":
      return "Mức D: Tiệm cận lưu thông không ổn định";
    case "E":
      return "Mức E: Lưu thông không ổn định";
    case "F":
      return "Mức F: Lưu thông tắc nghẽn";
    default:
      return "Không xác định";
  }
};

/**
 * Get the appropriate color class for congestion level
 */
export const getCongestionColorClass = (congestionLevel: string): string => {
  switch (congestionLevel) {
    case "A":
      return "bg-green-500 text-white";
    case "B":
      return "bg-green-400 text-white";
    case "C":
      return "bg-yellow-400 text-gray-800";
    case "D":
      return "bg-amber-500 text-white";
    case "E":
      return "bg-orange-500 text-white";
    case "F":
      return "bg-red-500 text-white";
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  }
};

/**
 * Get short congestion text for display
 */
export const getShortCongestionText = (congestionLevel: string): string => {
  switch (congestionLevel) {
    case "A":
      return "Lưu thông tự do";
    case "B":
      return "Thông thoáng";
    case "C":
      return "Ổn định";
    case "D":
      return "Đông đúc";
    case "E":
      return "Kẹt xe";
    case "F":
      return "Tắc nghẽn";
    default:
      return "Đang tải...";
  }
};

/**
 * Extract congestion level letter from full congestion text
 */
export const extractCongestionLevel = (congestionText: string): string => {
  // Check if the text follows the format "Mức X: ..."
  const match = congestionText.match(/Mức ([A-F])\:/);
  if (match && match[1]) {
    return match[1]; // Return the level letter (A, B, C, D, E, or F)
  }
  return "default"; // Return default if no match
};
