
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EmbedStyle } from "@/types/embed";

interface EmbedStyleSelectProps {
  embedStyle: EmbedStyle;
  setEmbedStyle: (style: EmbedStyle) => void;
}

export function EmbedStyleSelect({ embedStyle, setEmbedStyle }: EmbedStyleSelectProps) {
  return (
    <div>
      <Label htmlFor="embed-style" className="mb-2 block">Style</Label>
      <Select value={embedStyle} onValueChange={(value) => setEmbedStyle(value as EmbedStyle)}>
        <SelectTrigger id="embed-style" className="bg-white">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent className="bg-white border-border shadow-md">
          <SelectItem value="standard">Standard Quote</SelectItem>
          <SelectItem value="horizontal">Horizontal Card</SelectItem>
          <SelectItem value="vertical">Vertical Card</SelectItem>
          <SelectItem value="minimal">Minimal</SelectItem>
          <SelectItem value="decorative">Decorative</SelectItem>
          <SelectItem value="classic">Classic Style</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
