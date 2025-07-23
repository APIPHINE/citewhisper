import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Edit3, 
  Eye, 
  Database,
  Settings,
  UserCheck,
  Zap,
  Archive,
  Star,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  Crown
} from 'lucide-react';

interface SuperAdminToolbarProps {
  onQuickEdit?: (field: string, value: any) => void;
  onStatusChange?: (status: string) => void;
  onPriorityChange?: (priority: number) => void;
  contentType?: 'quote' | 'article' | 'page' | 'user' | 'submission';
  contentId?: string;
  currentStatus?: string;
  currentPriority?: number;
  className?: string;
}

export const SuperAdminToolbar: React.FC<SuperAdminToolbarProps> = ({
  onQuickEdit,
  onStatusChange,
  onPriorityChange,
  contentType = 'quote',
  contentId,
  currentStatus,
  currentPriority = 0,
  className = ''
}) => {
  const { userRole } = useUserRoles();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickEditField, setQuickEditField] = useState('');
  const [quickEditValue, setQuickEditValue] = useState('');
  const [batchAction, setBatchAction] = useState('');

  // Only show for super admins
  if (userRole !== 'super_admin') {
    return null;
  }

  const statusOptions = {
    quote: [
      { value: 'pending', label: 'Pending Review', color: 'bg-warning/10 text-warning' },
      { value: 'verified', label: 'Verified', color: 'bg-success/10 text-success' },
      { value: 'flagged', label: 'Flagged', color: 'bg-destructive/10 text-destructive' },
      { value: 'archived', label: 'Archived', color: 'bg-muted-foreground/10 text-muted-foreground' }
    ],
    article: [
      { value: 'draft', label: 'Draft', color: 'bg-secondary/10 text-secondary' },
      { value: 'review', label: 'Under Review', color: 'bg-warning/10 text-warning' },
      { value: 'published', label: 'Published', color: 'bg-success/10 text-success' },
      { value: 'archived', label: 'Archived', color: 'bg-muted-foreground/10 text-muted-foreground' }
    ],
    user: [
      { value: 'active', label: 'Active', color: 'bg-success/10 text-success' },
      { value: 'suspended', label: 'Suspended', color: 'bg-warning/10 text-warning' },
      { value: 'banned', label: 'Banned', color: 'bg-destructive/10 text-destructive' }
    ]
  };

  const priorityLevels = [
    { value: 0, label: 'Normal', icon: <div className="w-2 h-2 rounded-full bg-muted-foreground" /> },
    { value: 1, label: 'Low', icon: <div className="w-2 h-2 rounded-full bg-primary" /> },
    { value: 2, label: 'Medium', icon: <div className="w-2 h-2 rounded-full bg-warning" /> },
    { value: 3, label: 'High', icon: <div className="w-2 h-2 rounded-full bg-destructive" /> },
    { value: 4, label: 'Critical', icon: <Star className="w-3 h-3 text-destructive" /> }
  ];

  const handleQuickEdit = () => {
    if (!quickEditField || !quickEditValue) return;
    
    onQuickEdit?.(quickEditField, quickEditValue);
    setQuickEditField('');
    setQuickEditValue('');
    
    toast({
      title: "Quick Edit Applied",
      description: `Updated ${quickEditField} successfully`,
    });
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange?.(newStatus);
    toast({
      title: "Status Updated",
      description: `Changed status to ${newStatus}`,
    });
  };

  const handlePriorityChange = (newPriority: number) => {
    onPriorityChange?.(newPriority);
    toast({
      title: "Priority Updated",
      description: `Set priority to ${priorityLevels.find(p => p.value === newPriority)?.label}`,
    });
  };

  const currentStatusInfo = statusOptions[contentType]?.find(s => s.value === currentStatus);
  const currentPriorityInfo = priorityLevels.find(p => p.value === currentPriority);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-20 right-4 z-50 ${className}`}
    >
      <Card className="w-80 border-primary/20 bg-card/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">Super Admin Controls</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Advanced editing tools for {contentType}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status Control */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Status</Label>
            <div className="flex items-center gap-2">
              {currentStatusInfo && (
                <Badge className={currentStatusInfo.color} variant="secondary">
                  {currentStatusInfo.label}
                </Badge>
              )}
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions[contentType]?.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status.color}`} />
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority Control */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Priority</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {currentPriorityInfo?.icon}
                <span className="text-xs">{currentPriorityInfo?.label}</span>
              </div>
              <Select value={currentPriority.toString()} onValueChange={(v) => handlePriorityChange(parseInt(v))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value.toString()}>
                      <div className="flex items-center gap-2">
                        {priority.icon}
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Edit3 className="w-3 h-3 mr-1" />
                  Quick Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Quick Edit</DialogTitle>
                  <DialogDescription>
                    Make quick changes to {contentType} fields
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Field</Label>
                    <Select value={quickEditField} onValueChange={setQuickEditField}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field to edit" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentType === 'quote' && (
                          <>
                            <SelectItem value="author">Author</SelectItem>
                            <SelectItem value="source">Source</SelectItem>
                            <SelectItem value="context">Context</SelectItem>
                            <SelectItem value="tags">Tags</SelectItem>
                          </>
                        )}
                        {contentType === 'article' && (
                          <>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="excerpt">Excerpt</SelectItem>
                            <SelectItem value="tags">Tags</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Textarea
                      placeholder="Enter new value"
                      value={quickEditValue}
                      onChange={(e) => setQuickEditValue(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleQuickEdit} className="w-full">
                    Apply Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Inspect
            </Button>

            <Button variant="outline" size="sm" className="text-xs">
              <Database className="w-3 h-3 mr-1" />
              Data
            </Button>

            <Button variant="outline" size="sm" className="text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t pt-4"
            >
              {/* Advanced Controls */}
              <div className="space-y-3">
                <Label className="text-xs font-medium">Advanced Actions</Label>
                
                {/* Batch Operations */}
                <div className="space-y-2">
                  <Select value={batchAction} onValueChange={setBatchAction}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Batch operations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bulk-approve">Bulk Approve</SelectItem>
                      <SelectItem value="bulk-reject">Bulk Reject</SelectItem>
                      <SelectItem value="bulk-archive">Bulk Archive</SelectItem>
                      <SelectItem value="bulk-export">Bulk Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Toggles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Featured</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Verified</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Public</Label>
                    <Switch />
                  </div>
                </div>

                {/* Meta Information */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>ID: {contentId}</div>
                  <div>Type: {contentType}</div>
                  <div>Modified: {new Date().toLocaleString()}</div>
                  <div>By: {user?.email}</div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};