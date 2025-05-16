
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Form } from '@/components/ui/form';
import { quoteSchema, type QuoteFormValues } from '../utils/formSchemas';
import { JsonImportSection } from '@/features/add-quote/components/JsonImportSection';
import { QuoteFormFields } from '@/features/add-quote/components/QuoteFormFields';
import { useQuoteSubmission } from '@/features/add-quote/hooks/useQuoteSubmission';
import { FileUploadArea } from '@/components/tools/FileUploadArea';

const AddQuote = () => {
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  
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
    }
  });

  const { handleSubmit, isSubmitting } = useQuoteSubmission();

  const onSubmit = async (data: QuoteFormValues) => {
    const result = await handleSubmit(data, evidenceImage || undefined);
    if (result) {
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
      });
      setEvidenceImage(null);
    }
  };

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setEvidenceImage(files[0]);
    }
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
          <JsonImportSection formReset={form.reset} />
          
          <Separator className="my-8" />

          {/* Manual Entry Form */}
          <p className="text-muted-foreground mb-8 max-w-xl">
            Help expand our collection of verified quotes. Please provide as much information as possible.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
              <QuoteFormFields form={form} />
              
              {/* Evidence Image Upload */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Evidence Image</h2>
                <p className="text-sm text-muted-foreground">
                  Upload an image showing the source of the quote for verification purposes.
                </p>
                <FileUploadArea
                  onFilesSelected={handleFileChange}
                  maxFiles={1}
                  acceptedFileTypes={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
                  }}
                  maxSizeMB={5}
                  selectedFiles={evidenceImage ? [evidenceImage] : []}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <PlusCircle className="mr-2" /> {isSubmitting ? 'Submitting...' : 'Submit Quote'}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddQuote;
