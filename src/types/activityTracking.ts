
export interface UserContribution {
  id: string;
  user_id: string;
  contribution_type: 'quote_submission' | 'evidence_upload' | 'quote_edit' | 'source_addition';
  quote_id?: string;
  points_earned: number;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface UserActivityLog {
  id: string;
  user_id?: string;
  action_type: 'create' | 'update' | 'delete' | 'view' | 'upload' | 'download';
  resource_type: 'quote' | 'evidence' | 'source' | 'profile';
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  action_details?: Record<string, any>;
  session_id?: string;
  created_at: string;
}

export interface EvidenceSubmission {
  id: string;
  quote_id: string;
  submitted_by: string;
  file_url: string;
  file_name?: string;
  file_size?: number;
  attribution_metadata?: Record<string, any>;
  approval_status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
}
