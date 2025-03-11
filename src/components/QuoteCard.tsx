
import { useState } from 'react';
import { Heart, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '../context/FavoritesContext';
import { Quote } from '../utils/quotesData';
import { useToast } from '@/hooks/use-toast';

interface QuoteCardProps {
  quote: Quote;
  delay?: number;
}

const QuoteCard = ({ quote, delay = 0 }: QuoteCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: delay * 0.08 
      }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-subtle transition-all duration-350 ease-apple hover:shadow-elevation"
    >
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
        </div>
      </div>
    </motion.div>
  );
};

export default QuoteCard;
