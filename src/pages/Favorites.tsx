
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import QuoteCard from '../components/QuoteCard';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const { favorites } = useFavorites();
  
  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-10"
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

        {favorites.length === 0 ? (
          <div className="bg-secondary/50 text-center py-16 px-6 rounded-2xl mt-8 border border-border">
            <Heart size={40} className="mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              When you find quotes you love, click the heart icon to add them to your favorites collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {favorites.map((quote, index) => (
              <QuoteCard key={quote.id} quote={quote} delay={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
