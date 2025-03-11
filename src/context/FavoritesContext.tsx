
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quote } from '../utils/quotesData';

interface FavoritesContextType {
  favorites: Quote[];
  addFavorite: (quote: Quote) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Quote[]>(() => {
    // Load favorites from localStorage on initialization
    const savedFavorites = localStorage.getItem('citeQuotes-favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('citeQuotes-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (quote: Quote) => {
    setFavorites((prev) => {
      if (prev.some((q) => q.id === quote.id)) return prev;
      return [...prev, quote];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((quote) => quote.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((quote) => quote.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
