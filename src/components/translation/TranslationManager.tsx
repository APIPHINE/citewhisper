import { useState } from 'react';
import { Plus, Bot, User, Shield, Star, AlertCircle, ExternalLink, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TranslationForm, TranslationFormData } from './TranslationForm';

interface Translation {
  id: string;
  language: string;
  text: string;
  translator?: string;
  translationType?: 'human' | 'ai' | 'machine';
  translatorType?: 'human' | 'ai' | 'community';
  confidenceScore?: number;
  verified?: boolean;
  qualityRating?: number;
  aiModel?: string;
  source?: string;
  sourceUrl?: string;
  publication?: string;
  publicationDate?: string;
  imageUrl?: string;
}

interface TranslationManagerProps {
  translations: Translation[];
  quoteId: string;
  onAddTranslation: (translation: TranslationFormData) => void;
  onVerifyTranslation: (translationId: string) => void;
  canVerify?: boolean;
}

const languageNames: Record<string, string> = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ar: 'Arabic',
  ko: 'Korean',
  hi: 'Hindi',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  vi: 'Vietnamese',
  th: 'Thai',
  sv: 'Swedish',
  el: 'Greek',
  he: 'Hebrew',
  la: 'Latin',
};

export function TranslationManager({ 
  translations, 
  quoteId, 
  onAddTranslation, 
  onVerifyTranslation,
  canVerify = false 
}: TranslationManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const getTranslatorIcon = (translatorType?: string) => {
    switch (translatorType) {
      case 'ai': return <Bot size={14} className="text-primary" />;
      case 'community': return <User size={14} className="text-secondary-foreground" />;
      default: return <User size={14} className="text-foreground" />;
    }
  };

  const getQualityStars = (rating?: number) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < rating ? "fill-warning text-warning" : "text-muted-foreground/30"} 
      />
    ));
  };

  const handleAddTranslation = (translation: TranslationFormData) => {
    onAddTranslation(translation);
    setShowAddDialog(false);
  };

  const handleOpenDialog = () => {
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Translations</h3>
        <Button variant="outline" size="sm" onClick={handleOpenDialog}>
          <Plus size={16} className="mr-2" />
          Add Translation
        </Button>
      </div>

      {/* Add Translation Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add New Translation</DialogTitle>
            <DialogDescription>
              Add a translation for this quote in another language
            </DialogDescription>
          </DialogHeader>
          <TranslationForm 
            onSubmit={handleAddTranslation}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {translations.map((translation) => (
          <Card key={translation.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {languageNames[translation.language] || translation.language.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1">
                  {getTranslatorIcon(translation.translatorType)}
                  <span className="text-xs text-muted-foreground">
                    {translation.translatorType === 'ai' && translation.aiModel 
                      ? `${translation.aiModel}`
                      : translation.translator || 'Anonymous'
                    }
                  </span>
                </div>
                {translation.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield size={10} className="mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {translation.qualityRating && (
                  <div className="flex items-center gap-0.5">
                    {getQualityStars(translation.qualityRating)}
                  </div>
                )}
                {translation.confidenceScore && (
                  <Badge 
                    variant={translation.confidenceScore > 0.8 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {Math.round(translation.confidenceScore * 100)}%
                  </Badge>
                )}
                {canVerify && !translation.verified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVerifyTranslation(translation.id)}
                  >
                    <Shield size={14} className="mr-1" />
                    Verify
                  </Button>
                )}
              </div>
            </div>

            <p className="text-sm italic mb-2">"{translation.text}"</p>
            
            {/* Additional metadata */}
            <div className="space-y-1 mt-3">
              {translation.publication && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Publication:</span> {translation.publication}
                  {translation.publicationDate && ` (${translation.publicationDate})`}
                </p>
              )}
              
              {translation.source && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Source:</span> {translation.source}
                </p>
              )}

              {translation.sourceUrl && (
                <a 
                  href={translation.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={10} />
                  View source
                </a>
              )}

              {translation.imageUrl && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Image size={10} />
                  <span>Evidence image attached</span>
                </div>
              )}
            </div>

            {translation.translationType === 'ai' && translation.confidenceScore && translation.confidenceScore < 0.7 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                <AlertCircle size={12} />
                <span>AI translation - verify for accuracy</span>
              </div>
            )}
          </Card>
        ))}

        {translations.length === 0 && (
          <Card className="p-6 text-center text-muted-foreground">
            <p>No translations available yet.</p>
            <p className="text-xs mt-1">Add a translation to make this quote accessible in other languages.</p>
          </Card>
        )}
      </div>
    </div>
  );
}