import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CQAiService, GenerateQuotesRequest } from '@/services/cqAiService';

export function useCQWorker() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuotes, setGeneratedQuotes] = useState<any[]>([]);
  const { toast } = useToast();

  const generateQuotes = async (request: GenerateQuotesRequest) => {
    setIsGenerating(true);
    setGeneratedQuotes([]);

    try {
      const response = await CQAiService.generateQuotes(request);
      
      setGeneratedQuotes(response.quotes);
      
      toast({
        title: 'Quotes Generated Successfully',
        description: `CQ generated ${response.count} quote${response.count > 1 ? 's' : ''} for review.`,
      });

      return response;
    } catch (error) {
      console.error('Quote generation error:', error);
      
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate quotes',
        variant: 'destructive',
      });
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearResults = () => {
    setGeneratedQuotes([]);
  };

  return {
    isGenerating,
    generatedQuotes,
    generateQuotes,
    clearResults,
  };
}
