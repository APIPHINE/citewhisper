import React, { useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { BatchQuoteFormValues } from '@/utils/formSchemas';
import { SourceInfoFields } from './SourceInfoFields';
import { Plus, Trash2, Copy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BatchQuoteFormProps {
  form: UseFormReturn<BatchQuoteFormValues>;
}

export function BatchQuoteForm({ form }: BatchQuoteFormProps) {
  const { fields, append, remove, insert } = useFieldArray({
    control: form.control,
    name: 'quotes'
  });

  const [expandedQuote, setExpandedQuote] = useState<number>(0);

  const addNewQuote = () => {
    append({
      text: '',
      author: '',
      date: '',
      context: '',
      historicalContext: '',
      topics: [],
      theme: '',
      keywords: [],
      originalLanguage: '',
      originalText: '',
      emotionalTone: '',
      translations: []
    });
    setExpandedQuote(fields.length);
  };

  const duplicateQuote = (index: number) => {
    const quoteToDuplicate = form.getValues(`quotes.${index}`);
    insert(index + 1, { ...quoteToDuplicate });
  };

  const removeQuote = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      if (expandedQuote >= index && expandedQuote > 0) {
        setExpandedQuote(expandedQuote - 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Batch Quote Submission
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Add multiple quotes that share the same source information
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {fields.length} quote{fields.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Shared Source Information */}
      <SourceInfoFields form={form as any} />

      {/* Quote List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quotes</h3>
          <Button onClick={addNewQuote} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Quote
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id} className={cn(
            "transition-all duration-200",
            expandedQuote === index ? "ring-2 ring-primary/20" : ""
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Quote {index + 1}</h4>
                  {form.watch(`quotes.${index}.text`) && (
                    <Badge variant="secondary" className="text-xs">
                      {form.watch(`quotes.${index}.text`).length} chars
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateQuote(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuote(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Quote Text */}
              <FormField
                control={form.control}
                name={`quotes.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote Text*</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the quote text"
                        className="min-h-[100px]"
                        onFocus={() => setExpandedQuote(index)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Author and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`quotes.${index}.author`}
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
                  name={`quotes.${index}.date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="When was it said/written?" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Expandable sections */}
              {expandedQuote === index && (
                <div className="space-y-4 border-t pt-4">
                  <FormField
                    control={form.control}
                    name={`quotes.${index}.context`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Context</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Provide context about this specific quote"
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`quotes.${index}.theme`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., leadership, wisdom" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`quotes.${index}.emotionalTone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emotional Tone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., inspiring, somber" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-muted/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Quick Actions</h4>
              <p className="text-sm text-muted-foreground">
                Manage your batch submission
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={addNewQuote} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Quote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}