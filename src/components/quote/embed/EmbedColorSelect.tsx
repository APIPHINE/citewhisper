
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { EmbedColor } from "@/types/embed";

interface EmbedColorSelectProps {
  embedColor: EmbedColor;
  setEmbedColor: (color: EmbedColor) => void;
}

export function EmbedColorSelect({ embedColor, setEmbedColor }: EmbedColorSelectProps) {
  return (
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
  );
}
