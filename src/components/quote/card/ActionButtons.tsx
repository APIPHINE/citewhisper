
import { Heart, Share2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionButtonsProps {
  favorite: boolean;
  toggleFavorite: () => void;
  handleShare: () => void;
  toggleExpanded: (scrollToCitedBy?: boolean) => void;
}

export function ActionButtons({ 
  favorite, 
  toggleFavorite, 
  handleShare, 
  toggleExpanded 
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3 mt-1">
      {/* Favorite Button */}
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
      
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
        aria-label="Share this quote"
      >
        <Share2 size={20} />
      </button>
      
      {/* Expand Button */}
      <motion.button
        onClick={() => toggleExpanded()}
        className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
        aria-label="Expand quote details"
        whileTap={{ scale: 0.95 }}
      >
        <ChevronDown size={20} />
      </motion.button>
    </div>
  );
}
