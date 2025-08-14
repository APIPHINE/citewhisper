import { supabase } from '@/integrations/supabase/client';

export class PerformanceService {
  static async trackMetric(
    metricType: string,
    metricValue: number,
    pageUrl?: string,
    userId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('performance_metrics')
        .insert({
          user_id: userId || null,
          metric_type: metricType,
          metric_value: metricValue,
          page_url: pageUrl || window.location.pathname,
          user_agent: navigator.userAgent,
          session_id: sessionStorage.getItem('session_id') || null,
        });
    } catch (error) {
      console.warn('Failed to track performance metric:', error);
    }
  }

  static async getMetrics(userId?: string, metricType?: string) {
    try {
      let query = supabase
        .from('performance_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
      return [];
    }
  }
}