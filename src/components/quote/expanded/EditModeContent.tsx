
import { useState, useEffect } from 'react';
import { Quote } from '../../../utils/quotesData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUploadArea } from '@/components/ui/file-upload-area';
import { Save, X, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditModeContentProps {
  quote: Quote;
  onSave: (updatedQuote: Quote) => void;
  onCancel: () => void;
}

export function EditModeContent({ quote, onSave, onCancel }: EditModeContentProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: quote.text,
    author: quote.author,
    source: quote.source || '',
    date: quote.date,
    topics: quote.topics?.join(', ') || '',
    theme: quote.theme || '',
    context: quote.context || '',
    originalText: quote.originalText || '',
    originalLanguage: quote.originalLanguage || '',
    translator: quote.translator || '',
    sourcePublicationDate: quote.sourcePublicationDate || '',
    sourceUrl: quote.sourceUrl || '',
    attributionStatus: quote.attributionStatus || '',
    originalManuscriptReference: quote.originalManuscriptReference || '',
    ocrExtractedText: quote.ocrExtractedText || '',
    ocrConfidenceScore: quote.ocrConfidenceScore || 0
  });
  
  const [evidenceImage, setEvidenceImage] = useState<File[]>([]);
  const [generatedImage, setGeneratedImage] = useState<File[]>([]);
  const [currentEvidenceUrl, setCurrentEvidenceUrl] = useState(quote.evidenceImage || '');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadImage = async (file: File, bucketName: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let evidenceImageUrl = currentEvidenceUrl;
      
      // Upload new evidence image if provided
      if (evidenceImage.length > 0) {
        const uploadedUrl = await uploadImage(evidenceImage[0], 'quote_evidence');
        if (uploadedUrl) {
          evidenceImageUrl = uploadedUrl;
        }
      }

      // Update quote in database using correct column names
      const updatedQuoteData = {
        quote_text: formData.text,
        author_name: formData.author,
        date_original: formData.date,
        quote_context: formData.context,
        quote_image_url: evidenceImageUrl
      };

      const { error } = await supabase
        .from('quotes')
        .update(updatedQuoteData)
        .eq('id', quote.id);

      if (error) {
        throw error;
      }

      const updatedQuote: Quote = {
        ...quote,
        text: formData.text,
        author: formData.author,
        date: formData.date,
        context: formData.context,
        evidenceImage: evidenceImageUrl,
        topics: formData.topics.split(',').map(t => t.trim()).filter(t => t),
        theme: formData.theme,
        source: formData.source,
        originalText: formData.originalText,
        originalLanguage: formData.originalLanguage,
        translator: formData.translator,
        sourcePublicationDate: formData.sourcePublicationDate,
        sourceUrl: formData.sourceUrl,
        attributionStatus: formData.attributionStatus,
        originalManuscriptReference: formData.originalManuscriptReference,
        ocrExtractedText: formData.ocrExtractedText,
        ocrConfidenceScore: formData.ocrConfidenceScore
      };

      onSave(updatedQuote);
      
      toast({
        title: "Quote updated",
        description: "The quote has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: "Update failed",
        description: "Failed to update the quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvidenceImage = () => {
    setCurrentEvidenceUrl('');
    setEvidenceImage([]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Quote</h2>
        <div className="flex gap-2">
          <Button onClick={onCancel} variant="outline" size="sm">
            <X size={16} className="mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} size="sm">
            <Save size={16} className="mr-1" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quote Content */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="text">Quote Text</Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="topics">Topics (comma-separated)</Label>
            <Input
              id="topics"
              value={formData.topics}
              onChange={(e) => handleInputChange('topics', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="theme">Theme</Label>
            <Input
              id="theme"
              value={formData.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="context">Context</Label>
            <Textarea
              id="context"
              value={formData.context}
              onChange={(e) => handleInputChange('context', e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="originalText">Original Text</Label>
            <Textarea
              id="originalText"
              value={formData.originalText}
              onChange={(e) => handleInputChange('originalText', e.target.value)}
              rows={2}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="originalLanguage">Original Language</Label>
            <Input
              id="originalLanguage"
              value={formData.originalLanguage}
              onChange={(e) => handleInputChange('originalLanguage', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="translator">Translator</Label>
            <Input
              id="translator"
              value={formData.translator}
              onChange={(e) => handleInputChange('translator', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sourceUrl">Source URL</Label>
            <Input
              id="sourceUrl"
              value={formData.sourceUrl}
              onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="attributionStatus">Attribution Status</Label>
            <Input
              id="attributionStatus"
              value={formData.attributionStatus}
              onChange={(e) => handleInputChange('attributionStatus', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Evidence Image Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Source Evidence Screenshot</h3>
        
        {currentEvidenceUrl && (
          <div className="relative">
            <img 
              src={currentEvidenceUrl} 
              alt="Current evidence"
              className="max-w-md rounded-lg border"
            />
            <Button
              onClick={handleDeleteEvidenceImage}
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}

        <FileUploadArea
          onFilesSelected={setEvidenceImage}
          maxFiles={1}
          acceptedFileTypes={{
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
          }}
          selectedFiles={evidenceImage}
          className="max-w-md"
        />
      </div>

      {/* OCR Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">OCR Extracted Text</h3>
        
        <div>
          <Label htmlFor="ocrText">Extracted Text</Label>
          <Textarea
            id="ocrText"
            value={formData.ocrExtractedText}
            onChange={(e) => handleInputChange('ocrExtractedText', e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="ocrConfidence">OCR Confidence Score (0-1)</Label>
          <Input
            id="ocrConfidence"
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={formData.ocrConfidenceScore}
            onChange={(e) => handleInputChange('ocrConfidenceScore', parseFloat(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
