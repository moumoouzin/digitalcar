
import React from "react";
import { CarCard } from "./CarCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export const FeaturedCars = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-neutral-100 mb-8 sm:mb-12 p-4 sm:p-6 rounded-xl shadow-sm relative">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Veículos em Destaque</h2>
      
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
            <CarCard
              id="featured-1" 
              image="https://cdn.builder.io/api/v1/image/assets/TEMP/5a31f9e49e1c83e28e34b3e46ac555552fb82580"
              name="Honda HR-V"
              price="R$ 120.900"
              features={["Som original", "2020-2021"]}
              compact={isMobile}
            />
          </CarouselItem>
          
          <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
            <CarCard
              id="featured-2"
              image="https://cdn.builder.io/api/v1/image/assets/TEMP/01b66cfb02848421fef34f11a70414649581c5ab"
              name="Honda HR-V"
              price="R$ 92.500"
              features={["Sensor de ré", "2015-2016"]}
              compact={isMobile}
            />
          </CarouselItem>
          
          <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
            <CarCard
              id="featured-3"
              image="https://cdn.builder.io/api/v1/image/assets/TEMP/7924ddaa4c66029a336d6a7e27aeb8efac7d9719"
              name="Hyundai HB20"
              price="R$ 75.990"
              features={["Rodas liga leve", "2020-2020"]}
              compact={isMobile}
            />
          </CarouselItem>
          
          <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
            <CarCard
              id="featured-4"
              image="https://cdn.builder.io/api/v1/image/assets/TEMP/5a31f9e49e1c83e28e34b3e46ac555552fb82580"
              name="Toyota Corolla"
              price="R$ 145.900"
              features={["Automático", "2022-2023"]}
              compact={isMobile}
            />
          </CarouselItem>
          
          <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
            <CarCard
              id="featured-5"
              image="https://cdn.builder.io/api/v1/image/assets/TEMP/01b66cfb02848421fef34f11a70414649581c5ab"
              name="Nissan Kicks"
              price="R$ 89.990"
              features={["Câmera de ré", "2019-2020"]}
              compact={isMobile}
            />
          </CarouselItem>
        </CarouselContent>
        
        <div className="hidden sm:block">
          <CarouselPrevious className="left-0 -translate-x-1/2" />
          <CarouselNext className="right-0 translate-x-1/2" />
        </div>
      </Carousel>
    </div>
  );
};
