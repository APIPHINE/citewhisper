import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface QuoteEnrichment {
  context: string;
  source_guess: {
    title: string | null;
    publication_year: string | null;
    medium: string | null;
  };
  topics: string[];
  themes: string[];
  emotional_tone: string | null;
  keywords: string[];
  historical_context: string | null;
  attribution_confidence: number;
  notes: string | null;
}

export interface EnrichmentResponse {
  cache: "exact" | "fuzzy" | "miss";
  id: string | null;
  model: string;
  confidence: number;
  enrichment: QuoteEnrichment;
  text_similarity?: number;
  author_similarity?: number;
}

/**
 * Generate-once, store-forever AI enrichment for a quote.
 * Returns cached result if the quote (or a near-duplicate) has been enriched before,
 * otherwise calls the AI and persists the result.
 */
export function useQuoteEnrichment() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnrichmentResponse | null>(null);
  const { toast } = useToast();

  const enrich = useCallback(
    async (quote_text: string, author_name = ""): Promise<EnrichmentResponse | null> => {
      if (!quote_text.trim()) return null;
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke<EnrichmentResponse>(
          "enrich-quote",
          { body: { quote_text, author_name } },
        );
        if (error) throw error;
        setResult(data ?? null);
        return data ?? null;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to enrich quote";
        const isRate = msg.includes("429") || msg.toLowerCase().includes("rate");
        const isPay = msg.includes("402") || msg.toLowerCase().includes("payment");
        toast({
          title: isPay
            ? "AI credits required"
            : isRate
              ? "Rate limit reached"
              : "Enrichment failed",
          description: isPay
            ? "Please add credits to your Lovable AI workspace."
            : isRate
              ? "Please wait a moment and try again."
              : msg,
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  return { enrich, isLoading, result, reset: () => setResult(null) };
}
