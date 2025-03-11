
import { useState, useEffect } from 'react';
import { Heart, Copy, Check, ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '../context/FavoritesContext';
import { Quote } from '../utils/quotesData';
import { useToast } from '@/hooks/use-toast';

interface QuoteCardProps {
  quote: Quote;
  delay?: number;
  isAnyExpanded?: boolean;
  onExpand?: (expanded: boolean) => void;
}

const QuoteCard = ({ quote, delay = 0, isAnyExpanded = false, onExpand }: QuoteCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const favorite = isFavorite(quote.id);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Handle copying to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The quote has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Toggle favorite status
  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(quote.id);
      toast({
        title: "Removed from favorites",
        description: "The quote has been removed from your favorites.",
      });
    } else {
      addFavorite(quote);
      toast({
        title: "Added to favorites",
        description: "The quote has been added to your favorites.",
      });
    }
  };

  // Toggle expanded status
  const toggleExpanded = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
    // Notify parent component about expansion state
    if (onExpand) {
      onExpand(newExpandedState);
    }
    
    // Prevent body scrolling when expanded
    if (!expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isAnyExpanded && !expanded ? 0 : 1, 
        y: 0,
        transition: { 
          duration: 0.5, 
          ease: [0.25, 0.1, 0.25, 1],
        }
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: delay * 0.08 
      }}
      className={`group relative z-10 ${isAnyExpanded && !expanded ? 'pointer-events-none opacity-0' : ''}`}
      style={{ minHeight: '280px' }} // Ensure minimum height for all cards
    >
      {/* Main Card */}
      <div 
        className={`rounded-2xl transition-all duration-350 ease-apple 
          ${expanded ? 'border-accent shadow-elevation border-2' : 'border-border/80 hover:border-accent/50 bg-white p-6 shadow-subtle hover:shadow-elevation border-2'}
          overflow-hidden`}
        style={{ minHeight: expanded ? 'auto' : '100%' }}
      >
        {!expanded && (
          <>
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
                
                <button
                  onClick={handleCopy}
                  className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                  aria-label="Copy to clipboard"
                >
                  {copied ? <Check size={20} className="text-accent" /> : <Copy size={20} />}
                </button>
                
                {/* Expand button */}
                <button
                  onClick={toggleExpanded}
                  className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                  aria-label="Expand quote details"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Expanded Overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
            onClick={toggleExpanded}
          >
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.95,
                borderRadius: "1rem",
                border: "2px solid transparent",
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                borderRadius: "1rem",
                border: "2px solid hsl(var(--accent))",
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                borderRadius: "1rem",
              }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-elevation max-w-3xl w-full max-h-[90vh] overflow-hidden z-[100]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Expanded Card Header with close button */}
              <div className="flex justify-between items-start border-b border-border p-6">
                <div>
                  <h2 className="text-2xl font-bold">{quote.author}</h2>
                  <p className="text-muted-foreground">{formatDate(quote.date)}</p>
                </div>
                
                <button 
                  onClick={toggleExpanded}
                  className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                  aria-label="Close expanded view"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
                {/* Quote Text */}
                <div className="mb-8">
                  <p className="text-balance text-xl leading-relaxed font-medium mb-2 relative">
                    <span className="absolute -left-1 -top-3 text-4xl text-accent font-serif opacity-30">"</span>
                    {quote.text}
                    <span className="absolute -bottom-6 -right-1 text-4xl text-accent font-serif opacity-30">"</span>
                  </p>
                </div>
                
                {/* Original language section */}
                {quote.originalLanguage && (
                  <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-2">Original Quote ({quote.originalLanguage})</h3>
                    <p className="italic">{quote.originalText || quote.text}</p>
                  </div>
                )}
                
                {/* Source section */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Source</h3>
                  <p className="text-muted-foreground">{quote.source || "Unknown source"}</p>
                  {quote.sourceUrl && (
                    <a 
                      href={quote.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-accent hover:underline"
                    >
                      View original source <ExternalLink size={14} className="ml-1" />
                    </a>
                  )}
                </div>
                
                {/* Context section */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Quote Context</h3>
                  <p className="text-muted-foreground">{quote.context || "No additional context available."}</p>
                </div>
                
                {/* Historical/Social Context */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Historical Context</h3>
                  <p className="text-muted-foreground">{quote.historicalContext || "No historical context available."}</p>
                </div>
                
                {/* Tags section */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
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
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
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
                  
                  <button
                    onClick={handleCopy}
                    className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                    aria-label="Copy to clipboard"
                  >
                    {copied ? <Check size={20} className="text-accent" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuoteCard;
