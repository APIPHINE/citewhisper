
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAccessControl } from '@/hooks/useAccessControl';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadArea } from '@/components/ui/file-upload-area';
import { quoteSchema, QuoteFormValues } from '@/utils/formSchemas';
import { useQuoteSubmission } from '@/features/add-quote/hooks/useQuoteSubmission';
import { QuoteFormFields } from '@/features/add-quote/components/QuoteFormFields';
import { JsonImportSection } from '@/features/add-quote/components/JsonImportSection';
import { CsvImportSection } from '@/features/add-quote/components/CsvImportSection';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

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
      source: '',
      sourceUrl: '',
      sourcePublicationDate: '',
      originalLanguage: '',
      originalText: '',
      context: '',
      historicalContext: '',
      topics: [],
      theme: '',
      keywords: [],
      emotionalTone: '',
      originalSource: {
        title: '',
        publisher: '',
        publicationDate: '',
        location: '',
        isbn: '',
        sourceUrl: ''
      },
      translations: []
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
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add a New Quote</h1>
        <p className="text-muted-foreground">
          Share your favorite quotes with the world.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Format import sections */}
          <div className="mb-8 space-y-6">
            <h2 className="text-xl font-semibold">Import Quote</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <JsonImportSection formReset={form.reset} />
              <CsvImportSection formReset={form.reset} />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <QuoteFormFields form={form} />
              
              {/* File upload section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold">Evidence Image</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload an image of the original source. Images will be processed with appropriate attribution metadata
                  to comply with our Fair Use Policy.
                </p>
                <FileUploadArea
                  onFilesSelected={handleFilesSelected}
                  maxFiles={1}
                  acceptedFileTypes={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
                  maxSizeMB={5}
                  selectedFiles={selectedFiles}
                />
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Selected Image:</h3>
                    <img
                      src={URL.createObjectURL(selectedFiles[0])}
                      alt="Evidence"
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Quote"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        <aside className="md:col-span-1">
          <div className="bg-secondary/50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Tips for a Good Quote Submission:</h3>
            <ul className="list-disc list-inside text-sm">
              <li>Make sure the quote is accurate.</li>
              <li>Provide a reliable source for the quote.</li>
              <li>Add context to help others understand the quote's meaning.</li>
            </ul>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Fair Use Compliance
            </h3>
            <p className="text-sm mb-2">
              All content submitted to CiteQuotes is subject to our Fair Use Policy. We add 
              attribution metadata to all uploaded evidence images.
            </p>
            <Link 
              to="/fair-use-policy" 
              className="text-sm text-accent underline hover:text-accent/80"
            >
              Read our Fair Use Policy
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddQuote;
