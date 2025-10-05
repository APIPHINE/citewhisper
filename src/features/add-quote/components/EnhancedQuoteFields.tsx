import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import type { QuoteFormValues } from '@/utils/formSchemas';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Wand2 } from 'lucide-react';

interface EnhancedQuoteFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function EnhancedQuoteFields({ form }: EnhancedQuoteFieldsProps) {
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const { toast } = useToast();

  const getTopicsString = () => {
    const topics = form.watch('topics');
    return topics && topics.length > 0 ? topics.join(', ') : '';
  };

  const getKeywordsString = () => {
    const keywords = form.watch('keywords');
    return keywords && keywords.length > 0 ? keywords.join(', ') : '';
  };

  const handleTopicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const topicsString = e.target.value;
    form.setValue('topics', topicsString.split(',').map(item => item.trim()).filter(Boolean));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywordsString = e.target.value;
    form.setValue('keywords', keywordsString.split(',').map(item => item.trim()).filter(Boolean));
  };

  const handleAutoFillContext = async () => {
    const quoteText = form.getValues('text');
    const author = form.getValues('author');
    
    if (!quoteText) {
      toast({
        title: "No Quote Text",
        description: "Please enter a quote first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAutoFilling(true);
    try {
      const { data, error } = await supabase.functions.invoke('autofill-quote-metadata', {
        body: {
          quoteText,
          ocrContext: author ? `Author: ${author}` : ''
        }
      });

      if (error) throw error;

      // Populate context fields
      if (data.context && !form.getValues('context')) {
        form.setValue('context', data.context);
      }
      
      // Populate topics if not already filled
      if (data.topics && Array.isArray(data.topics) && data.topics.length > 0) {
        const existingTopics = form.getValues('topics') || [];
        if (existingTopics.length === 0) {
          form.setValue('topics', data.topics);
        }
      }

      toast({
        title: "Context Auto-filled",
        description: "AI has suggested context and categorization.",
      });
    } catch (error) {
      console.error('Auto-fill error:', error);
      toast({
        title: "Auto-fill Failed",
        description: error instanceof Error ? error.message : "Could not extract context. Please fill manually.",
        variant: "destructive"
      });
    } finally {
      setIsAutoFilling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Autofill Button */}
      <Button
        type="button"
        onClick={handleAutoFillContext}
        disabled={isAutoFilling || !form.watch('text')}
        variant="secondary"
        className="w-full"
      >
        <Wand2 className="h-4 w-4 mr-2" />
        {isAutoFilling ? "Auto-filling Context..." : "Auto Fill Context with AI"}
      </Button>

      {/* Context Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Context & Background</h3>
        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Context</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="The situation or circumstances when this was said" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="historicalContext"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Historical Context</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Historical background and significance" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Language & Translation Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Language & Translation</h3>
        <FormField
          control={form.control}
          name="originalLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original Language</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Spanish, French, Latin, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="originalText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original Text</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Quote text in its original language" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Translations will be managed separately in a dedicated component */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Translations:</strong> After creating the quote, you can add multiple translations with proper attribution, quality ratings, and verification status.
          </p>
        </div>
      </div>

      {/* Categorization Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Categorization</h3>
        <FormItem>
          <FormLabel>Topics</FormLabel>
          <FormControl>
            <Input
              value={getTopicsString()}
              onChange={handleTopicsChange}
              placeholder="e.g., Politics, Science, Philosophy (comma-separated)"
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Main theme or subject" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emotionalTone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emotional Tone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Hopeful, Reflective, Urgent, Cautionary" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Keywords</FormLabel>
          <FormControl>
            <Input
              value={getKeywordsString()}
              onChange={handleKeywordsChange}
              placeholder="e.g., revolution, democracy, freedom (comma-separated)"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>

      {/* Note: Source Details moved to SourceInfoFields component */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Source Details:</strong> Use the Source Information section below to add comprehensive source details including URLs, publication info, and more.
        </p>
      </div>
    </div>
  );
}