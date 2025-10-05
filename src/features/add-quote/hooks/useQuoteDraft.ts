import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { QuoteDraftService, QuoteDraft } from '@/services/quoteDraftService';
import type { QuoteFormValues } from '@/utils/formSchemas';

export function useQuoteDraft() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  const saveDraft = useCallback(async (
    formData: Partial<QuoteFormValues>,
    imageUrl?: string,
    ocrText?: string,
    evidenceImageName?: string,
    showToast = true
  ) => {
    if (!user) {
      if (showToast) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save drafts.",
          variant: "destructive"
        });
      }
      return { success: false };
    }

    setIsSaving(true);
    try {
      const result = await QuoteDraftService.saveDraft(
        user.id,
        formData,
        imageUrl,
        ocrText,
        evidenceImageName
      );

      if (result.success && result.draftId) {
        setCurrentDraftId(result.draftId);
        if (showToast) {
          toast({
            title: "Draft Saved",
            description: "Your quote has been saved as a draft.",
          });
        }
      } else if (result.error && showToast) {
        toast({
          title: "Save Failed",
          description: result.error,
          variant: "destructive"
        });
      }

      return result;
    } catch (error) {
      console.error('Error in saveDraft:', error);
      if (showToast) {
        toast({
          title: "Save Failed",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      }
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  }, [user, toast]);

  const deleteDraft = useCallback(async (imageUrl?: string) => {
    if (!user) return { success: false };

    try {
      let result;
      if (currentDraftId) {
        result = await QuoteDraftService.deleteDraft(currentDraftId);
      } else if (imageUrl) {
        result = await QuoteDraftService.deleteDraftByImage(user.id, imageUrl);
      } else {
        return { success: false };
      }

      if (result.success) {
        setCurrentDraftId(null);
      }
      return result;
    } catch (error) {
      console.error('Error deleting draft:', error);
      return { success: false };
    }
  }, [user, currentDraftId]);

  const loadDrafts = useCallback(async () => {
    if (!user) return [];
    
    try {
      const drafts = await QuoteDraftService.getUserDrafts(user.id);
      return drafts;
    } catch (error) {
      console.error('Error loading drafts:', error);
      return [];
    }
  }, [user]);

  return {
    saveDraft,
    deleteDraft,
    loadDrafts,
    isSaving,
    currentDraftId
  };
}
