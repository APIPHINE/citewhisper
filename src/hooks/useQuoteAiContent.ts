import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QuoteAiContent {
  quote_id: string;
  bio: string | null;
  analysis: string | null;
  tags: string[] | null;
  related_quote_ids: string[] | null;
  model: string | null;
  prompt_version: number;
  created_at: string;
}

// L1 in-memory cache (per session)
const memCache = new Map<string, QuoteAiContent | null>();
const inflight = new Map<string, Promise<QuoteAiContent | null>>();

async function fetchAiContent(args: {
  quote_id?: string;
  quote_text: string;
  author?: string;
}): Promise<QuoteAiContent | null> {
  const key = args.quote_id || `${args.quote_text}|${args.author ?? ''}`;
  if (memCache.has(key)) return memCache.get(key)!;
  if (inflight.has(key)) return inflight.get(key)!;

  const p = (async () => {
    const { data, error } = await supabase.functions.invoke('get-quote-ai-content', {
      body: args,
    });
    if (error) {
      console.error('AI cache error', error);
      memCache.set(key, null);
      return null;
    }
    const result = (data as QuoteAiContent | null) ?? null;
    memCache.set(key, result);
    return result;
  })();

  inflight.set(key, p);
  try {
    return await p;
  } finally {
    inflight.delete(key);
  }
}

export function useQuoteAiContent(args: {
  quote_id?: string;
  quote_text: string;
  author?: string;
  enabled?: boolean;
}) {
  const { enabled = true } = args;
  const [data, setData] = useState<QuoteAiContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !args.quote_text) return;
    let cancelled = false;
    setLoading(true);
    fetchAiContent({ quote_id: args.quote_id, quote_text: args.quote_text, author: args.author })
      .then((r) => {
        if (!cancelled) setData(r);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [args.quote_id, args.quote_text, args.author, enabled]);

  return { data, loading };
}
