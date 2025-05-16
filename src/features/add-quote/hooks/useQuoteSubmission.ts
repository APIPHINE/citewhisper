
import { useToast } from '@/hooks/use-toast';
import type { Quote } from '@/utils/quotesData';
import type { QuoteFormValues } from '@/utils/formSchemas';
import { createQuote, uploadEvidenceImage } from '@/services/quoteService';
import { useState } from 'react';

export function useQuoteSubmission() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: QuoteFormValues, evidenceImage?: File) => {
    setIsSubmitting(true);
    try {
      // Upload evidence image if provided
      let evidenceImageUrl = data.sourceUrl || '';
      if (evidenceImage) {
        // Prepare attribution metadata for the image
        const attributionMetadata: Record<string, any> = {
          quoteAuthor: data.author,
          quoteSource: data.source,
          originalWork: data.originalSource?.title || data.source,
          submissionDate: new Date().toISOString(),
          copyright: `Attribution to original creator: ${data.author}`,
          fairUseJustification: "Educational and transformative use under 17 U.S.C. § 107",
          transformativeElement: "Addition of context, scholarly annotation, and metadata"
        };

        const uploadedUrl = await uploadEvidenceImage(evidenceImage, attributionMetadata);
        if (uploadedUrl) {
          evidenceImageUrl = uploadedUrl;
        }
      }

      const quoteData: Partial<Quote> = {
        text: data.text,
        author: data.author,
        date: data.date || new Date().toISOString().split('T')[0],
        topics: data.topics || [],
        theme: data.theme || '',
        source: data.source,
        sourceUrl: data.sourceUrl,
        evidenceImage: evidenceImageUrl,
        sourcePublicationDate: data.sourcePublicationDate,
        originalLanguage: data.originalLanguage,
        originalText: data.originalText,
        context: data.context,
        historicalContext: data.historicalContext,
        keywords: data.keywords,
        exportFormats: {
          json: true,
          csv: true,
          cff: true
        },
        shareCount: 0
      };

      // Map original source if provided
      if (data.originalSource) {
        quoteData.originalSource = {
          title: data.originalSource.title || '',
          publisher: data.originalSource.publisher || '',
          publicationDate: data.originalSource.publicationDate || '',
          location: data.originalSource.location || '',
          isbn: data.originalSource.isbn || '',
          sourceUrl: data.originalSource.sourceUrl || ''
        };
      }

      // Map translations if provided
      if (data.translations && data.translations.length > 0) {
        quoteData.translations = data.translations.map(trans => ({
          language: trans.language,
          text: trans.text,
          source: trans.source,
          translator: trans.translator,
          publication: trans.publication,
          publicationDate: trans.publicationDate,
          sourceUrl: trans.sourceUrl
        }));
      }

      // Send to Supabase
      const newQuote = await createQuote(quoteData);
      
      if (!newQuote) {
        throw new Error('Failed to create quote');
      }

      toast({
        title: "Quote Submitted",
        description: "Your quote has been submitted successfully.",
      });

      return newQuote;
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your quote. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
