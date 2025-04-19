import { useState } from 'react';
import { Heart, Share2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Quote } from '../../utils/quotesData';
import { useFormatDate } from '../../hooks/use-format-date';
import { EmbedCodeSection, EmbedStyle, EmbedColor, EmbedSize } from './EmbedCodeSection';
import { SourceSection } from './SourceSection';
import { ContextSection } from './ContextSection';
import { VerificationSection } from './VerificationSection';
import { RelatedContentSection } from './RelatedContentSection';
import { TagsSection } from './TagsSection';
import { CitationSection } from './CitationSection';
import { ExportSection } from './ExportSection';
import { CitedBySection } from './CitedBySection';

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
  copyEmbedCode
}: ExpandedQuoteCardProps) {
  const { formatDate } = useFormatDate();
  const [showEmbedSection, setShowEmbedSection] = useState(showEmbedCode);
  const [embedStyle, setEmbedStyle] = useState<EmbedStyle>('standard');
  const [embedColor, setEmbedColor] = useState<EmbedColor>('light');
  const [embedSize, setEmbedSize] = useState<EmbedSize>('medium');
  
  const handleShareClick = () => {
    setShowEmbedSection(!showEmbedSection);
  };
  
  if (!expanded) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
      onClick={() => toggleExpanded()}
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
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-elevation max-w-3xl w-full max-h-[90vh] overflow-hidden z-[100]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Expanded Card Header */}
        <div className="flex justify-between items-start border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold">{quote.author}</h2>
            <p className="text-muted-foreground">{formatDate(quote.date)}</p>
          </div>
          
          <button 
            onClick={() => toggleExpanded()}
            className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
            aria-label="Close expanded view"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
          {/* Quote Text */}
          <div className="mb-8">
            <p className="text-balance text-xl leading-relaxed font-medium mb-2">
              "{quote.text}"
            </p>
            <div className="mt-8 text-sm text-muted-foreground">
              <p>Source: {quote.source}</p>
            </div>
          </div>
          
          {/* Share/Embed Button */}
          <div className="mb-4">
            <button
              onClick={handleShareClick}
              className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              <Share2 size={16} />
              {showEmbedSection ? "Hide embed options" : "Embed this quote on your website"}
            </button>
          </div>
          
          {/* Embed Code Section */}
          {showEmbedSection && (
            <EmbedCodeSection
              quote={quote}
              embedStyle={embedStyle}
              setEmbedStyle={setEmbedStyle}
              embedColor={embedColor}
              setEmbedColor={setEmbedColor}
              embedSize={embedSize}
              setEmbedSize={setEmbedSize}
            />
          )}
          
          {/* Source Section */}
          <SourceSection quote={quote} />
          
          {/* Context Section */}
          <ContextSection quote={quote} />
          
          {/* Verification Section */}
          <VerificationSection quote={quote} />
          
          {/* Related Content Section */}
          <RelatedContentSection quote={quote} />
          
          {/* Tags Section */}
          <TagsSection quote={quote} />
          
          {/* Citation Section */}
          <CitationSection quote={quote} />
          
          {/* Export Section */}
          <ExportSection quote={quote} />
          
          {/* "Cited By" Section */}
          <CitedBySection quote={quote} />
          
          {/* Actions */}
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
        </div>
      </motion.div>
    </motion.div>
  );
}
