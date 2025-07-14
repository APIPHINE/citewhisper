import { Bot, User, Shield, Star, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TranslationIndicatorProps {
  translatorType?: 'human' | 'ai' | 'community';
  verified?: boolean;
  confidenceScore?: number;
  qualityRating?: number;
  aiModel?: string;
  translator?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TranslationIndicator({ 
  translatorType = 'human',
  verified = false,
  confidenceScore,
  qualityRating,
  aiModel,
  translator,
  size = 'md'
}: TranslationIndicatorProps) {
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  const getTranslatorInfo = () => {
    switch (translatorType) {
      case 'ai':
        return {
          icon: <Bot size={iconSize} className="text-primary" />,
          label: aiModel ? `${aiModel} Translation` : 'AI Translation',
          description: `Automatically translated using ${aiModel || 'AI'}`
        };
      case 'community':
        return {
          icon: <User size={iconSize} className="text-secondary" />,
          label: 'Community Translation',
          description: 'Translated by community members'
        };
      default:
        return {
          icon: <User size={iconSize} className="text-foreground" />,
          label: translator || 'Human Translation',
          description: `Translated by ${translator || 'human translator'}`
        };
    }
  };

  const translatorInfo = getTranslatorInfo();
  
  const getQualityBadge = () => {
    if (verified) {
      return (
        <Badge variant="secondary" className={`${size === 'sm' ? 'text-xs px-1' : 'text-xs'}`}>
          <Shield size={iconSize - 2} className="mr-1" />
          Verified
        </Badge>
      );
    }

    if (translatorType === 'ai' && confidenceScore && confidenceScore < 0.7) {
      return (
        <Badge variant="destructive" className={`${size === 'sm' ? 'text-xs px-1' : 'text-xs'}`}>
          <AlertTriangle size={iconSize - 2} className="mr-1" />
          Verify Needed
        </Badge>
      );
    }

    if (confidenceScore && confidenceScore > 0.8) {
      return (
        <Badge variant="default" className={`${size === 'sm' ? 'text-xs px-1' : 'text-xs'}`}>
          {Math.round(confidenceScore * 100)}% Confidence
        </Badge>
      );
    }

    return null;
  };

  const qualityStars = qualityRating ? Array.from({ length: 5 }, (_, i) => (
    <Star 
      key={i} 
      size={iconSize - 2} 
      className={i < qualityRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
    />
  )) : null;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              {translatorInfo.icon}
              <span className={`${textSize} text-muted-foreground`}>
                {size === 'sm' ? (
                  translatorType === 'ai' ? 'AI' : 'Human'
                ) : (
                  translatorInfo.label
                )}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{translatorInfo.description}</p>
          </TooltipContent>
        </Tooltip>

        {qualityStars && size !== 'sm' && (
          <div className="flex items-center gap-0.5">
            {qualityStars}
          </div>
        )}

        {getQualityBadge()}
      </div>
    </TooltipProvider>
  );
}