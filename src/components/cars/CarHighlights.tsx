
import React, { useState, useEffect } from "react";
import { CarCard } from "./CarCard";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CarCardSkeleton } from "./CarCardSkeleton";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface Car {
  id: string;
  title: string;
  price: number;
  images: { url: string, is_primary: boolean }[];
  features: { name: string }[];
}

export function CarHighlights() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("car_ads")
        .select(`
          id,
          title,
          price,
          car_images (image_url, is_primary),
          car_features (feature_id)
        `)
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(6); // Pegando até 6 carros para o carrossel

      if (error) throw error;

      const formattedCars = data.map((car) => ({
        id: car.id,
        title: car.title,
        price: car.price,
        images: car.car_images.map((img: any) => ({ 
          url: img.image_url,
          is_primary: img.is_primary
        })),
        features: car.car_features.map((feat: any) => ({ name: feat.feature_id })),
      }));

      setFeaturedCars(formattedCars);
    } catch (error) {
      console.error("Erro ao buscar carros em destaque:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get the best image for a car
  const getMainImage = (car: Car): string => {
    // First try to find a primary image
    const primaryImage = car.images.find(img => img.is_primary);
    if (primaryImage) return primaryImage.url;
    
    // If no primary image, use the first image
    return car.images.length > 0 ? car.images[0].url : "";
  };

  if (isLoading) {
    return (
      <div className="px-3 py-4 sm:px-4 sm:py-8 mx-auto max-w-7xl">
        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Nossos Destaques
          </h2>
          <p className="mt-1 sm:mt-3 text-sm sm:text-base text-gray-500">
            Veículos selecionados especialmente para você.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(isMobile ? 1 : 3)].map((_, index) => (
            <CarCardSkeleton key={index} />
          ))}
        </div>
        
        <div className="mt-6 sm:mt-8 text-center">
          <Link to="/veiculos">
            <Button variant="outline" size={isMobile ? "default" : "lg"}>
              Ver mais veículos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Se não houver carros em destaque, não exibe a seção
  if (featuredCars.length === 0) {
    return null;
  }

  return (
    <div className="px-3 py-4 sm:px-4 sm:py-8 mx-auto max-w-7xl">
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          Nossos Destaques
        </h2>
        <p className="mt-1 sm:mt-3 text-sm sm:text-base text-gray-500">
          Veículos selecionados especialmente para você.
        </p>
      </div>
      
      <Carousel 
        className="w-full relative"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {featuredCars.map((car) => (
            <CarouselItem 
              key={car.id} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <CarCard
                id={car.id}
                image={getMainImage(car)}
                name={car.title}
                price={formatCurrency(car.price)}
                features={car.features.slice(0, 2).map(f => f.name)}
                compact={isMobile}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className={isMobile ? "flex justify-center gap-4 mt-4" : "hidden sm:block"}>
          {isMobile ? (
            <>
              <CarouselPrevious className="static translate-x-0 translate-y-0 h-8 w-8 rounded-full" />
              <CarouselNext className="static translate-x-0 translate-y-0 h-8 w-8 rounded-full" />
            </>
          ) : (
            <>
              <CarouselPrevious className="left-0 -translate-x-1/2" />
              <CarouselNext className="right-0 translate-x-1/2" />
            </>
          )}
        </div>
      </Carousel>
      
      <div className="mt-6 sm:mt-8 text-center">
        <Link to="/veiculos">
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "lg"}
            className="w-full sm:w-auto"
          >
            Ver mais veículos
          </Button>
        </Link>
      </div>
    </div>
  );
}
