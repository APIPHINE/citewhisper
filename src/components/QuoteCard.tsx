
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { Quote } from '../utils/quotesData';
import { useToast } from '@/hooks/use-toast';
import { ProtectedButton } from './auth/ProtectedButton';
import { PermissionWrapper } from './auth/PermissionWrapper';
import { QuoteCardMain } from './quote/QuoteCardMain';
import { ExpandedQuoteCard } from './quote/ExpandedQuoteCard';
import { incrementShareCount } from '@/services/quoteService';

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
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [shareCount, setShareCount] = useState(quote.shareCount || 0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const favorite = isFavorite(quote.id);

  // Handle copying to clipboard and increment share count
  const handleShare = async () => {
    setShowEmbedCode(true);
    setShareCount(prev => prev + 1);
    
    // Update share count in Supabase
    await incrementShareCount(quote.id);
    
    toggleExpanded();
  };
  
  // Toggle favorite status and update count
  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(quote.id);
      setFavoriteCount(prev => prev - 1);
      toast({
        title: "Removed from favorites",
        description: "The quote has been removed from your favorites.",
      });
    } else {
      addFavorite(quote);
      setFavoriteCount(prev => prev + 1);
      toast({
        title: "Added to favorites",
        description: "The quote has been added to your favorites.",
      });
    }
  };

  // Toggle expanded status
  const toggleExpanded = (scrollToCitedBy = false) => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
    // Reset embed code visibility when closing the expanded view
    if (!newExpandedState) {
      setShowEmbedCode(false);
    }
    
    // Notify parent component about expansion state
    if (onExpand) {
      onExpand(newExpandedState);
    }
    
    // If requested, scroll to the cited-by section after expansion
    if (newExpandedState && scrollToCitedBy) {
      setTimeout(() => {
        const citedBySection = document.getElementById(`cited-by-section-${quote.id}`);
        if (citedBySection) {
          citedBySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <>
      <QuoteCardMain
        quote={quote}
        delay={delay}
        isAnyExpanded={isAnyExpanded}
        expanded={expanded}
        favorite={favorite}
        toggleFavorite={toggleFavorite}
        handleShare={handleShare}
        toggleExpanded={toggleExpanded}
        shareCount={shareCount}
        favoriteCount={favoriteCount}
      />
      
      <AnimatePresence>
        <ExpandedQuoteCard
          quote={quote}
          expanded={expanded}
          toggleExpanded={toggleExpanded}
          favorite={favorite}
          toggleFavorite={toggleFavorite}
          showEmbedCode={showEmbedCode}
          shareCount={shareCount}
          favoriteCount={favoriteCount}
          copyEmbedCode={() => {
            navigator.clipboard.writeText(`<iframe 
  src="https://citequotes.com/embed/quote/${quote.id}?style=standard&color=light&size=medium" 
  width="450" 
  height="240" 
  frameborder="0"
  title="Quote by ${quote.author}"
></iframe>
<a href="https://citequotes.com/quotes/${quote.id}" target="_blank" rel="noopener noreferrer" style="display: block; margin-top: 4px; font-size: 12px; color: #666;">View on CiteQuotes</a>`);
            
            toast({
              title: "Embed code copied",
              description: "The embed code has been copied to your clipboard.",
            });
          }}
        />
      </AnimatePresence>
    </>
  );
};

export default QuoteCard;
