
import { useState, useEffect } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { useAccessControl } from '@/hooks/useAccessControl';
import QuoteCard from '../components/QuoteCard';
import { Heart } from 'lucide-react';
import { FavoriteQuotesCarousel } from '../components/quote/favorites/FavoriteQuotesCarousel';
import { FavoriteQuoteActions } from '../components/quote/favorites/FavoriteQuoteActions';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';

const Favorites = () => {
  // Check access immediately - this will redirect if not authenticated
  const { checkAccess } = useAccessControl();
  
  React.useEffect(() => {
    checkAccess('view your favorites');
  }, [checkAccess]);

  const { favorites } = useFavorites();
  const [anyExpanded, setAnyExpanded] = useState(false);

  const { user } = useAuth();
  const { userRole, loadRole } = useUserRoles();

  useEffect(() => {
    if (user?.id) {
      loadRole(user.id);
    }
  }, [user?.id, loadRole]);

  const isAdmin = ['admin', 'super_admin'].includes(userRole);
  
  const handleExpand = (isExpanded: boolean) => {
    setAnyExpanded(isExpanded);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: anyExpanded ? 0 : 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={anyExpanded ? 'hidden' : 'text-center mb-10'}
        >
          <div className="inline-flex items-center justify-center mb-3 bg-secondary/80 text-foreground px-3 py-1.5 rounded-full text-sm">
            <Heart size={14} className="mr-1.5" />
            Your Favorites
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Favorite Quotes</h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Your personally curated collection of favorite quotes that inspire and resonate with you.
          </p>
        </motion.div>

        {/* Favorites Carousel */}
        {favorites.length > 0 && <FavoriteQuotesCarousel quotes={favorites} />}

        {/* Quote Actions for Selection and Sharing */}
        {favorites.length > 0 && <FavoriteQuoteActions quotes={favorites} />}

        {favorites.length === 0 ? (
          <div className={anyExpanded ? 'hidden' : 'bg-secondary/50 text-center py-16 px-6 rounded-2xl mt-8 border border-border'}>
            <Heart size={40} className="mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              When you find quotes you love, click the heart icon to add them to your favorites collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {favorites.map((quote, index) => (
              <QuoteCard 
                key={quote.id} 
                quote={quote} 
                delay={index} 
                isAnyExpanded={anyExpanded}
                onExpand={handleExpand}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
