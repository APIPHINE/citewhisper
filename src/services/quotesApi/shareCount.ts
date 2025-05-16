
import { supabase } from "@/integrations/supabase/client";

/**
 * Increments the share count for a quote
 * 
 * @param quoteId - The ID of the quote to increment
 */
export async function incrementShareCount(quoteId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_quote_share_count', { quote_id: quoteId });
    
    if (error) {
      console.error('Error incrementing share count:', error);
    }
  } catch (error) {
    console.error('Error in incrementShareCount:', error);
  }
}
