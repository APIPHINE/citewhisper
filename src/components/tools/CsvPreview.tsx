
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface CsvPreviewProps {
  parsedCsvData: string[][];
  csvContent: string;
}

export const CsvPreview = ({ parsedCsvData, csvContent }: CsvPreviewProps) => {
  if (parsedCsvData.length === 0) {
    return (
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
        {csvContent}
      </pre>
    );
  }

  const headers = parsedCsvData[0];
  const dataRows = parsedCsvData.slice(1, Math.min(21, parsedCsvData.length));
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, i) => (
              <TableHead key={`header-${i}`}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRows.map((row, i) => (
            <TableRow key={`row-${i}`}>
              {row.map((cell, j) => (
                <TableCell key={`cell-${i}-${j}`}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {parsedCsvData.length > 21 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Showing first 20 rows of {parsedCsvData.length - 1} rows
        </p>
      )}
    </div>
  );
};
