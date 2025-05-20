
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CarCard } from "./CarCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CarCardSkeleton } from "./CarCardSkeleton";

export function CarHighlights() {
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("car_ads")
        .select(`
          *,
          car_images(*),
          car_features(feature_id)
        `)
        .eq('featured', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      const formattedCars = data.map((car) => {
        // Extract features
        const features = car.car_features
          ? car.car_features.map((feature) => feature.feature_id)
          : [];

        // Find primary image or use the first one
        const primaryImage =
          car.car_images && car.car_images.length > 0
            ? car.car_images.find((img) => img.is_primary)?.image_url ||
              car.car_images[0]?.image_url
            : undefined;

        return {
          ...car,
          features,
          image: primaryImage,
        };
      });

      setFeaturedCars(formattedCars);
    } catch (error) {
      console.error("Error fetching featured cars:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os veículos em destaque",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `R$ ${price.toLocaleString("pt-BR")}`;
  };

  return (
    <section className="py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Destaques
          </h2>
          <p className="text-gray-600 mt-1">
            Veículos selecionados especialmente para você.
          </p>
        </div>
        <Link to="/veiculos">
          <Button className="mt-2 sm:mt-0" variant="outline">
            Ver todos
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CarCardSkeleton key={i} />
          ))}
        </div>
      ) : featuredCars.length === 0 ? (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-lg text-gray-600">
            Nenhum veículo em destaque no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <CarCard
              key={car.id}
              id={car.id}
              name={car.title}
              price={formatPrice(car.price)}
              image={car.image || "/placeholder.svg"}
              features={car.features}
              brand={car.brand} // Pass the brand prop here
            />
          ))}
        </div>
      )}
    </section>
  );
}
