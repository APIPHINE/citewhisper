import { useState } from 'react';
import { Bot, User, Upload, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

export interface TranslationFormData {
  language: string;
  text: string;
  translator?: string;
  translationType: 'human' | 'ai' | 'machine';
  translatorType: 'human' | 'ai' | 'community';
  source?: string;
  sourceUrl?: string;
  aiModel?: string;
  publication?: string;
  publicationDate?: string;
  imageFile?: File;
  imagePreview?: string;
}

interface TranslationFormProps {
  onSubmit: (translation: TranslationFormData) => void;
  onCancel: () => void;
}

const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ko', name: 'Korean' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'sv', name: 'Swedish' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'la', name: 'Latin' },
];

export function TranslationForm({ onSubmit, onCancel }: TranslationFormProps) {
  const [formData, setFormData] = useState<TranslationFormData>({
    language: '',
    text: '',
    translationType: 'human',
    translatorType: 'human',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.language && formData.text) {
      onSubmit(formData);
    }
  };

  const handleTranslatorTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      translatorType: value as 'human' | 'ai' | 'community',
      translationType: value === 'ai' ? 'ai' : 'human',
      aiModel: value === 'ai' ? prev.aiModel : undefined,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: undefined,
      imagePreview: undefined,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-4">
        {/* Language Selection */}
        <div>
          <Label htmlFor="language">Target Language *</Label>
          <Select 
            value={formData.language} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Translation Text */}
        <div>
          <Label htmlFor="text">Translation Text *</Label>
          <Textarea
            id="text"
            value={formData.text}
            onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Enter the translated text"
            rows={4}
            className="mt-1"
            required
          />
        </div>

        {/* Translation Method */}
        <div>
          <Label>Translation Method</Label>
          <RadioGroup 
            value={formData.translatorType} 
            onValueChange={handleTranslatorTypeChange}
            className="mt-2 space-y-2"
          >
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="human" id="human" />
                <Label htmlFor="human" className="flex items-center gap-2 cursor-pointer font-normal">
                  <User size={16} />
                  Human Translation (Professional/Published)
                </Label>
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ai" id="ai" />
                <Label htmlFor="ai" className="flex items-center gap-2 cursor-pointer font-normal">
                  <Bot size={16} />
                  AI Translation
                </Label>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="community" id="community" />
                <Label htmlFor="community" className="flex items-center gap-2 cursor-pointer font-normal">
                  <User size={16} />
                  Community Translation
                </Label>
              </div>
            </Card>
          </RadioGroup>
        </div>

        {/* Conditional Fields based on translator type */}
        {formData.translatorType === 'human' && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h4 className="font-medium text-sm">Professional Translation Details</h4>
            
            <div>
              <Label htmlFor="translator">Translator Name</Label>
              <Input
                id="translator"
                value={formData.translator || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, translator: e.target.value }))}
                placeholder="e.g., John Smith, Official Translator"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="publication">Publication/Book Title</Label>
              <Input
                id="publication"
                value={formData.publication || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, publication: e.target.value }))}
                placeholder="e.g., 'The Complete Works - Spanish Edition'"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="publicationDate">Publication Date</Label>
              <Input
                id="publicationDate"
                type="date"
                value={formData.publicationDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, publicationDate: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {formData.translatorType === 'ai' && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h4 className="font-medium text-sm">AI Translation Details</h4>
            <div>
              <Label htmlFor="aiModel">AI Model Used</Label>
              <Select 
                value={formData.aiModel || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, aiModel: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select AI model used" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="citequotes-ai">CiteQuotes AI</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="deepl">DeepL</SelectItem>
                  <SelectItem value="google-translate">Google Translate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Source Information */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <LinkIcon size={14} />
            Source & Reference
          </h4>

          <div>
            <Label htmlFor="source">Source Reference</Label>
            <Input
              id="source"
              value={formData.source || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              placeholder="e.g., 'Official Spanish Edition, Chapter 3, p.45'"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sourceUrl">Source URL (optional)</Label>
            <Input
              id="sourceUrl"
              type="url"
              value={formData.sourceUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
              placeholder="https://example.com/translation-source"
              className="mt-1"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-3 p-4 border rounded-lg">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Upload size={14} />
            Attach Evidence Image (optional)
          </h4>
          <p className="text-xs text-muted-foreground">
            Upload an image of the original translated source document
          </p>

          {formData.imagePreview ? (
            <div className="relative inline-block">
              <img 
                src={formData.imagePreview} 
                alt="Translation evidence" 
                className="max-h-40 rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={removeImage}
              >
                <X size={14} />
              </Button>
            </div>
          ) : (
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t sticky bottom-0 bg-background">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!formData.language || !formData.text}>
          Add Translation
        </Button>
      </div>
    </form>
  );
}
