
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, FileText, Star, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUserActivity } from '@/hooks/useUserActivity';
import { format } from 'date-fns';

const UserActivityDashboard = () => {
  const { contributions, activityLog, totalPoints, loading } = useUserActivity();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getContributionIcon = (type: string) => {
    switch (type) {
      case 'quote_submission':
        return <FileText className="h-4 w-4" />;
      case 'evidence_upload':
        return <Star className="h-4 w-4" />;
      case 'quote_edit':
        return <FileText className="h-4 w-4" />;
      case 'source_addition':
        return <Award className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getContributionColor = (type: string) => {
    switch (type) {
      case 'quote_submission':
        return 'bg-blue-500';
      case 'evidence_upload':
        return 'bg-green-500';
      case 'quote_edit':
        return 'bg-yellow-500';
      case 'source_addition':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatContributionType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              Earned from contributions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contributions.length}</div>
            <p className="text-xs text-muted-foreground">
              Total contributions made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quote Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contributions.filter(c => c.contribution_type === 'quote_submission').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Quotes submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence Uploads</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contributions.filter(c => c.contribution_type === 'evidence_upload').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Evidence files uploaded
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Contributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Contributions
            </CardTitle>
            <CardDescription>
              Your latest contributions and points earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contributions.slice(0, 5).map((contribution, index) => (
                <motion.div
                  key={contribution.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`rounded-full p-2 ${getContributionColor(contribution.contribution_type)}`}>
                    {getContributionIcon(contribution.contribution_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {contribution.description || formatContributionType(contribution.contribution_type)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        +{contribution.points_earned} points
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(contribution.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {contributions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No contributions yet. Start by submitting a quote!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your recent actions on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLog.slice(0, 5).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium capitalize">{activity.action_type}</span>{' '}
                      <span className="text-muted-foreground">{activity.resource_type}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </motion.div>
              ))}
              {activityLog.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity to display.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserActivityDashboard;
