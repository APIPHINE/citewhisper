import { supabase } from '@/integrations/supabase/client';

interface ArchiveResult {
  success: boolean;
  archived_url?: string;
  original_url?: string;
  timestamp?: string;
  error?: string;
  note?: string;
}

export class WaybackService {
  /**
   * Submit a URL to the Wayback Machine for archiving
   */
  static async archiveUrl(url: string, quoteId?: string): Promise<ArchiveResult> {
    try {
      console.log(`Submitting URL to Wayback Machine: ${url}`);
      
      const { data, error } = await supabase.functions.invoke('wayback-archive', {
        body: { 
          url,
          quote_id: quoteId 
        }
      });

      if (error) {
        console.error('Wayback archive function error:', error);
        return {
          success: false,
          error: `Archive function error: ${error.message}`
        };
      }

      return data as ArchiveResult;
    } catch (error) {
      console.error('Error calling Wayback archive function:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Check if a URL is already archived in Wayback Machine
   */
  static async checkArchiveStatus(url: string): Promise<{
    isArchived: boolean;
    archivedUrl?: string;
    timestamp?: string;
  }> {
    try {
      const result = await this.archiveUrl(url);
      return {
        isArchived: result.success,
        archivedUrl: result.archived_url,
        timestamp: result.timestamp
      };
    } catch (error) {
      console.error('Error checking archive status:', error);
      return { isArchived: false };
    }
  }

  /**
   * Auto-archive URL for future database integration
   */
  static async autoArchiveForQuote(quoteId: string, originalUrl: string): Promise<ArchiveResult> {
    const result = await this.archiveUrl(originalUrl, quoteId);
    
    if (result.success && result.archived_url) {
      console.log(`Successfully archived URL for quote ${quoteId}: ${result.archived_url}`);
      // TODO: Update database with wayback URL once new schema is implemented
    }

    return result;
  }
}