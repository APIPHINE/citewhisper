import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
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
import { QuoteFormSchema, QuoteFormValues } from '@/utils/formSchemas';
import { useQuoteSubmission } from '@/features/add-quote/hooks/useQuoteSubmission';
import { QuoteFormFields } from '@/features/add-quote/components/QuoteFormFields';

const AddQuote = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const { handleSubmit, isSubmitting } = useQuoteSubmission();
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add a New Quote</h1>
        <p className="text-muted-foreground">
          Share your favorite quotes with the world.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <QuoteFormFields form={form} />
              
              {/* File upload section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Evidence Image</h2>
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
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Tips for a Good Quote Submission:</h3>
            <ul className="list-disc list-inside text-sm">
              <li>Make sure the quote is accurate.</li>
              <li>Provide a reliable source for the quote.</li>
              <li>Add context to help others understand the quote's meaning.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddQuote;
