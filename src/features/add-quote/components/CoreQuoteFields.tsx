import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import type { QuoteFormValues } from '@/utils/formSchemas';

interface CoreQuoteFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function CoreQuoteFields({ form }: CoreQuoteFieldsProps) {
  return (
    <div className="space-y-4">
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

      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., 1463, March 1776, or specific date"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  );
}