
import { useState } from 'react';
import { Award, Copy } from 'lucide-react';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CitationSectionProps {
  quote: Quote;
}

export function CitationSection({ quote }: CitationSectionProps) {
  const [selectedFormat, setSelectedFormat] = useState<'APA' | 'MLA' | 'Chicago'>('APA');
  const { toast } = useToast();

  const getCitationText = () => {
    switch (selectedFormat) {
      case 'APA':
        return quote.citationAPA || `${quote.author} (${quote.date}). "${quote.text}"`;
      case 'MLA':
        return quote.citationMLA || `${quote.author}. "${quote.text}." ${quote.date}.`;
      case 'Chicago':
        return quote.citationChicago || `${quote.author}, "${quote.text}," ${quote.date}.`;
      default:
        return "";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCitationText());
    toast({
      title: "Citation copied",
      description: `${selectedFormat} citation has been copied to clipboard.`,
    });
  };

  return (
    <SectionBox title="Citation Formats" icon={<Award size={18} />}>
      <div className="space-y-4">
        {/* Citation Format Selection */}
        <RadioGroup 
          value={selectedFormat} 
          onValueChange={(value) => setSelectedFormat(value as 'APA' | 'MLA' | 'Chicago')}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="APA" id="apa" />
            <Label htmlFor="apa">APA</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MLA" id="mla" />
            <Label htmlFor="mla">MLA</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Chicago" id="chicago" />
            <Label htmlFor="chicago">Chicago</Label>
          </div>
        </RadioGroup>
        
        {/* Citation Display */}
        <div className="bg-secondary/30 p-4 rounded-md relative">
          <p className="text-sm text-muted-foreground pr-8">{getCitationText()}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={handleCopy}
          >
            <Copy size={16} />
            <span className="sr-only">Copy citation</span>
          </Button>
        </div>
      </div>
    </SectionBox>
  );
}
