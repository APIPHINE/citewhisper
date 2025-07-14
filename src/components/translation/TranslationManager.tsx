import { useState } from 'react';
import { Plus, Bot, User, Shield, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TranslationForm } from './TranslationForm';

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
}

interface TranslationManagerProps {
  translations: Translation[];
  quoteId: string;
  onAddTranslation: (translation: Omit<Translation, 'id'>) => void;
  onVerifyTranslation: (translationId: string) => void;
  canVerify?: boolean;
}

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
      case 'community': return <User size={14} className="text-secondary" />;
      default: return <User size={14} className="text-foreground" />;
    }
  };

  const getQualityStars = (rating?: number) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  const handleAddTranslation = (translation: Omit<Translation, 'id'>) => {
    onAddTranslation(translation);
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Translations</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus size={16} className="mr-2" />
              Add Translation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Translation</DialogTitle>
            </DialogHeader>
            <TranslationForm 
              onSubmit={handleAddTranslation}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {translations.map((translation) => (
          <Card key={translation.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {translation.language.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1">
                  {getTranslatorIcon(translation.translatorType)}
                  <span className="text-xs text-muted-foreground">
                    {translation.translatorType === 'ai' && translation.aiModel 
                      ? `${translation.aiModel} Translation`
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
                  <div className="flex items-center gap-1">
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
            
            {translation.source && (
              <p className="text-xs text-muted-foreground">
                Source: {translation.source}
              </p>
            )}

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