
import { Heart, Share2, ChevronDown, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useEffect } from 'react';

interface ActionButtonsProps {
  favorite: boolean;
  toggleFavorite: () => void;
  handleShare: () => void;
  toggleExpanded: (scrollToCitedBy?: boolean) => void;
  isAdmin?: boolean;
}

export function ActionButtons({ 
  favorite, 
  toggleFavorite, 
  handleShare, 
  toggleExpanded,
  isAdmin = false
}: ActionButtonsProps) {
  const { user } = useAuth();
  const { userRole, loadRole } = useUserRoles();

  useEffect(() => {
    if (user?.id) {
      loadRole(user.id);
    }
  }, [user?.id, loadRole]);

  const isSuperAdmin = userRole === 'super_admin';

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExpanded(); // This will open the expanded view, and the edit button in the header will handle edit mode
  };

  return (
    <div className="flex flex-col gap-3 mt-1">
      {isSuperAdmin && (
        <button
          onClick={handleEditClick}
          className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
          aria-label="Edit quote"
        >
          <Edit size={20} />
        </button>
      )}
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
