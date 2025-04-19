
import { Frame } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VisualQuoteDialogProps {
  quoteId: string;
}

export function VisualQuoteDialog({ quoteId }: VisualQuoteDialogProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-secondary/80">
                <Frame className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 bg-transparent border-none">
              <img
                src="/lovable-uploads/a1acd22e-ad0b-4842-9f6a-cc35e090316c.png"
                alt="Steve Jobs quote visualization"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>
          <p>View visual quote</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
