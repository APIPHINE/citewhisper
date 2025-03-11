
/**
 * Format a year number for display, handling BCE/CE formatting
 * @param year Year number (negative for BCE)
 * @returns Formatted year string
 */
export const formatDateYear = (year: number): string => {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }
  return `${year} CE`;
};

/**
 * Converts a date string to a year number
 * @param dateStr Date string, possibly with BCE suffix
 * @returns Year number (negative for BCE)
 */
export const dateStringToYear = (dateStr: string): number => {
  if (!dateStr) return 0;
  
  if (dateStr.includes('BCE')) {
    const yearStr = dateStr.split(' ')[0];
    return -Math.abs(parseInt(yearStr, 10));
  }
  
  const date = new Date(dateStr);
  return date.getFullYear();
};
