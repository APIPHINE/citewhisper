
import { Quote } from '../../../utils/quotesData';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FavoriteQuotesCarouselProps {
  quotes: Quote[];
}

export function FavoriteQuotesCarousel({ quotes }: FavoriteQuotesCarouselProps) {
  if (quotes.length === 0) return null;

  return (
    <Carousel className="w-full max-w-4xl mx-auto mb-12">
      <CarouselContent>
        {quotes.map((quote, index) => (
          <CarouselItem key={quote.id} className="basis-full lg:basis-[85%]">
            <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '768/1152' }}>
              <div 
                className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/20 flex flex-col justify-center items-center p-8 text-center"
                style={{ width: '768px', height: '1152px', maxWidth: '100%', maxHeight: '100%' }}
              >
                <div className="max-w-2xl">
                  <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed mb-6 text-foreground">
                    "{quote.text}"
                  </blockquote>
                  
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground/90">
                      — {quote.author}
                    </p>
                    
                    {quote.source && (
                      <p className="text-sm text-muted-foreground italic">
                        {quote.source}
                      </p>
                    )}
                    
                    {quote.date && (
                      <p className="text-sm text-muted-foreground">
                        {quote.date}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* CiteQuotes branding */}
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/60">
                  www.CiteQuotes.com
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
