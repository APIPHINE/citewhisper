
import { Share2 } from 'lucide-react';

interface ShareEmbedButtonProps {
  handleShareClick: () => void;
  showEmbedSection: boolean;
}

export function ShareEmbedButton({ handleShareClick, showEmbedSection }: ShareEmbedButtonProps) {
  return (
    <div className="mb-4">
      <button
        onClick={handleShareClick}
        className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
      >
        <Share2 size={16} />
        {showEmbedSection ? "Hide embed options" : "Embed this quote on your website"}
      </button>
    </div>
  );
}
