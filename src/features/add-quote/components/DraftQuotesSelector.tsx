import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { useQuoteDraft } from '../hooks/useQuoteDraft';
import { QuoteFormValues } from '@/utils/formSchemas';
import { FileText, Trash2, Plus, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DraftQuotesSelectorProps {
  form: UseFormReturn<QuoteFormValues>;
  onLoadDraft?: () => void;
  onStartNew: () => void;
}

interface DraftQuote {
  id: string;
  quote_text: string | null;
  author_name: string | null;
  source_info: any;
  topics: string[] | null;
  updated_at: string;
  image_url: string | null;
}

export function DraftQuotesSelector({ form, onLoadDraft, onStartNew }: DraftQuotesSelectorProps) {
  const { user } = useAuth();
  const { loadDrafts, deleteDraft } = useQuoteDraft();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<DraftQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDrafts();
    }
  }, [user]);

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const userDrafts = await loadDrafts();
      setDrafts(userDrafts as DraftQuote[]);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast({
        title: "Failed to Load Drafts",
        description: "Could not retrieve your saved drafts.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDraft = (draft: DraftQuote) => {
    // Populate form with draft data
    if (draft.quote_text) form.setValue('text', draft.quote_text);
    if (draft.author_name) form.setValue('author', draft.author_name);
    if (draft.topics && draft.topics.length > 0) form.setValue('topics', draft.topics);
    if (draft.source_info) {
      form.setValue('sourceInfo', draft.source_info);
    }

    setSelectedDraftId(draft.id);
    
    toast({
      title: "Draft Loaded",
      description: "Click Next to continue editing this quote.",
    });

    // Trigger callback to advance form step
    if (onLoadDraft) {
      onLoadDraft();
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const { error } = await import('@/integrations/supabase/client').then(m => 
        m.supabase.from('quote_drafts').delete().eq('id', draftId)
      );

      if (error) throw error;

      setDrafts(drafts.filter(d => d.id !== draftId));
      toast({
        title: "Draft Deleted",
        description: "Your draft has been permanently removed.",
      });
      
      if (selectedDraftId === draftId) {
        setSelectedDraftId(null);
        form.reset();
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the draft.",
        variant: "destructive"
      });
    }
    setDraftToDelete(null);
  };

  const handleStartNew = () => {
    setSelectedDraftId(null);
    form.reset();
    onStartNew();
    toast({
      title: "New Quote Started",
      description: "Form cleared and ready for a new quote.",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Saved Drafts
              {drafts.length > 0 && (
                <Badge variant="secondary">{drafts.length}</Badge>
              )}
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleStartNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading drafts...
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No saved drafts yet.</p>
              <p className="text-sm">Your drafts will appear here as you work.</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <Card
                    key={draft.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDraftId === draft.id ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div 
                          className="flex-1 min-w-0"
                          onClick={() => handleLoadDraft(draft)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {draft.image_url && (
                              <Badge variant="outline" className="text-xs">
                                📷 Has Evidence
                              </Badge>
                            )}
                            {selectedDraftId === draft.id && (
                              <Badge variant="default" className="text-xs">
                                Currently Editing
                              </Badge>
                            )}
                          </div>
                          
                          <p className="font-medium truncate mb-1">
                            {draft.quote_text || 'Untitled Quote'}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                            {draft.author_name && (
                              <span>by {draft.author_name}</span>
                            )}
                            {draft.topics && draft.topics.length > 0 && (
                              <span className="flex gap-1">
                                · Topics: {draft.topics.slice(0, 2).join(', ')}
                                {draft.topics.length > 2 && ' ...'}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Last edited {formatDistanceToNow(new Date(draft.updated_at), { addSuffix: true })}
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDraftToDelete(draft.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!draftToDelete} onOpenChange={() => setDraftToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this draft. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => draftToDelete && handleDeleteDraft(draftToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
