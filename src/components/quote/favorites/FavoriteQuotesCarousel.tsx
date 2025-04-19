
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
        {/* English version */}
        <CarouselItem key="english" className="basis-full lg:basis-[85%]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src="/lovable-uploads/9fe7c698-558b-4981-a5fa-73e7bb8ea87f.png"
              alt="Quote by Albert Camus in English"
              className="w-full h-full object-cover"
            />
          </div>
        </CarouselItem>

        {/* French version */}
        <CarouselItem key="french" className="basis-full lg:basis-[85%]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src="/lovable-uploads/7f15ed9e-c194-44df-a54d-54f0d2bfef77.png"
              alt="Citation d'Albert Camus en français"
              className="w-full h-full object-cover"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
