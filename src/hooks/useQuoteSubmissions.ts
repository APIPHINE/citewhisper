
import { useState, useCallback } from 'react';
import { QuoteSubmissionService, type QuoteSubmission } from '@/services/quoteSubmissionService';
import { useToast } from '@/hooks/use-toast';

export function useQuoteSubmissions() {
  const [submissions, setSubmissions] = useState<QuoteSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadSubmissions = useCallback(async (status?: QuoteSubmission['status']) => {
    setLoading(true);
    try {
      const data = status 
        ? await QuoteSubmissionService.getSubmissionsByStatus(status)
        : await QuoteSubmissionService.getAllSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load quote submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const processSubmission = useCallback(async (
    submissionId: string, 
    approve: boolean, 
    notes?: string
  ) => {
    setLoading(true);
    try {
      const result = await QuoteSubmissionService.processSubmission(submissionId, approve, notes);
      
      if (result.success) {
        toast({
          title: "Success",
          description: approve 
            ? "Quote submission approved and added to the database" 
            : "Quote submission rejected",
        });
        
        // Reload submissions to reflect changes
        await loadSubmissions();
        return result;
      } else {
        throw new Error(result.error || 'Failed to process submission');
      }
    } catch (error) {
      console.error('Error processing submission:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process submission",
        variant: "destructive"
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  }, [toast, loadSubmissions]);

  const checkDuplicates = useCallback(async (submissionId: string) => {
    try {
      const duplicateIds = await QuoteSubmissionService.checkDuplicates(submissionId);
      if (duplicateIds.length > 0) {
        const duplicateQuotes = await QuoteSubmissionService.getQuotesByIds(duplicateIds);
        return duplicateQuotes;
      }
      return [];
    } catch (error) {
      console.error('Error checking duplicates:', error);
      return [];
    }
  }, []);

  return {
    submissions,
    loading,
    loadSubmissions,
    processSubmission,
    checkDuplicates
  };
}
