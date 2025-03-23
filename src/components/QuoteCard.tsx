import { useState } from 'react';
import { Heart, Copy, Check, ChevronDown, ExternalLink, X, BookOpen, FileText, Fingerprint, GitBranch, Tags, Award, FileDown, Link, Share2, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '../context/FavoritesContext';
import { Quote } from '../utils/quotesData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuoteCardProps {
  quote: Quote;
  delay?: number;
  isAnyExpanded?: boolean;
  onExpand?: (expanded: boolean) => void;
}

// Embed style types
type EmbedStyle = 'minimal' | 'standard' | 'elegant';
type EmbedColor = 'light' | 'dark' | 'accent';
type EmbedSize = 'small' | 'medium' | 'large';

const QuoteCard = ({ quote, delay = 0, isAnyExpanded = false, onExpand }: QuoteCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const favorite = isFavorite(quote.id);
  
  // Embed customization options
  const [embedStyle, setEmbedStyle] = useState<EmbedStyle>('standard');
  const [embedColor, setEmbedColor] = useState<EmbedColor>('light');
  const [embedSize, setEmbedSize] = useState<EmbedSize>('medium');
  
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
  const toggleExpanded = (scrollToCitedBy = false) => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
    // Notify parent component about expansion state
    if (onExpand) {
      onExpand(newExpandedState);
    }
    
    // If requested, scroll to the cited-by section after expansion
    if (newExpandedState && scrollToCitedBy) {
      setTimeout(() => {
        const citedBySection = document.getElementById(`cited-by-section-${quote.id}`);
        if (citedBySection) {
          citedBySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };
  
  // Handle share button click
  const handleShare = () => {
    setShowEmbedCode(true);
    toggleExpanded();
  };
  
  // Generate embed code for the quote with custom options
  const generateEmbedCode = () => {
    return `<iframe 
  src="https://yourapp.com/embed/quote/${quote.id}?style=${embedStyle}&color=${embedColor}&size=${embedSize}" 
  width="${embedSize === 'small' ? '300' : embedSize === 'medium' ? '450' : '600'}" 
  height="${embedSize === 'small' ? '150' : embedSize === 'medium' ? '200' : '250'}" 
  frameborder="0"
  title="Quote by ${quote.author}"
></iframe>`;
  };
  
  // Copy embed code to clipboard
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    toast({
      title: "Embed code copied",
      description: "The embed code has been copied to your clipboard.",
    });
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
          {/* Share Count Badge */}
          {quote.shareCount && quote.shareCount > 0 && (
            <div 
              onClick={() => toggleExpanded(true)}
              className="absolute top-2 right-2 z-10 cursor-pointer"
            >
              <div className="flex items-center justify-center h-8 w-8 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition-colors">
                {quote.shareCount}
              </div>
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
              
              {/* Share button (replacing copy button) */}
              <button
                onClick={handleShare}
                className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label="Share this quote"
              >
                <Share2 size={20} />
              </button>
              
              {/* Expand button */}
              <button
                onClick={() => toggleExpanded()}
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
  const SectionBox = ({ title, icon, children, id }: { title: string; icon: React.ReactNode; children: React.ReactNode; id?: string }) => (
    <div className="mb-6 border border-border rounded-lg overflow-hidden" id={id}>
      <div className="bg-secondary/30 px-4 py-3 flex items-center border-b border-border/80">
        <div className="mr-2 text-muted-foreground">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );

  // Render embed preview based on selected options
  const renderEmbedPreview = () => {
    let previewClasses = "p-4 border rounded-lg mt-4 mb-6 relative";
    let textSize = "text-base";
    let padding = "p-4";
    
    // Apply style variations
    if (embedStyle === 'minimal') {
      previewClasses += " border-dashed";
      padding = "p-3";
    } else if (embedStyle === 'elegant') {
      previewClasses += " shadow-md";
      padding = "p-5";
    }
    
    // Apply color variations
    if (embedColor === 'dark') {
      previewClasses += " bg-slate-800 text-white";
    } else if (embedColor === 'accent') {
      previewClasses += " bg-accent/10 border-accent/30";
    } else {
      previewClasses += " bg-white";
    }
    
    // Apply size variations
    if (embedSize === 'small') {
      textSize = "text-sm";
    } else if (embedSize === 'large') {
      textSize = "text-lg";
    }
    
    return (
      <div className={previewClasses}>
        <div className={`${padding}`}>
          <p className={`${textSize} italic relative mb-2`}>
            <span className={`absolute -left-1 -top-2 text-3xl ${embedColor === 'dark' ? 'text-white/30' : 'text-accent/30'} font-serif`}>"</span>
            {quote.text}
            <span className={`absolute -bottom-4 -right-1 text-3xl ${embedColor === 'dark' ? 'text-white/30' : 'text-accent/30'} font-serif`}>"</span>
          </p>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{quote.author}</p>
              {embedStyle !== 'minimal' && (
                <p className="text-sm opacity-70">{formatDate(quote.date)}</p>
              )}
            </div>
            {embedStyle === 'elegant' && (
              <div className="text-xs opacity-50">via Quote Archive</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Main card */}
      {renderMainCard()}
      
      {/* Expanded Overlay */}
      <AnimatePresence>
        {expanded && (
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
                  <p className="text-balance text-xl leading-relaxed font-medium mb-2 relative">
                    <span className="absolute -left-1 -top-3 text-4xl text-accent font-serif opacity-30">"</span>
                    {quote.text}
                    <span className="absolute -bottom-6 -right-1 text-4xl text-accent font-serif opacity-30">"</span>
                  </p>
                </div>
                
                {/* Embed Code Section (shown when share button is clicked) */}
                {showEmbedCode && (
                  <div className="mb-8 p-4 bg-secondary/30 rounded-lg border border-border">
                    <h3 className="font-medium mb-4 flex items-center">
                      <Link size={16} className="mr-2" /> Embed this quote on your website
                    </h3>
                    
                    {/* Embed Customization Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* Style Option */}
                      <div>
                        <Label htmlFor="embed-style" className="mb-2 block">Style</Label>
                        <Select value={embedStyle} onValueChange={(value) => setEmbedStyle(value as EmbedStyle)}>
                          <SelectTrigger id="embed-style">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="elegant">Elegant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Color Theme */}
                      <div>
                        <Label className="mb-2 block">Color</Label>
                        <RadioGroup 
                          value={embedColor} 
                          onValueChange={(value) => setEmbedColor(value as EmbedColor)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light">Light</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <Label htmlFor="dark">Dark</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="accent" id="accent" />
                            <Label htmlFor="accent">Accent</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {/* Size Option */}
                      <div>
                        <Label htmlFor="embed-size" className="mb-2 block">Size</Label>
                        <Select value={embedSize} onValueChange={(value) => setEmbedSize(value as EmbedSize)}>
                          <SelectTrigger id="embed-size">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div>
                      <Label className="mb-2 block">Preview</Label>
                      {renderEmbedPreview()}
                    </div>
                    
                    {/* Generated Embed Code */}
                    <div className="bg-white border border-border p-3 rounded-md text-sm font-mono mb-3 overflow-x-auto">
                      {generateEmbedCode()}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        By embedding this quote, your site will be listed in the "Cited By" section.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyEmbedCode}
                        className="ml-4"
                      >
                        Copy Code
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Source Section */}
                <SectionBox title="Source Information" icon={<BookOpen size={18} />}>
                  <div className="space-y-3">
                    {/* Evidence Image */}
                    {quote.evidenceImage && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Source Evidence</h4>
                        <div className="border border-border rounded-md overflow-hidden">
                          <img 
                            src={quote.evidenceImage} 
                            alt={`Evidence for quote by ${quote.author}`} 
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* OCR extracted text - show right after evidence image */}
                    {quote.ocrExtractedText && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-1">Extracted Text</h4>
                        <div className="bg-secondary/20 p-3 rounded-md italic text-sm">
                          {quote.ocrExtractedText}
                        </div>
                        {quote.ocrConfidenceScore && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Confidence Score: {(quote.ocrConfidenceScore * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    )}
                    
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
                
                {/* "Cited By" Section */}
                <SectionBox 
                  title={`Cited By (${quote.citedBy?.length || 0})`} 
                  icon={<Link size={18} />}
                  id={`cited-by-section-${quote.id}`}
                >
                  {quote.citedBy && quote.citedBy.length > 0 ? (
                    <div className="space-y-4">
                      {quote.citedBy.map((citation, index) => (
                        <div key={index} className="flex justify-between items-start p-3 border border-border/50 rounded-lg hover:bg-secondary/10 transition-colors">
                          <div>
                            <p className="font-medium">{citation.siteName}</p>
                            <p className="text-xs text-muted-foreground">Embedded on: {formatDate(citation.embedDate)}</p>
                          </div>
                          <a 
                            href={citation.siteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-accent hover:underline flex items-center text-sm"
                          >
                            Visit <ExternalLink size={14} className="ml-1" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">This quote hasn't been embedded on any websites yet.</p>
                      <p className="text-sm mt-2">
                        Share it using the embed code to see sites that cite this quote.
                      </p>
                    </div>
                  )}
                </SectionBox>
                
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
                    onClick={copyEmbedCode}
                    className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                    aria-label="Copy embed code"
                  >
                    <Share2 size={20} />
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
