
import { Heart, Share2 } from 'lucide-react';
import { VisualQuoteDialog } from '../VisualQuoteDialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface QuoteActionsProps {
  handleShareClick: () => void;
  toggleFavorite: () => void;
  favorite: boolean;
  shareCount: number;
  favoriteCount: number;
  quoteId: string;
}

export function QuoteActions({ 
  handleShareClick, 
  toggleFavorite, 
  favorite, 
  shareCount, 
  favoriteCount,
  quoteId
}: QuoteActionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFavoriteClick = () => {
    if (!user) {
      toast({
        title: "Log In to add to favourites",
        description: "Please sign in to save quotes to your favorites.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    toggleFavorite();
  };

  return (
    <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-border">
      <VisualQuoteDialog quoteId={quoteId} />
      
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
          onClick={handleFavoriteClick}
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
