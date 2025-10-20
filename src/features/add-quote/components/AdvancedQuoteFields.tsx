import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import type { QuoteFormValues } from '@/utils/formSchemas';

interface AdvancedQuoteFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function AdvancedQuoteFields({ form }: AdvancedQuoteFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Verification & Attribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="attributionStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attribution Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select attribution status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="probable">Probable</SelectItem>
                    <SelectItem value="questionable">Questionable</SelectItem>
                    <SelectItem value="misattributed">Misattributed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Citations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Academic Citations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="citationAPA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>APA Citation</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="e.g., Author, A. (Year). Title. Publisher."
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="citationMLA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MLA Citation</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="e.g., Author, First. Title. Publisher, Year."
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="citationChicago"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chicago Citation</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="e.g., Author, First. Title. City: Publisher, Year."
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Manuscript & OCR Data */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Manuscript & Digital Analysis</h3>
        <FormField
          control={form.control}
          name="originalManuscriptReference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original Manuscript Reference</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Reference to original manuscript or document" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ocrExtractedText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OCR Extracted Text</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Text extracted via OCR from image" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ocrConfidenceScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OCR Confidence Score</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="0-100 (confidence percentage)"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Additional Scholarly Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Scholarly Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="impact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impact & Significance</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Historical impact and significance of this quote" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="translator"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Translator (if applicable)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name of translator" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Note about Source Information */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Detailed Source Information:</strong> Use the Source Information section (accessed separately) for comprehensive source details including publisher, ISBN, DOI, and URLs.
        </p>
      </div>
    </div>
  );
}