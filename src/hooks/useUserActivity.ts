
import { useState, useEffect, useCallback } from 'react';
import { ActivityTrackingService } from '@/services/activityTrackingService';
import { useAuth } from '@/context/AuthContext';
import type { UserContribution, UserActivityLog } from '@/types/activityTracking';

export const useUserActivity = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const [activityLog, setActivityLog] = useState<UserActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  // Load user contributions and activity
  const loadUserData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [contributionsData, activityData] = await Promise.all([
        ActivityTrackingService.getUserContributions(user.id),
        ActivityTrackingService.getUserActivity(user.id)
      ]);

      setContributions(contributionsData);
      setActivityLog(activityData);
      
      // Calculate total points
      const points = contributionsData.reduce((sum, contrib) => sum + contrib.points_earned, 0);
      setTotalPoints(points);
    } catch (error) {
      console.error('Error loading user activity data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Log an activity
  const logActivity = useCallback(async (
    actionType: UserActivityLog['action_type'],
    resourceType: UserActivityLog['resource_type'],
    resourceId?: string,
    actionDetails?: Record<string, any>
  ) => {
    if (!user?.id) return;

    await ActivityTrackingService.logActivity(
      user.id,
      actionType,
      resourceType,
      resourceId,
      actionDetails
    );

    // Reload data to get the latest activity
    await loadUserData();
  }, [user?.id, loadUserData]);

  // Log a contribution
  const logContribution = useCallback(async (
    contributionType: UserContribution['contribution_type'],
    quoteId?: string,
    points: number = 0,
    description?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user?.id) return;

    await ActivityTrackingService.logContribution(
      user.id,
      contributionType,
      quoteId,
      points,
      description,
      metadata
    );

    // Reload data to get the latest contributions
    await loadUserData();
  }, [user?.id, loadUserData]);

  // Load data when user changes
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return {
    contributions,
    activityLog,
    totalPoints,
    loading,
    logActivity,
    logContribution,
    refreshData: loadUserData
  };
};
