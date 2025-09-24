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
  static async archiveUrl(url: string): Promise<ArchiveResult> {
    try {
      const { data, error } = await supabase.functions.invoke('wayback-archive', {
        body: { url }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return data as ArchiveResult;
    } catch (error) {
      return { success: false, error: 'Archive failed' };
    }
  }
}

export const waybackService = {
  archiveUrl: async (url: string): Promise<string | null> => {
    try {
      const result = await WaybackService.archiveUrl(url);
      return result.success ? result.archived_url || null : null;
    } catch (error) {
      console.error('Failed to archive URL:', error);
      return null;
    }
  }
};

export const archiveUrlWithWayback = waybackService.archiveUrl;