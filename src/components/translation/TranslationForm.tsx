import { useState } from 'react';
import { Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

interface TranslationFormData {
  language: string;
  text: string;
  translator?: string;
  translationType: 'human' | 'ai' | 'machine';
  translatorType: 'human' | 'ai' | 'community';
  source?: string;
  aiModel?: string;
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
      // Set translation type based on translator type
      translationType: value === 'ai' ? 'ai' : 'human',
      // Clear AI model if not AI translation
      aiModel: value === 'ai' ? prev.aiModel : undefined,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="language">Target Language</Label>
          <Select 
            value={formData.language} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
          >
            <SelectTrigger>
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

        <div>
          <Label htmlFor="text">Translation</Label>
          <Textarea
            id="text"
            value={formData.text}
            onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Enter the translated text"
            rows={4}
            required
          />
        </div>

        <div>
          <Label>Translation Method</Label>
          <RadioGroup 
            value={formData.translatorType} 
            onValueChange={handleTranslatorTypeChange}
            className="mt-2"
          >
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="human" id="human" />
                <Label htmlFor="human" className="flex items-center gap-2 cursor-pointer">
                  <User size={16} />
                  Human Translation
                </Label>
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ai" id="ai" />
                <Label htmlFor="ai" className="flex items-center gap-2 cursor-pointer">
                  <Bot size={16} />
                  AI Translation (CiteQuotes AI)
                </Label>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="community" id="community" />
                <Label htmlFor="community" className="flex items-center gap-2 cursor-pointer">
                  <User size={16} />
                  Community Translation
                </Label>
              </div>
            </Card>
          </RadioGroup>
        </div>

        {formData.translatorType === 'human' && (
          <div>
            <Label htmlFor="translator">Translator Name</Label>
            <Input
              id="translator"
              value={formData.translator || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, translator: e.target.value }))}
              placeholder="Name of the translator"
            />
          </div>
        )}

        {formData.translatorType === 'ai' && (
          <div>
            <Label htmlFor="aiModel">AI Model</Label>
            <Select 
              value={formData.aiModel || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, aiModel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model used" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citequotes-ai">CiteQuotes AI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="source">Translation Source</Label>
          <Input
            id="source"
            value={formData.source || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            placeholder="Source or reference for this translation"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
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