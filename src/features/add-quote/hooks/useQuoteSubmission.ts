
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import type { QuoteFormValues } from '@/utils/formSchemas';
import { createQuote, uploadEvidenceImage } from '@/services/quoteService';
import type { QuoteSubmissionData } from '@/services/quotesApi/createQuote';
import { useState } from 'react';

export function useQuoteSubmission() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: QuoteFormValues, evidenceImage?: File) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting quote with form data:', data);
      
      // Check authentication
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to submit quotes.",
          variant: "destructive"
        });
        return null;
      }

      // Upload evidence image if provided
      let evidenceImageUrl = data.sourceInfo?.primary_url || '';
      if (evidenceImage) {
        const attributionMetadata: Record<string, any> = {
          quoteAuthor: data.author,
          quoteSource: data.sourceInfo?.title || '',
          originalWork: data.sourceInfo?.title || '',
          submissionDate: new Date().toISOString(),
          copyright: `Attribution to original creator: ${data.author}`,
          fairUseJustification: "Educational and transformative use under 17 U.S.C. § 107",
          transformativeElement: "Addition of context, scholarly annotation, and metadata"
        };

        console.log('Uploading evidence image with metadata:', attributionMetadata);
        const uploadedUrl = await uploadEvidenceImage(evidenceImage, attributionMetadata);
        if (uploadedUrl) {
          console.log('Evidence image uploaded successfully:', uploadedUrl);
          evidenceImageUrl = uploadedUrl;
        } else {
          console.error('Failed to upload evidence image');
        }
      }

      // Map form data to QuoteSubmissionData format
      const quoteData: QuoteSubmissionData = {
        quote_text: data.text,
        author_name: data.author,
        date_original: data.date || undefined,
        quote_context: data.context || undefined,
        source_title: data.sourceInfo?.title || undefined,
        source_url: evidenceImageUrl || data.sourceInfo?.primary_url || undefined,
        topics: data.topics || undefined,
        sourceInfo: data.sourceInfo
      };

      console.log('Sending quote data to secure createQuote:', quoteData);
      
      // Call the secure createQuote function
      const result = await createQuote(quoteData, user.id);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create quote');
      }

      console.log('Quote created successfully with ID:', result.quote_id);
      toast({
        title: "Quote Submitted",
        description: "Your quote has been submitted successfully.",
      });

      return { id: result.quote_id };
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your quote. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
