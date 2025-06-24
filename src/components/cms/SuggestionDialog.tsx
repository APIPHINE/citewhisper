
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Edit3 } from 'lucide-react';
import { createEditSuggestion } from '@/services/cmsService';

interface SuggestionDialogProps {
  contentType: 'quote' | 'article' | 'topic';
  contentId?: string;
  trigger?: React.ReactNode;
}

export const SuggestionDialog: React.FC<SuggestionDialogProps> = ({
  contentType,
  contentId,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState({
    changes: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user || !suggestion.changes.trim()) return;

    try {
      setSubmitting(true);
      await createEditSuggestion({
        content_type: contentType,
        content_id: contentId,
        suggested_changes: { changes: suggestion.changes },
        reason: suggestion.reason,
        suggested_by: user.id
      });

      toast({
        title: "Suggestion Submitted",
        description: "Your edit suggestion has been submitted for review.",
      });

      setSuggestion({ changes: '', reason: '' });
      setOpen(false);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit3 size={16} className="mr-2" />
            Suggest Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Suggest an Edit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="changes">Suggested Changes</Label>
            <Textarea
              id="changes"
              placeholder="Describe the changes you'd like to suggest..."
              value={suggestion.changes}
              onChange={(e) => setSuggestion(prev => ({ ...prev, changes: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Why do you think this change is needed?"
              value={suggestion.reason}
              onChange={(e) => setSuggestion(prev => ({ ...prev, reason: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!suggestion.changes.trim() || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Suggestion'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
