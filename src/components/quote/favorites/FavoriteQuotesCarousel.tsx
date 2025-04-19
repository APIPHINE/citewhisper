
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
        {quotes.map((quote) => (
          <CarouselItem key={quote.id} className="basis-full lg:basis-[85%]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src="/lovable-uploads/a2353ff3-ff9d-4a70-a244-3eefc6a3f0e8.png"
                alt={`Quote by ${quote.author}`}
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
