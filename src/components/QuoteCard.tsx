
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { Quote } from '../utils/quotesData';
import { useToast } from '@/hooks/use-toast';
import { QuoteCardMain } from './quote/QuoteCardMain';
import { ExpandedQuoteCard } from './quote/ExpandedQuoteCard';

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
  const favorite = isFavorite(quote.id);
  
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
  const toggleExpanded = (scrollToCitedBy = false) => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
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
  
  // Handle share button click
  const handleShare = () => {
    setShowEmbedCode(true);
    toggleExpanded();
  };
  
  // Copy embed code to clipboard
  const copyEmbedCode = () => {
    const embedCode = `<iframe 
  src="https://yourapp.com/embed/quote/${quote.id}" 
  width="450" 
  height="200" 
  frameborder="0"
  title="Quote by ${quote.author}"
></iframe>`;
    
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed code copied",
      description: "The embed code has been copied to your clipboard.",
    });
  };

  return (
    <>
      {/* Main card */}
      <QuoteCardMain
        quote={quote}
        delay={delay}
        isAnyExpanded={isAnyExpanded}
        expanded={expanded}
        favorite={favorite}
        toggleFavorite={toggleFavorite}
        handleShare={handleShare}
        toggleExpanded={toggleExpanded}
      />
      
      {/* Expanded Overlay */}
      <AnimatePresence>
        <ExpandedQuoteCard
          quote={quote}
          expanded={expanded}
          toggleExpanded={toggleExpanded}
          favorite={favorite}
          toggleFavorite={toggleFavorite}
          showEmbedCode={showEmbedCode}
          copyEmbedCode={copyEmbedCode}
        />
      </AnimatePresence>
    </>
  );
};

export default QuoteCard;
