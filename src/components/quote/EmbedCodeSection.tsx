
import { Link } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Quote } from '../../utils/quotesData';
import { useToast } from '@/hooks/use-toast';
import { EmbedStyle, EmbedColor, EmbedSize } from '@/types/embed';
import { EmbedStyleSelect } from './embed/EmbedStyleSelect';
import { EmbedColorSelect } from './embed/EmbedColorSelect';
import { EmbedSizeSelect } from './embed/EmbedSizeSelect';
import { EmbedPreview } from './embed/EmbedPreview';
import { EmbedCodeGenerator } from './embed/EmbedCodeGenerator';

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
  const { toast } = useToast();

  const handleCopyCode = () => {
    toast({
      title: "Embed code copied",
      description: "The embed code has been copied to your clipboard.",
    });
  };

  return (
    <div className="mb-8 p-4 bg-secondary/30 rounded-lg border border-border">
      <h3 className="font-medium mb-4 flex items-center">
        <Link size={16} className="mr-2" /> Embed this quote on your website
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <EmbedStyleSelect embedStyle={embedStyle} setEmbedStyle={setEmbedStyle} />
        <EmbedColorSelect embedColor={embedColor} setEmbedColor={setEmbedColor} />
        <EmbedSizeSelect embedSize={embedSize} setEmbedSize={setEmbedSize} />
      </div>
      
      <div>
        <Label className="mb-2 block">Preview</Label>
        <EmbedPreview
          quote={quote}
          embedStyle={embedStyle}
          embedColor={embedColor}
          embedSize={embedSize}
        />
      </div>
      
      <EmbedCodeGenerator
        quote={quote}
        embedStyle={embedStyle}
        embedColor={embedColor}
        embedSize={embedSize}
        onCopy={handleCopyCode}
      />
    </div>
  );
}
