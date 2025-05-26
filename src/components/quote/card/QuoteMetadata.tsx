import { Badge } from '@/components/ui/badge';
interface QuoteMetadataProps {
  author: string;
  date: string;
  source: string;
  translator?: string;
  currentLanguage: "en" | "es" | "fr";
  topics: string[];
  theme?: string;
}
export function QuoteMetadata({
  author,
  date,
  source,
  translator,
  currentLanguage,
  topics,
  theme
}: QuoteMetadataProps) {
  return <div className="mt-4">
      <p className="font-semibold text-base text-foreground">{author}</p>
      <p className="text-sm text-muted-foreground mb-1">{date}</p>
      <p className="text-sm text-muted-foreground mb-1">
        <span className="font-medium">Source:</span> {source}
        {translator && currentLanguage === "en" && <span className="ml-1">(translated by {translator})</span>}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {topics.slice(0, 3).map(topic => <Badge key={topic} variant="secondary" className="bg-secondary/80">
            {topic}
          </Badge>)}
        {theme && <Badge variant="outline" className="border-accent/30 text-accent">
            {theme}
          </Badge>}
      </div>
    </div>;
}