import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, FileJson, Import } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import type { Quote } from '../utils/quotesData';

const AddQuote = () => {
  const [formData, setFormData] = useState<Partial<Quote>>({
    exportFormats: {
      json: true,
      csv: true,
      cff: true
    },
    shareCount: 0
  });
  const [jsonInput, setJsonInput] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'topics' || name === 'keywords') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim())
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleJsonImport = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      
      // Validate required fields
      if (!parsedJson.text || !parsedJson.author) {
        throw new Error("Quote text and author are required");
      }

      setFormData({
        ...parsedJson,
        exportFormats: parsedJson.exportFormats || {
          json: true,
          csv: true,
          cff: true
        },
        shareCount: parsedJson.shareCount || 0
      });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.text?.trim() || !formData.author?.trim()) {
      toast({
        title: "Validation Error",
        description: "Quote text and author are required.",
        variant: "destructive"
      });
      return;
    }

    // Generate a unique ID based on author's name and timestamp
    const timestamp = Date.now();
    const authorPrefix = formData.author.toLowerCase().replace(/\s+/g, '_').slice(0, 10);
    const newId = `quote_${timestamp}_${authorPrefix}`;

    const newQuote: Quote = {
      id: newId,
      text: formData.text,
      author: formData.author,
      date: formData.date || new Date().toISOString().split('T')[0],
      topics: formData.topics || [],
      theme: formData.theme || '',
      source: formData.source,
      sourceUrl: formData.sourceUrl,
      sourcePublicationDate: formData.sourcePublicationDate,
      originalLanguage: formData.originalLanguage,
      originalText: formData.originalText,
      context: formData.context,
      historicalContext: formData.historicalContext,
      keywords: formData.keywords,
      citationAPA: formData.citationAPA,
      citationMLA: formData.citationMLA,
      citationChicago: formData.citationChicago,
      exportFormats: formData.exportFormats,
      shareCount: 0
    };

    // Here you would typically send the data to your backend
    console.log('New Quote:', newQuote);

    toast({
      title: "Quote Submitted",
      description: "Your quote has been submitted successfully.",
    });

    // Reset form
    setFormData({
      exportFormats: {
        json: true,
        csv: true,
        cff: true
      },
      shareCount: 0
    });
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
                placeholder="Paste your JSON here..."
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

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Required Fields */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Required Information</h2>
              <div>
                <label htmlFor="text" className="block mb-2 font-medium">Quote Text*</label>
                <Textarea
                  id="text"
                  name="text"
                  value={formData.text || ''}
                  onChange={handleInputChange}
                  placeholder="Enter the full quote text"
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="author" className="block mb-2 font-medium">Author*</label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author || ''}
                  onChange={handleInputChange}
                  placeholder="Who said this quote?"
                  required
                />
              </div>
            </div>

            {/* Source Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Source Information</h2>
              <div>
                <label htmlFor="source" className="block mb-2 font-medium">Source</label>
                <Input
                  id="source"
                  name="source"
                  value={formData.source || ''}
                  onChange={handleInputChange}
                  placeholder="Original source of the quote"
                />
              </div>

              <div>
                <label htmlFor="sourceUrl" className="block mb-2 font-medium">Source URL</label>
                <Input
                  id="sourceUrl"
                  name="sourceUrl"
                  value={formData.sourceUrl || ''}
                  onChange={handleInputChange}
                  placeholder="URL of the source"
                  type="url"
                />
              </div>

              <div>
                <label htmlFor="sourcePublicationDate" className="block mb-2 font-medium">Publication Date</label>
                <Input
                  id="sourcePublicationDate"
                  name="sourcePublicationDate"
                  value={formData.sourcePublicationDate || ''}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>
            </div>

            {/* Original Language */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Original Version</h2>
              <div>
                <label htmlFor="originalLanguage" className="block mb-2 font-medium">Original Language</label>
                <Input
                  id="originalLanguage"
                  name="originalLanguage"
                  value={formData.originalLanguage || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Spanish, French, etc."
                />
              </div>

              <div>
                <label htmlFor="originalText" className="block mb-2 font-medium">Original Text</label>
                <Textarea
                  id="originalText"
                  name="originalText"
                  value={formData.originalText || ''}
                  onChange={handleInputChange}
                  placeholder="Original quote text in its native language"
                />
              </div>
            </div>

            {/* Context and Categories */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Context and Categories</h2>
              <div>
                <label htmlFor="context" className="block mb-2 font-medium">Context</label>
                <Textarea
                  id="context"
                  name="context"
                  value={formData.context || ''}
                  onChange={handleInputChange}
                  placeholder="The context in which this quote was said"
                />
              </div>

              <div>
                <label htmlFor="historicalContext" className="block mb-2 font-medium">Historical Context</label>
                <Textarea
                  id="historicalContext"
                  name="historicalContext"
                  value={formData.historicalContext || ''}
                  onChange={handleInputChange}
                  placeholder="Historical background of the quote"
                />
              </div>

              <div>
                <label htmlFor="topics" className="block mb-2 font-medium">Topics (comma-separated)</label>
                <Input
                  id="topics"
                  name="topics"
                  value={formData.topics ? formData.topics.join(', ') : ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Politics, Science, Philosophy"
                />
              </div>

              <div>
                <label htmlFor="theme" className="block mb-2 font-medium">Theme</label>
                <Input
                  id="theme"
                  name="theme"
                  value={formData.theme || ''}
                  onChange={handleInputChange}
                  placeholder="Main theme of the quote"
                />
              </div>

              <div>
                <label htmlFor="keywords" className="block mb-2 font-medium">Keywords (comma-separated)</label>
                <Input
                  id="keywords"
                  name="keywords"
                  value={formData.keywords ? formData.keywords.join(', ') : ''}
                  onChange={handleInputChange}
                  placeholder="e.g., revolution, democracy, freedom"
                />
              </div>
            </div>

            {/* Citations */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Citations</h2>
              <div>
                <label htmlFor="citationAPA" className="block mb-2 font-medium">APA Citation</label>
                <Input
                  id="citationAPA"
                  name="citationAPA"
                  value={formData.citationAPA || ''}
                  onChange={handleInputChange}
                  placeholder="APA format citation"
                />
              </div>

              <div>
                <label htmlFor="citationMLA" className="block mb-2 font-medium">MLA Citation</label>
                <Input
                  id="citationMLA"
                  name="citationMLA"
                  value={formData.citationMLA || ''}
                  onChange={handleInputChange}
                  placeholder="MLA format citation"
                />
              </div>

              <div>
                <label htmlFor="citationChicago" className="block mb-2 font-medium">Chicago Citation</label>
                <Input
                  id="citationChicago"
                  name="citationChicago"
                  value={formData.citationChicago || ''}
                  onChange={handleInputChange}
                  placeholder="Chicago format citation"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2" /> Submit Quote
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddQuote;
