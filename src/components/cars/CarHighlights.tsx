
import React, { useState, useEffect } from "react";
import { CarCard } from "./CarCard";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CarCardSkeleton } from "./CarCardSkeleton";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
        .limit(3);

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
      <div className="px-3 py-6 sm:px-4 sm:py-12 mx-auto max-w-7xl">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nossos Destaques
          </h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-500">
            Veículos selecionados especialmente para você.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <CarCardSkeleton key={index} />
          ))}
        </div>
        
        <div className="mt-8 sm:mt-12 text-center">
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
    <div className="px-3 py-6 sm:px-4 sm:py-12 mx-auto max-w-7xl">
      <div className="text-center mb-6 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Nossos Destaques
        </h2>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-500">
          Veículos selecionados especialmente para você.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredCars.map((car) => (
          <CarCard
            key={car.id}
            id={car.id}
            image={getMainImage(car)}
            name={car.title}
            price={formatCurrency(car.price)}
            features={car.features.slice(0, 2).map(f => f.name)}
            compact={isMobile}
          />
        ))}
      </div>
      
      <div className="mt-8 sm:mt-12 text-center">
        <Link to="/veiculos">
          <Button variant="outline" size={isMobile ? "default" : "lg"}>
            Ver mais veículos
          </Button>
        </Link>
      </div>
    </div>
  );
}
