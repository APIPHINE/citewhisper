/**
 * Utility functions for parsing CSV data
 */

export interface CsvParseResult {
  headers: string[];
  rows: string[][];
}

/**
 * Parse a CSV row with proper handling of quoted fields and escaped quotes
 */
export function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  
  return result;
}

/**
 * Parse complete CSV text into headers and data rows
 */
export function parseCSV(csvText: string): CsvParseResult {
  const rows = csvText.trim().split('\n');
  
  if (rows.length < 2) {
    throw new Error("CSV must contain at least a header row and one data row");
  }

  const headers = parseCSVRow(rows[0]).map(h => h.trim().replace(/^"(.*)"$/, '$1'));
  const dataRows = rows.slice(1).map(row => parseCSVRow(row));

  return { headers, rows: dataRows };
}

/**
 * Validate that required CSV headers are present
 */
export function validateCSVHeaders(headers: string[], requiredHeaders: string[] = ['text', 'author']): void {
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
  
  if (missingHeaders.length > 0) {
    throw new Error(`CSV must contain the following columns: ${missingHeaders.join(', ')}`);
  }
}