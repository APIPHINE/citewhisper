
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EmbedSize } from "@/types/embed";

interface EmbedSizeSelectProps {
  embedSize: EmbedSize;
  setEmbedSize: (size: EmbedSize) => void;
}

export function EmbedSizeSelect({ embedSize, setEmbedSize }: EmbedSizeSelectProps) {
  return (
    <div>
      <Label htmlFor="embed-size" className="mb-2 block">Size</Label>
      <Select value={embedSize} onValueChange={(value) => setEmbedSize(value as EmbedSize)}>
        <SelectTrigger id="embed-size" className="bg-white">
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent className="bg-white border-border shadow-md">
          <SelectItem value="small">Small (300px)</SelectItem>
          <SelectItem value="medium">Medium (450px)</SelectItem>
          <SelectItem value="large">Large (600px)</SelectItem>
          <SelectItem value="custom">Custom Size</SelectItem>
          <SelectItem value="responsive">Responsive</SelectItem>
          <SelectItem value="compact">Compact</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
