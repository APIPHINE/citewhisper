
import { useState } from 'react';
import { Heart, Copy, Check, ChevronDown, ExternalLink, X, BookOpen, FileText, Fingerprint, GitBranch, Tags, Award, FileDown, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '../context/FavoritesContext';
import { Quote } from '../utils/quotesData';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const favorite = isFavorite(quote.id);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
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
  const toggleExpanded = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
    // Notify parent component about expansion state
    if (onExpand) {
      onExpand(newExpandedState);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Render the main card (only when not expanded)
  const renderMainCard = () => {
    if (expanded) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1,
          y: 0 
        }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.1, 0.25, 1],
          delay: delay * 0.08 
        }}
        className={`group relative ${isAnyExpanded && !expanded ? 'hidden' : ''}`}
        style={{ height: 'fit-content' }} 
      >
        <div 
          className="rounded-2xl transition-all duration-350 ease-apple 
            border-border/80 hover:border-accent/50 bg-white p-6 shadow-subtle hover:shadow-elevation border-2
            overflow-hidden h-full relative"
        >
          {/* Author Avatar (new addition) */}
          {quote.avatar && (
            <div className="absolute top-2 right-2 z-10">
              <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                <AvatarImage src={quote.avatar} alt={quote.author} />
                <AvatarFallback>{getInitials(quote.author)}</AvatarFallback>
              </Avatar>
            </div>
          )}
          
          {/* Quote Text */}
          <p className="text-balance text-lg leading-relaxed mb-4 relative">
            <span className="absolute -left-1 -top-3 text-4xl text-accent font-serif opacity-30">"</span>
            {quote.text}
            <span className="absolute -bottom-6 -right-1 text-4xl text-accent font-serif opacity-30">"</span>
          </p>
          
          {/* Quote Meta */}
          <div className="mt-6 flex items-start justify-between">
            <div>
              <p className="font-medium text-foreground">{quote.author}</p>
              <p className="text-sm text-muted-foreground">{formatDate(quote.date)}</p>
              
              {/* Source - New Addition */}
              {quote.source && (
                <p className="text-sm text-muted-foreground mt-1 italic">
                  Source: {quote.source}
                </p>
              )}
              
              {/* Topics & Theme */}
              <div className="mt-3 flex flex-wrap gap-2">
                {quote.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="bg-secondary/80">
                    {topic}
                  </Badge>
                ))}
                <Badge variant="outline" className="border-accent/30 text-accent">
                  {quote.theme}
                </Badge>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-2">
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
              
              <button
                onClick={handleCopy}
                className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check size={20} className="text-accent" /> : <Copy size={20} />}
              </button>
              
              {/* Expand button */}
              <button
                onClick={toggleExpanded}
                className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label="Expand quote details"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Section box component for expanded view
  const SectionBox = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="mb-6 border border-border rounded-lg overflow-hidden">
      <div className="bg-secondary/30 px-4 py-3 flex items-center border-b border-border/80">
        <div className="mr-2 text-muted-foreground">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );

  return (
    <>
      {/* Main card */}
      {renderMainCard()}
      
      {/* Expanded Overlay - Completely separate component */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
            onClick={toggleExpanded}
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
              {/* Expanded Card Header with close button */}
              <div className="flex justify-between items-start border-b border-border p-6">
                <div className="flex items-center gap-4">
                  {/* Add avatar to expanded view header */}
                  {quote.avatar && (
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarImage src={quote.avatar} alt={quote.author} />
                      <AvatarFallback>{getInitials(quote.author)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{quote.author}</h2>
                    <p className="text-muted-foreground">{formatDate(quote.date)}</p>
                  </div>
                </div>
                
                <button 
                  onClick={toggleExpanded}
                  className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                  aria-label="Close expanded view"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
                {/* Quote Text */}
                <div className="mb-8">
                  <p className="text-balance text-xl leading-relaxed font-medium mb-2 relative">
                    <span className="absolute -left-1 -top-3 text-4xl text-accent font-serif opacity-30">"</span>
                    {quote.text}
                    <span className="absolute -bottom-6 -right-1 text-4xl text-accent font-serif opacity-30">"</span>
                  </p>
                </div>
                
                {/* Source Section */}
                <SectionBox title="Source Information" icon={<BookOpen size={18} />}>
                  <div className="space-y-3">
                    {/* Original language */}
                    {quote.originalLanguage && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Original Language: {quote.originalLanguage}</h4>
                        {quote.originalText && <p className="italic text-muted-foreground">{quote.originalText}</p>}
                      </div>
                    )}
                    
                    {/* Source details */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Source</h4>
                      <p className="text-muted-foreground">{quote.source || "Unknown source"}</p>
                      <p className="text-xs text-muted-foreground mt-1">Publication date: {quote.sourcePublicationDate || "Unknown"}</p>
                      
                      {quote.sourceUrl && (
                        <a 
                          href={quote.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-accent hover:underline text-sm"
                        >
                          View original source <ExternalLink size={14} className="ml-1" />
                        </a>
                      )}
                    </div>
                    
                    {/* Manuscript reference */}
                    {quote.originalManuscriptReference && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Original Manuscript</h4>
                        <p className="text-muted-foreground text-sm">{quote.originalManuscriptReference}</p>
                      </div>
                    )}
                    
                    {/* Attribution status */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Attribution</h4>
                      <Badge variant={quote.attributionStatus === "Confirmed" ? "outline" : "secondary"} className="bg-secondary/80">
                        {quote.attributionStatus || "Unknown"}
                      </Badge>
                      {quote.translator && (
                        <p className="text-xs text-muted-foreground mt-2">Translator: {quote.translator}</p>
                      )}
                    </div>
                  </div>
                </SectionBox>
                
                {/* Context Section */}
                <SectionBox title="Historical Context" icon={<FileText size={18} />}>
                  <div className="space-y-4">
                    {/* Quote Context */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Quote Context</h4>
                      <p className="text-muted-foreground">{quote.context || "No additional context available."}</p>
                    </div>
                    
                    {/* Historical Context */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Historical Significance</h4>
                      <p className="text-muted-foreground">{quote.historicalContext || "No historical context available."}</p>
                    </div>
                    
                    {/* Impact */}
                    {quote.impact && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Impact</h4>
                        <p className="text-muted-foreground">{quote.impact}</p>
                      </div>
                    )}
                  </div>
                </SectionBox>
                
                {/* Verification Section */}
                <SectionBox title="Source Verification" icon={<Fingerprint size={18} />}>
                  <div className="space-y-4">
                    {/* OCR Information */}
                    {quote.ocrExtractedText && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">OCR Extraction</h4>
                        <p className="text-muted-foreground text-sm">{quote.ocrExtractedText}</p>
                        <p className="text-xs text-muted-foreground mt-1">Confidence Score: {quote.ocrConfidenceScore ? `${(quote.ocrConfidenceScore * 100).toFixed(1)}%` : "Unknown"}</p>
                      </div>
                    )}
                    
                    {/* Citation Chain */}
                    {quote.citationChain && quote.citationChain.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Citation Chain</h4>
                        <div className="space-y-2">
                          {quote.citationChain.map((citation, index) => (
                            <div key={index} className="text-sm">
                              <Badge variant="outline" className="mr-2">{citation.type}</Badge>
                              <span className="text-muted-foreground">{citation.source}, {citation.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* IIIF & Screenshot */}
                    {quote.iiifImageUrl && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Digital Archives</h4>
                        <p className="text-xs text-muted-foreground">IIIF Manifest Available</p>
                        <p className="text-xs text-muted-foreground">Image Coordinates: {JSON.stringify(quote.imageCoordinates)}</p>
                      </div>
                    )}
                  </div>
                </SectionBox>
                
                {/* Related Content Section */}
                <SectionBox title="Related Content" icon={<GitBranch size={18} />}>
                  {/* Alternative Versions */}
                  {quote.variations && quote.variations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-1">Alternative Versions</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {quote.variations.map((variation, index) => (
                          <li key={index}>{variation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Cross-Referenced Quotes */}
                  {quote.crossReferencedQuotes && quote.crossReferencedQuotes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Related Quotes</h4>
                      <div className="space-y-2">
                        {quote.crossReferencedQuotes.map((relatedQuote, index) => (
                          <div key={index} className="text-sm border-l-2 border-accent/30 pl-3 py-1">
                            <p className="italic">"{relatedQuote.text}"</p>
                            <p className="text-xs text-muted-foreground">— {relatedQuote.author}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </SectionBox>
                
                {/* Tags Section */}
                <SectionBox title="Tags & Categories" icon={<Tags size={18} />}>
                  <div className="space-y-3">
                    {/* Topics */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {quote.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="bg-secondary/80">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Theme */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Theme</h4>
                      <Badge variant="outline" className="border-accent/30 text-accent">
                        {quote.theme}
                      </Badge>
                    </div>
                    
                    {/* Keywords */}
                    {quote.keywords && quote.keywords.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {quote.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="bg-secondary/50">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionBox>
                
                {/* Citation Section */}
                <SectionBox title="Citation Formats" icon={<Award size={18} />}>
                  <div className="space-y-3">
                    {/* APA */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">APA</h4>
                      <p className="text-sm text-muted-foreground">{quote.citationAPA}</p>
                    </div>
                    
                    {/* MLA */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">MLA</h4>
                      <p className="text-sm text-muted-foreground">{quote.citationMLA}</p>
                    </div>
                    
                    {/* Chicago */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Chicago</h4>
                      <p className="text-sm text-muted-foreground">{quote.citationChicago}</p>
                    </div>
                  </div>
                </SectionBox>
                
                {/* Export Section */}
                {quote.exportFormats && Object.values(quote.exportFormats).some(val => val) && (
                  <SectionBox title="Export Options" icon={<FileDown size={18} />}>
                    <div className="flex flex-wrap gap-2">
                      {quote.exportFormats.json && (
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/30">JSON</Badge>
                      )}
                      {quote.exportFormats.csv && (
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/30">CSV</Badge>
                      )}
                      {quote.exportFormats.cff && (
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/30">CFF</Badge>
                      )}
                    </div>
                  </SectionBox>
                )}
                
                {/* Actions */}
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
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
                  
                  <button
                    onClick={handleCopy}
                    className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                    aria-label="Copy to clipboard"
                  >
                    {copied ? <Check size={20} className="text-accent" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuoteCard;
