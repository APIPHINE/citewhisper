
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EmbedColor } from "@/types/embed";

interface EmbedColorSelectProps {
  embedColor: EmbedColor;
  setEmbedColor: (color: EmbedColor) => void;
}

export function EmbedColorSelect({ embedColor, setEmbedColor }: EmbedColorSelectProps) {
  return (
    <div>
      <Label htmlFor="embed-color" className="mb-2 block">Color & Tone</Label>
      <Select value={embedColor} onValueChange={(value) => setEmbedColor(value as EmbedColor)}>
        <SelectTrigger id="embed-color" className="bg-white">
          <SelectValue placeholder="Select color" />
        </SelectTrigger>
        <SelectContent className="bg-white border-border shadow-md">
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="accent">Accent</SelectItem>
          <SelectItem value="muted">Muted</SelectItem>
          <SelectItem value="warm">Warm</SelectItem>
          <SelectItem value="cool">Cool</SelectItem>
          <SelectItem value="vintage">Vintage</SelectItem>
          <SelectItem value="modern">Modern</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
