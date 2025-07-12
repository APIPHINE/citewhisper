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
          <FormItem>
            <FormLabel>Verification Status</FormLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select verification status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <FormLabel>Attribution Status</FormLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select attribution status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="probable">Probable</SelectItem>
                <SelectItem value="questionable">Questionable</SelectItem>
                <SelectItem value="misattributed">Misattributed</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>
      </div>

      {/* Citations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Academic Citations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormItem>
            <FormLabel>APA Citation</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Auto-generated APA citation will appear here"
                className="text-sm"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>MLA Citation</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Auto-generated MLA citation will appear here"
                className="text-sm"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Chicago Citation</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Auto-generated Chicago citation will appear here"
                className="text-sm"
              />
            </FormControl>
          </FormItem>
        </CardContent>
      </Card>

      {/* Manuscript & OCR Data */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Manuscript & Digital Analysis</h3>
        <FormItem>
          <FormLabel>Original Manuscript Reference</FormLabel>
          <FormControl>
            <Input placeholder="Reference to original manuscript or document" />
          </FormControl>
        </FormItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>OCR Extracted Text</FormLabel>
            <FormControl>
              <Textarea placeholder="Text extracted via OCR from image" />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>OCR Confidence Score</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                max="100" 
                placeholder="0-100 (confidence percentage)"
              />
            </FormControl>
          </FormItem>
        </div>
      </div>

      {/* Additional Scholarly Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Scholarly Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormItem>
            <FormLabel>Impact & Significance</FormLabel>
            <FormControl>
              <Textarea placeholder="Historical impact and significance of this quote" />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Translator (if applicable)</FormLabel>
            <FormControl>
              <Input placeholder="Name of translator" />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Cross-Referenced Quote IDs</FormLabel>
            <FormControl>
              <Input placeholder="Related quote IDs (comma-separated)" />
            </FormControl>
          </FormItem>
        </CardContent>
      </Card>

      {/* Original Source Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detailed Source Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>Source Title</FormLabel>
              <FormControl>
                <Input placeholder="Title of the source document/book" />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Publisher</FormLabel>
              <FormControl>
                <Input placeholder="Publishing house or organization" />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Publication Location</FormLabel>
              <FormControl>
                <Input placeholder="City of publication" />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input placeholder="ISBN number if applicable" />
              </FormControl>
            </FormItem>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}