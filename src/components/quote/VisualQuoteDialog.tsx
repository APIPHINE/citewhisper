
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
import { Link } from "react-router-dom";

interface VisualQuoteDialogProps {
  quoteId: string;
  author?: string;
}

export function VisualQuoteDialog({ quoteId, author = "author" }: VisualQuoteDialogProps) {
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
              <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/lovable-uploads/a1acd22e-ad0b-4842-9f6a-cc35e090316c.png"
                  alt={`${author} quote visualization`}
                  className="w-full h-auto"
                />
                <div className="p-4 bg-secondary/20 text-sm">
                  <p className="mb-2 text-center text-muted-foreground">
                    This image is used under Fair Use (17 U.S.C. § 107) for educational purposes.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <p className="mb-1">
                      <strong>Attribution:</strong> Quote by {author}
                    </p>
                    <p className="mb-2">
                      <strong>Fair Use Justification:</strong> Transformative use for educational commentary
                    </p>
                    <p className="text-center">
                      <Link to="/fair-use-policy" className="text-accent hover:underline">
                        View our Fair Use Policy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
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
