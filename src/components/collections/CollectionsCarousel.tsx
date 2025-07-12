
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Topic {
  id: string;
  topic_name: string;
  quote_count?: number;
}

const collections = [
  { id: 1, title: "Philosophy" },
  { id: 2, title: "Leadership" },
  { id: 3, title: "Personal Growth" },
  { id: 4, title: "Science" },
  { id: 5, title: "Business" },
  { id: 6, title: "Psychology" },
  { id: 7, title: "Technology" },
  { id: 8, title: "Art & Creativity" },
];

export function CollectionsCarousel() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopicsWithCounts = async () => {
      try {
        // For now, just show the static collections without counts
        // In the future, this could be connected to actual database topics
        setLoading(false);
      } catch (error) {
        console.error('Error fetching topics:', error);
        setLoading(false);
      }
    };

    fetchTopicsWithCounts();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Popular Collections</h2>
        <div className="flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-48 h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Popular Collections</h2>
      <div className="relative">
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {collections.map((collection) => (
              <CarouselItem key={collection.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 aspect-square flex flex-col items-center justify-center text-center">
                    <h3 className="font-medium mb-2">{collection.title}</h3>
                    <p className="text-sm text-muted-foreground">Browse quotes</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 md:flex" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 md:flex" />
        </Carousel>
      </div>
    </div>
  );
}
