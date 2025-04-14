
import { Link, Share2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Quote } from '../../utils/quotesData';
import { useFormatDate } from '../../hooks/use-format-date';
import { useToast } from '@/hooks/use-toast';

// Embed style types
export type EmbedStyle = 'minimal' | 'standard' | 'elegant';
export type EmbedColor = 'light' | 'dark' | 'accent';
export type EmbedSize = 'small' | 'medium' | 'large';

interface EmbedCodeSectionProps {
  quote: Quote;
  embedStyle: EmbedStyle;
  setEmbedStyle: (style: EmbedStyle) => void;
  embedColor: EmbedColor;
  setEmbedColor: (color: EmbedColor) => void;
  embedSize: EmbedSize;
  setEmbedSize: (size: EmbedSize) => void;
}

export function EmbedCodeSection({
  quote,
  embedStyle,
  setEmbedStyle,
  embedColor,
  setEmbedColor,
  embedSize,
  setEmbedSize
}: EmbedCodeSectionProps) {
  const { formatDate } = useFormatDate();
  const { toast } = useToast();

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
  );
}
