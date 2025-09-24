
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAccessControl } from '@/hooks/useAccessControl';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quoteSchema, QuoteFormValues } from '@/utils/formSchemas';
import { useQuoteSubmission } from '@/features/add-quote/hooks/useQuoteSubmission';
import { EvidenceFirstQuoteForm } from '@/features/add-quote/components/EvidenceFirstQuoteForm';
import { JsonImportSection } from '@/features/add-quote/components/JsonImportSection';
import { CsvImportSection } from '@/features/add-quote/components/CsvImportSection';
import { Link } from 'react-router-dom';
import { AlertCircle, Upload, FileText, Sparkles } from 'lucide-react';

const AddQuote = () => {
  // Check access immediately - this will redirect if not authenticated
  const { checkAccess } = useAccessControl();
  
  React.useEffect(() => {
    checkAccess('add quotes');
  }, []);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const { handleSubmit, isSubmitting } = useQuoteSubmission();
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
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
      translations: [],
      sourceInfo: {
        source_type: 'book',
        title: '',
        author: '',
        publisher: '',
        publication_date: '',
        primary_url: '',
        language: 'en'
      }
    },
    mode: "onChange"
  });
  
  // Handle file selection
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const onSubmit = async (data: QuoteFormValues) => {
    const evidenceImage = selectedFiles.length > 0 ? selectedFiles[0] : undefined;
    const newQuote = await handleSubmit(data, evidenceImage);
    if (newQuote) {
      navigate('/quotes');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Add a New Quote
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload evidence and let AI help you create accurate, well-sourced quotes
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <EvidenceFirstQuoteForm 
            form={form} 
            onFilesSelected={handleFilesSelected}
            selectedFiles={selectedFiles}
          />
        </form>
      </Form>

      {/* Alternative Import Methods */}
      <div className="mt-12 pt-8 border-t">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">Alternative Import Methods</h2>
          <p className="text-muted-foreground">
            Already have your quote data in a structured format? Import it directly.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bulk Import */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                JSON Import
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Import structured quote data from JSON files
              </p>
            </CardHeader>
            <CardContent className="relative">
              <JsonImportSection formReset={form.reset} />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                CSV Import
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Bulk import quotes from spreadsheet data
              </p>
            </CardHeader>
            <CardContent className="relative">
              <CsvImportSection formReset={form.reset} />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-dashed border-2 border-muted-foreground/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5" />
                Coming Soon
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                API integration for automated quote imports
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-xs text-muted-foreground">
                  Connect your research tools and databases
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fair Use Notice */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h3 className="font-semibold">Fair Use & Attribution</h3>
            <p className="text-sm text-muted-foreground">
              All submitted content is processed according to our Fair Use Policy. Evidence images 
              are enhanced and tagged with proper attribution metadata to ensure compliance with 
              copyright guidelines.
            </p>
            <Link 
              to="/fair-use-policy" 
              className="text-sm text-accent underline hover:text-accent/80 inline-block"
            >
              Learn more about our Fair Use Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuote;
