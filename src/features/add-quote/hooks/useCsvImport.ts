import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseCSV, validateCSVHeaders } from '@/utils/csvParser';
import { convertCsvToQuotes } from '@/features/add-quote/utils/csvToQuoteMapper';
import { useBatchQuoteSubmission } from './useBatchQuoteSubmission';
import type { QuoteFormValues } from '@/utils/formSchemas';
import type { UseFormReset } from 'react-hook-form';

interface UseCsvImportProps {
  formReset: UseFormReset<QuoteFormValues>;
}

export function useCsvImport({ formReset }: UseCsvImportProps) {
  const [csvInput, setCsvInput] = useState('');
  const { toast } = useToast();
  const { handleBatchSubmit, isSubmitting } = useBatchQuoteSubmission();

  const handleCsvImport = async () => {
    try {
      if (!csvInput.trim()) {
        throw new Error("Please enter CSV data");
      }

      // Parse and validate CSV
      const { headers, rows } = parseCSV(csvInput);
      validateCSVHeaders(headers);

      // Convert to quotes
      const quotes = convertCsvToQuotes(headers, rows);

      if (quotes.length === 0) {
        throw new Error("No valid quotes found in CSV");
      }

      // Handle single vs multiple quotes
      if (quotes.length === 1) {
        formReset(quotes[0]);
        toast({
          title: "CSV Imported",
          description: "Form has been populated with the quote data.",
        });
      } else {
        // Process multiple quotes
        const { successCount } = await handleBatchSubmit(quotes);
        
        if (successCount > 0) {
          setCsvInput('');
        }
      }
    } catch (error) {
      toast({
        title: "Invalid CSV",
        description: error instanceof Error ? error.message : "Please check your CSV format",
        variant: "destructive"
      });
    }
  };

  return {
    csvInput,
    setCsvInput,
    handleCsvImport,
    isSubmitting
  };
}