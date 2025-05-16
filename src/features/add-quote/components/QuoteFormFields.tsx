
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import type { QuoteFormValues } from '@/utils/formSchemas';

interface QuoteFormFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function QuoteFormFields({ form }: QuoteFormFieldsProps) {
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
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Required Information</h2>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote Text*</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter the full quote text"
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Who said this quote?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Source Information</h2>
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Original source of the quote" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Original Version</h2>
        <FormField
          control={form.control}
          name="originalLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original Language</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Spanish, French, etc." />
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
                <Textarea {...field} placeholder="Original quote text in its native language" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Context and Categories</h2>
        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Context</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="The context in which this quote was said" />
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
                <Textarea {...field} placeholder="Historical background of the quote" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Topics (comma-separated)</FormLabel>
          <FormControl>
            <Input
              value={getTopicsString()}
              onChange={handleTopicsChange}
              placeholder="e.g., Politics, Science, Philosophy"
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
                <Input {...field} placeholder="Main theme of the quote" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Keywords (comma-separated)</FormLabel>
          <FormControl>
            <Input
              value={getKeywordsString()}
              onChange={handleKeywordsChange}
              placeholder="e.g., revolution, democracy, freedom"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
    </>
  );
}
