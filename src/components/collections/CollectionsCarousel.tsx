
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const collections = [
  { id: 1, title: "Philosophy", count: 124 },
  { id: 2, title: "Leadership", count: 98 },
  { id: 3, title: "Personal Growth", count: 156 },
  { id: 4, title: "Science", count: 87 },
  { id: 5, title: "Business", count: 143 },
  { id: 6, title: "Psychology", count: 112 },
  { id: 7, title: "Technology", count: 91 },
  { id: 8, title: "Art & Creativity", count: 76 },
];

export function CollectionsCarousel() {
  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Popular Collections</h2>
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {collections.map((collection) => (
            <CarouselItem key={collection.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 aspect-square flex flex-col items-center justify-center text-center">
                  <h3 className="font-medium mb-2">{collection.title}</h3>
                  <p className="text-sm text-muted-foreground">{collection.count} quotes</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
