
import { useState } from 'react';
import { Heart, Share2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Quote } from '../../utils/quotesData';
import { useFormatDate } from '../../hooks/use-format-date';

interface QuoteCardMainProps {
  quote: Quote;
  delay: number;
  isAnyExpanded: boolean;
  expanded: boolean;
  favorite: boolean;
  toggleFavorite: () => void;
  handleShare: () => void;
  toggleExpanded: (scrollToCitedBy?: boolean) => void;
}

export function QuoteCardMain({
  quote,
  delay,
  isAnyExpanded,
  expanded,
  favorite,
  toggleFavorite,
  handleShare,
  toggleExpanded
}: QuoteCardMainProps) {
  const { formatDate } = useFormatDate();
  
  if (expanded) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1,
        y: 0 
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: delay * 0.08 
      }}
      className={`group relative ${isAnyExpanded && !expanded ? 'hidden' : ''}`}
      style={{ height: 'fit-content' }} 
    >
      <div 
        className="rounded-2xl transition-all duration-350 ease-apple 
          border-border/80 hover:border-accent/50 bg-white p-6 shadow-subtle hover:shadow-elevation border-2
          overflow-hidden h-full relative"
      >
        {/* Quote Text */}
        <p className="text-balance text-lg leading-relaxed mb-4">
          "{quote.text}"
        </p>
        
        {/* Quote Meta */}
        <div className="mt-6 flex items-start justify-between">
          <div>
            <p className="font-medium text-foreground">{quote.author}</p>
            <p className="text-sm text-muted-foreground">{formatDate(quote.date)}</p>
            
            {/* Source - New Addition */}
            {quote.source && (
              <p className="text-sm text-muted-foreground mt-1 italic">
                Source: {quote.source}
              </p>
            )}
            
            {/* Topics & Theme */}
            <div className="mt-3 flex flex-wrap gap-2">
              {quote.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="bg-secondary/80">
                  {topic}
                </Badge>
              ))}
              <Badge variant="outline" className="border-accent/30 text-accent">
                {quote.theme}
              </Badge>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  size={20} 
                  className={favorite ? "fill-accent text-accent" : "text-foreground"} 
                />
              </button>
              <span className="text-sm text-muted-foreground">
                {quote.shareCount ?? 0}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label="Share this quote"
              >
                <Share2 size={20} />
              </button>
              <span className="text-sm text-muted-foreground">
                {quote.shareCount ?? 0}
              </span>
            </div>
            
            <button
              onClick={() => toggleExpanded()}
              className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              aria-label="Expand quote details"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
