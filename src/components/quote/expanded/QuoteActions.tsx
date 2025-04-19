
import { Heart, Share2 } from 'lucide-react';

interface QuoteActionsProps {
  handleShareClick: () => void;
  toggleFavorite: () => void;
  favorite: boolean;
  shareCount: number;
  favoriteCount: number;
}

export function QuoteActions({ 
  handleShareClick, 
  toggleFavorite, 
  favorite, 
  shareCount, 
  favoriteCount 
}: QuoteActionsProps) {
  return (
    <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-border">
      <div className="flex items-center gap-2">
        <button
          onClick={handleShareClick}
          className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
          aria-label="Share this quote"
        >
          <Share2 size={20} />
        </button>
        <span className="text-sm text-muted-foreground">
          {shareCount}
        </span>
      </div>
    
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
          {favoriteCount}
        </span>
      </div>
    </div>
  );
}
