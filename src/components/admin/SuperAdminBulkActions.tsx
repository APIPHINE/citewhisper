import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckSquare, 
  Square,
  Zap,
  Archive,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Crown,
  Database,
  FileSpreadsheet,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Users
} from 'lucide-react';

interface BulkItem {
  id: string;
  type: string;
  title: string;
  status: string;
  author?: string;
  createdAt: string;
}

interface SuperAdminBulkActionsProps {
  items: BulkItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onBulkAction: (action: string, items: string[]) => Promise<void>;
  contentType: 'quotes' | 'articles' | 'users' | 'submissions';
}

export const SuperAdminBulkActions: React.FC<SuperAdminBulkActionsProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onBulkAction,
  contentType
}) => {
  const { userRole } = useUserRoles();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingAction, setProcessingAction] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState('');

  // Only show for super admins
  if (userRole !== 'super_admin') {
    return null;
  }

  const bulkActions = {
    quotes: [
      { value: 'approve', label: 'Approve Selected', icon: <CheckCircle className="w-4 h-4" />, variant: 'default' as const },
      { value: 'reject', label: 'Reject Selected', icon: <XCircle className="w-4 h-4" />, variant: 'destructive' as const },
      { value: 'archive', label: 'Archive Selected', icon: <Archive className="w-4 h-4" />, variant: 'secondary' as const },
      { value: 'feature', label: 'Mark as Featured', icon: <Crown className="w-4 h-4" />, variant: 'default' as const },
      { value: 'verify', label: 'Mark as Verified', icon: <CheckCircle className="w-4 h-4" />, variant: 'default' as const },
      { value: 'export', label: 'Export to CSV', icon: <Download className="w-4 h-4" />, variant: 'outline' as const }
    ],
    articles: [
      { value: 'publish', label: 'Publish Selected', icon: <CheckCircle className="w-4 h-4" />, variant: 'default' as const },
      { value: 'draft', label: 'Move to Draft', icon: <FileSpreadsheet className="w-4 h-4" />, variant: 'secondary' as const },
      { value: 'archive', label: 'Archive Selected', icon: <Archive className="w-4 h-4" />, variant: 'secondary' as const },
      { value: 'delete', label: 'Delete Selected', icon: <XCircle className="w-4 h-4" />, variant: 'destructive' as const },
      { value: 'export', label: 'Export Selected', icon: <Download className="w-4 h-4" />, variant: 'outline' as const }
    ],
    users: [
      { value: 'activate', label: 'Activate Users', icon: <CheckCircle className="w-4 h-4" />, variant: 'default' as const },
      { value: 'suspend', label: 'Suspend Users', icon: <Pause className="w-4 h-4" />, variant: 'destructive' as const },
      { value: 'promote', label: 'Promote to Moderator', icon: <Crown className="w-4 h-4" />, variant: 'default' as const },
      { value: 'export', label: 'Export User Data', icon: <Download className="w-4 h-4" />, variant: 'outline' as const }
    ],
    submissions: [
      { value: 'approve-all', label: 'Approve All', icon: <CheckCircle className="w-4 h-4" />, variant: 'default' as const },
      { value: 'reject-all', label: 'Reject All', icon: <XCircle className="w-4 h-4" />, variant: 'destructive' as const },
      { value: 'process', label: 'Auto Process', icon: <Zap className="w-4 h-4" />, variant: 'default' as const },
      { value: 'export', label: 'Export Data', icon: <Download className="w-4 h-4" />, variant: 'outline' as const }
    ]
  };

  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < items.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item.id));
    }
  };

  const handleItemToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to perform bulk actions",
        variant: "destructive"
      });
      return;
    }

    // Show confirmation for destructive actions
    const destructiveActions = ['delete', 'reject', 'suspend', 'reject-all'];
    if (destructiveActions.includes(action)) {
      setPendingAction(action);
      setShowConfirmDialog(true);
      return;
    }

    await executeBulkAction(action);
  };

  const executeBulkAction = async (action: string) => {
    setIsProcessing(true);
    setProcessingAction(action);
    setProcessingProgress(0);
    setShowConfirmDialog(false);

    try {
      // Simulate progress for demonstration
      const totalItems = selectedItems.length;
      for (let i = 0; i <= totalItems; i++) {
        setProcessingProgress((i / totalItems) * 100);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onBulkAction(action, selectedItems);
      
      toast({
        title: "Bulk Action Completed",
        description: `Successfully ${action.replace('-', ' ')}ed ${selectedItems.length} items`,
      });

      // Clear selection after successful action
      onSelectionChange([]);
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: "Bulk Action Failed",
        description: "Some items could not be processed",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingAction('');
    }
  };

  const actionConfig = bulkActions[contentType] || [];

  return (
    <>
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Bulk Actions</CardTitle>
            </div>
            <Badge variant="outline">
              {selectedItems.length} of {items.length} selected
            </Badge>
          </div>
          <CardDescription>
            Perform actions on multiple {contentType} at once
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Selection Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                ref={(el) => {
                  if (el && 'indeterminate' in el) (el as any).indeterminate = isPartiallySelected;
                }}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="w-4 h-4" />
              {items.length} total items
            </div>
          </div>

          {/* Item List */}
          {items.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              <div className="space-y-1 p-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded"
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {item.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.author} • {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <Separator />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {actionConfig.map((action) => (
                  <Button
                    key={action.value}
                    variant={action.variant}
                    size="sm"
                    onClick={() => handleBulkAction(action.value)}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    {action.icon}
                    <span className="hidden sm:inline">{action.label}</span>
                  </Button>
                ))}
              </div>

              {/* Processing Progress */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing {processingAction}...
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(processingProgress)}% complete
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirm Bulk Action
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to {pendingAction.replace('-', ' ')} {selectedItems.length} selected items?
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => executeBulkAction(pendingAction)}
            >
              Confirm {pendingAction.replace('-', ' ')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};