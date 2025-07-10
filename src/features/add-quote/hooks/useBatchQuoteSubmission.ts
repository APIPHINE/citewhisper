import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import type { QuoteFormValues } from '@/utils/formSchemas';
import { createQuote } from '@/services/quoteService';
import type { QuoteSubmissionData } from '@/services/quotesApi/createQuote';

export function useBatchQuoteSubmission() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBatchSubmit = async (quotes: QuoteFormValues[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit quotes.",
        variant: "destructive"
      });
      return { successCount: 0, errorCount: quotes.length };
    }

    setIsSubmitting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      toast({
        title: "Processing Quotes",
        description: `Submitting ${quotes.length} quotes...`,
      });

      for (const quoteData of quotes) {
        try {
          const submissionData: QuoteSubmissionData = {
            quote_text: quoteData.text,
            author_name: quoteData.author,
            date_original: quoteData.date || undefined,
            quote_context: quoteData.context || undefined,
            source_title: quoteData.source || undefined,
            source_url: quoteData.sourceUrl || undefined,
            topics: quoteData.topics || undefined,
            theme: quoteData.theme || undefined,
            originalLanguage: quoteData.originalLanguage || undefined,
            originalText: quoteData.originalText || undefined,
            historicalContext: quoteData.historicalContext || undefined,
            emotionalTone: quoteData.emotionalTone || undefined,
            originalSource: quoteData.originalSource || undefined,
            translations: quoteData.translations?.filter(t => t.language && t.text).map(t => ({
              language: t.language!,
              text: t.text!,
              source: t.source,
              translator: t.translator,
              publication: t.publication,
              publicationDate: t.publicationDate,
              sourceUrl: t.sourceUrl
            })) || undefined,
            keywords: quoteData.keywords || undefined
          };

          const result = await createQuote(submissionData, user.id);
          
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
            console.error('Failed to create quote:', result.error);
          }
        } catch (error) {
          errorCount++;
          console.error('Error submitting quote:', error);
        }
      }

      toast({
        title: "Batch Submission Complete",
        description: `Successfully submitted ${successCount} quotes. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
      });

    } catch (error) {
      console.error('Batch submission error:', error);
      toast({
        title: "Batch Submission Failed",
        description: "There was an error processing the quotes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }

    return { successCount, errorCount };
  };

  return { handleBatchSubmit, isSubmitting };
}