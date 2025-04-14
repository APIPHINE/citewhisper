
import { useState } from 'react';
import { Heart, Share2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Quote } from '../../utils/quotesData';
import { useFormatDate } from '../../hooks/use-format-date';
import { useToast } from '@/hooks/use-toast';

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
  
  // Early return if expanded
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
        {/* Share Count Badge */}
        {quote.shareCount && quote.shareCount > 0 && (
          <div 
            onClick={() => toggleExpanded(true)}
            className="absolute top-2 right-2 z-10 cursor-pointer"
          >
            <div className="flex items-center justify-center h-8 w-8 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition-colors">
              {quote.shareCount}
            </div>
          </div>
        )}
        
        {/* Quote Text */}
        <p className="text-balance text-lg leading-relaxed mb-4 relative">
          <span className="absolute -left-1 -top-3 text-4xl text-accent font-serif opacity-30">"</span>
          {quote.text}
          <span className="absolute -bottom-6 -right-1 text-4xl text-accent font-serif opacity-30">"</span>
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
            
            {/* Share button (replacing copy button) */}
            <button
              onClick={handleShare}
              className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              aria-label="Share this quote"
            >
              <Share2 size={20} />
            </button>
            
            {/* Expand button */}
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
