
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, FileJson, Import } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import type { Quote } from '../utils/quotesData';
import { quoteSchema, type QuoteFormValues } from '../utils/formSchemas';

const AddQuote = () => {
  const [jsonInput, setJsonInput] = useState('');
  const { toast } = useToast();
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      text: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      topics: [],
      theme: '',
      source: '',
      sourceUrl: '',
      sourcePublicationDate: '',
      originalLanguage: '',
      originalText: '',
      context: '',
      historicalContext: '',
      keywords: [],
      citationAPA: '',
      citationMLA: '',
      citationChicago: '',
    }
  });

  const handleJsonImport = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      
      // Validate required fields
      if (!parsedJson.text || !parsedJson.author) {
        throw new Error("Quote text and author are required");
      }

      // Handle arrays correctly
      const formattedData = {
        ...parsedJson,
        topics: Array.isArray(parsedJson.topics) ? parsedJson.topics : [],
        keywords: Array.isArray(parsedJson.keywords) ? parsedJson.keywords : [],
      };

      form.reset(formattedData);

      toast({
        title: "JSON Imported",
        description: "Form fields have been populated from JSON data.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: error instanceof Error ? error.message : "Please check your JSON format",
        variant: "destructive"
      });
    }
  };

  const onSubmit = (data: QuoteFormValues) => {
    // Generate a unique ID based on author's name and timestamp
    const timestamp = Date.now();
    const authorPrefix = data.author.toLowerCase().replace(/\s+/g, '_').slice(0, 10);
    const newId = `quote_${timestamp}_${authorPrefix}`;

    const newQuote: Quote = {
      id: newId,
      text: data.text,
      author: data.author,
      date: data.date || new Date().toISOString().split('T')[0],
      topics: data.topics || [],
      theme: data.theme || '',
      source: data.source,
      sourceUrl: data.sourceUrl,
      sourcePublicationDate: data.sourcePublicationDate,
      originalLanguage: data.originalLanguage,
      originalText: data.originalText,
      context: data.context,
      historicalContext: data.historicalContext,
      keywords: data.keywords,
      citationAPA: data.citationAPA,
      citationMLA: data.citationMLA,
      citationChicago: data.citationChicago,
      exportFormats: {
        json: true,
        csv: true,
        cff: true
      },
      shareCount: 0
    };

    // Here you would typically send the data to your backend
    console.log('New Quote:', newQuote);

    toast({
      title: "Quote Submitted",
      description: "Your quote has been submitted successfully.",
    });

    form.reset({
      text: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      topics: [],
      theme: '',
      source: '',
      sourceUrl: '',
      sourcePublicationDate: '',
      originalLanguage: '',
      originalText: '',
      context: '',
      historicalContext: '',
      keywords: [],
      citationAPA: '',
      citationMLA: '',
      citationChicago: '',
    });
  };

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
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header section */}
          <div className="inline-flex items-center justify-center mb-4 bg-secondary/80 text-foreground px-4 py-2 rounded-full text-sm">
            <PlusCircle size={16} className="mr-2" /> Add New Quote
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contribute a Quote</h1>
          
          {/* JSON Import Section */}
          <div className="mb-8 p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileJson className="mr-2" /> Import from JSON
            </h2>
            <div className="space-y-4">
              <Textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`{
  "text": "",
  "author": "",
  "date": "YYYY-MM-DD",
  "topics": ["topic1", "topic2"],
  "theme": "",
  "source": "",
  "sourceUrl": "",
  "sourcePublicationDate": "YYYY-MM-DD",
  "originalLanguage": "",
  "originalText": "",
  "context": "",
  "historicalContext": "",
  "keywords": ["keyword1", "keyword2"],
  "citationAPA": "",
  "citationMLA": "",
  "citationChicago": ""
}`}
                className="min-h-[200px] font-mono text-sm"
              />
              <Button onClick={handleJsonImport} className="w-full">
                <Import className="mr-2" /> Import JSON and Fill Form
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Manual Entry Form */}
          <p className="text-muted-foreground mb-8 max-w-xl">
            Help expand our collection of verified quotes. Please provide as much information as possible.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
              {/* Required Fields */}
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
                        <Input
                          {...field}
                          placeholder="Who said this quote?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Source Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Source Information</h2>
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Original source of the quote"
                        />
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
                        <Input
                          {...field}
                          placeholder="URL of the source"
                          type="url"
                        />
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
                        <Input
                          {...field}
                          type="date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Original Language */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Original Version</h2>
                <FormField
                  control={form.control}
                  name="originalLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Language</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Spanish, French, etc."
                        />
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
                        <Textarea
                          {...field}
                          placeholder="Original quote text in its native language"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Context and Categories */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Context and Categories</h2>
                <FormField
                  control={form.control}
                  name="context"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Context</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="The context in which this quote was said"
                        />
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
                        <Textarea
                          {...field}
                          placeholder="Historical background of the quote"
                        />
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
                        <Input
                          {...field}
                          placeholder="Main theme of the quote"
                        />
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

              {/* Citations */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Citations</h2>
                <FormField
                  control={form.control}
                  name="citationAPA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>APA Citation</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="APA format citation"
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
                        <Input
                          {...field}
                          placeholder="MLA format citation"
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
                        <Input
                          {...field}
                          placeholder="Chicago format citation"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2" /> Submit Quote
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddQuote;
