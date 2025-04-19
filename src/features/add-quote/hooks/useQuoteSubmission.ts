
import { useToast } from '@/hooks/use-toast';
import type { Quote } from '@/utils/quotesData';
import type { QuoteFormValues } from '@/utils/formSchemas';

export function useQuoteSubmission() {
  const { toast } = useToast();

  const handleSubmit = (data: QuoteFormValues) => {
    const timestamp = Date.now();
    const authorPrefix = data.author.toLowerCase().replace(/\s+/g, '_').slice(0, 10);
    const newId = `quote_${timestamp}_${authorPrefix}`;

    const newQuote: Quote = {
      id: newId,
      text: data.text,
      author: data.author,
      date: data.date || new Date().toISOString().split('T')[0],
      topics: data.topics || [],
      theme: data.theme || '',
      source: data.source,
      sourceUrl: data.sourceUrl,
      sourcePublicationDate: data.sourcePublicationDate,
      originalLanguage: data.originalLanguage,
      originalText: data.originalText,
      context: data.context,
      historicalContext: data.historicalContext,
      keywords: data.keywords,
      citationAPA: data.citationAPA,
      citationMLA: data.citationMLA,
      citationChicago: data.citationChicago,
      exportFormats: {
        json: true,
        csv: true,
        cff: true
      },
      shareCount: 0
    };

    // Here you would typically send the data to your backend
    console.log('New Quote:', newQuote);

    toast({
      title: "Quote Submitted",
      description: "Your quote has been submitted successfully.",
    });

    return newQuote;
  };

  return { handleSubmit };
}
