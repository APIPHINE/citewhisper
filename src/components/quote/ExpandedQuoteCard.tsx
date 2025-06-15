
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from '../../utils/quotesData';
import { EmbedStyle, EmbedColor, EmbedSize } from '@/types/embed';
import { VerificationIndicator } from './expanded/VerificationIndicator';
import { ExpandedQuoteHeader } from './expanded/ExpandedQuoteHeader';
import { ExpandedQuoteContent } from './expanded/ExpandedQuoteContent';
import { EditModeContent } from './expanded/EditModeContent';

interface ExpandedQuoteCardProps {
  quote: Quote;
  expanded: boolean;
  toggleExpanded: () => void;
  favorite: boolean;
  toggleFavorite: () => void;
  showEmbedCode: boolean;
  shareCount: number;
  favoriteCount: number;
  copyEmbedCode: () => void;
  editMode?: boolean;
  onEditToggle?: () => void;
  onQuoteUpdate?: (updatedQuote: Quote) => void;
}

export function ExpandedQuoteCard({
  quote,
  expanded,
  toggleExpanded,
  favorite,
  toggleFavorite,
  showEmbedCode,
  shareCount,
  favoriteCount,
  copyEmbedCode,
  editMode = false,
  onEditToggle,
  onQuoteUpdate
}: ExpandedQuoteCardProps) {
  if (!expanded) return null;

  // Check if quote is verified (has evidenceImage)
  const isVerified = Boolean(quote.evidenceImage);
  
  const handleSaveEdit = (updatedQuote: Quote) => {
    if (onQuoteUpdate) {
      onQuoteUpdate(updatedQuote);
    }
    if (onEditToggle) {
      onEditToggle();
    }
  };

  const handleCancelEdit = () => {
    if (onEditToggle) {
      onEditToggle();
    }
  };
  
  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
          onClick={() => editMode ? undefined : toggleExpanded()}
        >
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.95,
              borderRadius: "1rem",
              border: "2px solid transparent",
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              borderRadius: "1rem",
              border: "2px solid hsl(var(--accent))",
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              borderRadius: "1rem",
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-white rounded-2xl shadow-elevation max-w-5xl w-full max-h-[90vh] overflow-hidden z-[100]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Verification Status Indicator */}
            <VerificationIndicator isVerified={isVerified} />

            {/* Expanded Card Header */}
            <ExpandedQuoteHeader 
              quote={quote} 
              toggleExpanded={toggleExpanded}
              editMode={editMode}
              onEditToggle={onEditToggle}
            />
            
            {/* Main Content - Switch between view and edit modes */}
            {editMode ? (
              <EditModeContent
                quote={quote}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <ExpandedQuoteContent
                quote={quote}
                toggleFavorite={toggleFavorite}
                favorite={favorite}
                shareCount={shareCount}
                favoriteCount={favoriteCount}
                showEmbedCode={showEmbedCode}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
