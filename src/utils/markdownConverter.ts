
/**
 * Converts markdown content to CSV format
 */
export const convertMarkdownToCSV = (markdown: string): { csv: string; parsedData: string[][] } => {
  // Split the markdown content into lines
  const lines = markdown.split('\n').filter(line => line.trim() !== '');
  
  // Initialize headers and rows
  const headers: string[] = [];
  const rows: string[][] = [];
  
  // Try to identify the format (table, list, or paragraphs)
  if (lines.some(line => line.trim().startsWith('|'))) {
    // Markdown table format
    const tableLines = lines.filter(line => line.trim().startsWith('|'));
    
    // Extract headers from the first line
    const headerLine = tableLines[0];
    const headerCells = headerLine.split('|')
      .filter(cell => cell.trim() !== '')
      .map(h => h.trim());
    headers.push(...headerCells);
    
    // Skip the separator line (usually the second line of a markdown table)
    // Process data rows (from third line onwards in markdown tables)
    for (let i = 2; i < tableLines.length; i++) {
      const rowCells = tableLines[i].split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => cell.trim());
      
      // Only add rows that have content
      if (rowCells.length > 0 && rowCells.some(cell => cell.trim() !== '')) {
        rows.push(rowCells);
      }
    }
  } else if (lines.some(line => line.trim().startsWith('-') || line.trim().startsWith('*'))) {
    // List format (bullet points)
    headers.push('Content');
    
    lines.forEach(line => {
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        const content = line.replace(/^[-*]\s*/, '').trim();
        if (content) {
          rows.push([content]);
        }
      }
    });
  } else if (lines.some(line => line.trim().startsWith('#'))) {
    // Headers and paragraphs
    headers.push('Heading', 'Content');
    
    let currentHeading = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#')) {
        // This is a heading
        currentHeading = line.replace(/^#+\s*/, '');
        
        // Look ahead for content
        let content = '';
        let j = i + 1;
        while (j < lines.length && !lines[j].trim().startsWith('#')) {
          if (content) content += ' ';
          content += lines[j].trim();
          j++;
        }
        
        if (content) {
          rows.push([currentHeading, content]);
        }
        
        // Skip the content we've already processed
        i = j - 1;
      } else if (line && !currentHeading) {
        // Content without a heading
        rows.push(['', line]);
      }
    }
  } else {
    // Simple paragraph format
    headers.push('Content');
    lines.forEach(line => {
      if (line.trim()) {
        rows.push([line.trim()]);
      }
    });
  }
  
  // Generate CSV
  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    // Handle escaping: Wrap fields in quotes if they contain commas, quotes, or newlines
    const escapedRow = row.map(cell => {
      if (cell.includes('"') || cell.includes(',') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });
    
    csv += escapedRow.join(',') + '\n';
  });
  
  // Return both the CSV string and the parsed data structure
  return { 
    csv, 
    parsedData: [headers, ...rows]
  };
};
