
import { supabase } from '@/integrations/supabase/client';
import type { UserContribution, UserActivityLog, EvidenceSubmission } from '@/types/activityTracking';

export class ActivityTrackingService {
  // Log user activity
  static async logActivity(
    userId: string,
    actionType: UserActivityLog['action_type'],
    resourceType: UserActivityLog['resource_type'],
    resourceId?: string,
    actionDetails?: Record<string, any>
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('log_user_activity', {
        p_user_id: userId,
        p_action_type: actionType,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_ip_address: null, // Will be handled by edge function
        p_user_agent: navigator.userAgent,
        p_action_details: actionDetails,
        p_session_id: null // Will be handled by edge function
      });

      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error logging activity:', error);
      return null;
    }
  }

  // Log user contribution
  static async logContribution(
    userId: string,
    contributionType: UserContribution['contribution_type'],
    quoteId?: string,
    points: number = 0,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('log_user_contribution', {
        p_user_id: userId,
        p_contribution_type: contributionType,
        p_quote_id: quoteId,
        p_points: points,
        p_description: description,
        p_metadata: metadata
      });

      if (error) {
        console.error('Error logging contribution:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error logging contribution:', error);
      return null;
    }
  }

  // Get user contributions with proper type casting
  static async getUserContributions(userId: string): Promise<UserContribution[]> {
    try {
      const { data, error } = await supabase
        .from('user_contributions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contributions:', error);
        return [];
      }

      // Type cast the database results to match our interface
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        contribution_type: item.contribution_type as UserContribution['contribution_type'],
        quote_id: item.quote_id,
        points_earned: item.points_earned || 0,
        description: item.description,
        metadata: item.metadata as Record<string, any> || {},
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching contributions:', error);
      return [];
    }
  }

  // Get user activity log with proper type casting
  static async getUserActivity(userId: string): Promise<UserActivityLog[]> {
    try {
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching activity:', error);
        return [];
      }

      // Type cast the database results to match our interface
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        action_type: item.action_type as UserActivityLog['action_type'],
        resource_type: item.resource_type as UserActivityLog['resource_type'],
        resource_id: item.resource_id,
        ip_address: item.ip_address ? String(item.ip_address) : undefined,
        user_agent: item.user_agent,
        action_details: item.action_details as Record<string, any> || {},
        session_id: item.session_id,
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching activity:', error);
      return [];
    }
  }

  // Submit evidence
  static async submitEvidence(
    quoteId: string,
    submittedBy: string,
    fileUrl: string,
    fileName?: string,
    fileSize?: number,
    attributionMetadata?: Record<string, any>
  ): Promise<EvidenceSubmission | null> {
    try {
      const { data, error } = await supabase
        .from('evidence_submissions')
        .insert({
          quote_id: quoteId,
          submitted_by: submittedBy,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          attribution_metadata: attributionMetadata
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting evidence:', error);
        return null;
      }

      // Log the contribution
      await this.logContribution(
        submittedBy,
        'evidence_upload',
        quoteId,
        5, // 5 points for evidence submission
        `Submitted evidence: ${fileName || 'file'}`,
        { file_url: fileUrl, file_size: fileSize }
      );

      // Type cast the result to match our interface
      return {
        id: data.id,
        quote_id: data.quote_id,
        submitted_by: data.submitted_by,
        file_url: data.file_url,
        file_name: data.file_name,
        file_size: data.file_size,
        attribution_metadata: data.attribution_metadata as Record<string, any> || {},
        approval_status: data.approval_status as EvidenceSubmission['approval_status'],
        reviewed_by: data.reviewed_by,
        reviewed_at: data.reviewed_at,
        review_notes: data.review_notes,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Error submitting evidence:', error);
      return null;
    }
  }

  // Get evidence submissions for a quote with proper type casting
  static async getEvidenceSubmissions(quoteId: string): Promise<EvidenceSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('evidence_submissions')
        .select('*')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching evidence submissions:', error);
        return [];
      }

      // Type cast the database results to match our interface
      return (data || []).map(item => ({
        id: item.id,
        quote_id: item.quote_id,
        submitted_by: item.submitted_by,
        file_url: item.file_url,
        file_name: item.file_name,
        file_size: item.file_size,
        attribution_metadata: item.attribution_metadata as Record<string, any> || {},
        approval_status: item.approval_status as EvidenceSubmission['approval_status'],
        reviewed_by: item.reviewed_by,
        reviewed_at: item.reviewed_at,
        review_notes: item.review_notes,
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching evidence submissions:', error);
      return [];
    }
  }
}
