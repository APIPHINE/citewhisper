
import { Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';

interface TagsSectionProps {
  quote: Quote;
}

export function TagsSection({ quote }: TagsSectionProps) {
  return (
    <SectionBox title="Tags & Categories" icon={<Tags size={18} />}>
      <div className="space-y-3">
        {/* Topics */}
        <div>
          <h4 className="font-medium text-sm mb-2">Topics</h4>
          <div className="flex flex-wrap gap-2">
            {quote.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="bg-secondary/80">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Theme */}
        <div>
          <h4 className="font-medium text-sm mb-2">Theme</h4>
          <Badge variant="outline" className="border-accent/30 text-accent">
            {quote.theme}
          </Badge>
        </div>
        
        {/* Keywords */}
        {quote.keywords && quote.keywords.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {quote.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="bg-secondary/50">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionBox>
  );
}
