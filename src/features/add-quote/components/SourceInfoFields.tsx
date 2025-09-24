import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuoteFormValues } from '@/utils/formSchemas';
import { SOURCE_TYPES, SOURCE_TYPE_FIELDS, ADDITIONAL_URL_FIELDS, URL_FIELD_LABELS, SourceType } from '@/utils/sourceTypeFields';
import { archiveUrlWithWayback } from '@/services/waybackService';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Archive, Link2 } from 'lucide-react';

interface SourceInfoFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function SourceInfoFields({ form }: SourceInfoFieldsProps) {
  const { toast } = useToast();
  const [isArchiving, setIsArchiving] = useState(false);
  const [archivedUrls, setArchivedUrls] = useState<Record<string, string>>({});
  
  const sourceInfo = form.watch('sourceInfo');
  const sourceType = sourceInfo?.source_type;

  // Get dynamic fields based on source type
  const dynamicFields = sourceType ? SOURCE_TYPE_FIELDS[sourceType] || [] : [];
  const urlFields = sourceType ? ADDITIONAL_URL_FIELDS[sourceType] || [] : [];

  // Handle archiving URLs to Wayback Machine
  const handleArchiveUrl = async (fieldName: string, url: string) => {
    if (!url || archivedUrls[fieldName]) return;
    
    setIsArchiving(true);
    try {
      const archivedUrl = await archiveUrlWithWayback(url);
      if (archivedUrl) {
        setArchivedUrls(prev => ({ ...prev, [fieldName]: archivedUrl }));
        
        // Update the backup_url field in the form
        form.setValue('sourceInfo.backup_url', archivedUrl);
        
        toast({
          title: "URL Archived",
          description: "The URL has been saved to the Wayback Machine",
        });
      }
    } catch (error) {
      console.error('Archive error:', error);
      toast({
        title: "Archive Failed",
        description: "Could not archive the URL. You can still submit the quote.",
        variant: "destructive"
      });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Source Information
          <Badge variant="outline" className="ml-auto">Enhanced</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Provide detailed source information for accurate attribution
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Source Type Selection */}
        <FormField
          control={form.control}
          name="sourceInfo.source_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Type*</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Clear dynamic fields when source type changes
                  const currentSourceInfo = form.getValues('sourceInfo') || {};
                  form.setValue('sourceInfo', {
                    ...currentSourceInfo,
                    source_type: value as SourceType
                  });
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {SOURCE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {sourceType && (
          <>
            {/* Basic Source Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sourceInfo.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Source title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceInfo.author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Author</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Author of the source" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceInfo.publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Publisher name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceInfo.publication_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 1776-07-04, July 1776" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dynamic Location Fields */}
            {dynamicFields.length > 0 && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Location in Source</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dynamicFields.map((fieldConfig) => (
                      <FormField
                        key={fieldConfig.field}
                        control={form.control}
                        name={`sourceInfo.${fieldConfig.field}` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {fieldConfig.label}
                              {fieldConfig.required && <span className="text-destructive">*</span>}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                type={fieldConfig.type === 'number' ? 'number' : 'text'}
                                placeholder={fieldConfig.placeholder}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* URL Fields */}
            {urlFields.length > 0 && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Source Links</h4>
                  <div className="space-y-4">
                    {urlFields.map((urlField) => (
                      <FormField
                        key={urlField}
                        control={form.control}
                        name={`sourceInfo.${urlField}` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              {URL_FIELD_LABELS[urlField] || urlField}
                              {urlField === 'primary_url' && <Badge variant="secondary" className="text-xs">Auto-archived</Badge>}
                            </FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="url"
                                  placeholder={`Enter ${URL_FIELD_LABELS[urlField] || urlField}`}
                                />
                              </FormControl>
                              {urlField === 'primary_url' && field.value && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleArchiveUrl(urlField, field.value)}
                                  disabled={isArchiving || !!archivedUrls[urlField]}
                                  className="shrink-0"
                                >
                                  {archivedUrls[urlField] ? (
                                    <Archive className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <ExternalLink className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                            {archivedUrls[urlField] && (
                              <p className="text-xs text-muted-foreground">
                                Archived: <a href={archivedUrls[urlField]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  View archived version
                                </a>
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Metadata */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sourceInfo.language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., en, fr, de" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourceInfo.confidence_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidence Score</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="number"
                          min={0}
                          max={1}
                          step={0.1}
                          placeholder="0.0 - 1.0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sourceInfo.archive_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Archive Location</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="Physical location or digital archive information"
                        className="min-h-[60px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}