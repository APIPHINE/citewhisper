import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import type { QuoteFormValues } from '@/utils/formSchemas';

interface EnhancedQuoteFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function EnhancedQuoteFields({ form }: EnhancedQuoteFieldsProps) {
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

  return (
    <div className="space-y-6">
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

      {/* Source Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Source Details</h3>
        <FormField
          control={form.control}
          name="sourceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="URL of the source" type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sourcePublicationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publication Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}