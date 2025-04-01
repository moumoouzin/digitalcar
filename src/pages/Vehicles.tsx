
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CarCard } from "@/components/cars/CarCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";

interface CarListing {
  id: string;
  title: string;
  price: number;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  transmission: string;
  color: string;
  image?: string;
  features: string[];
}

const Vehicles = () => {
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchCars();
  }, [currentPage]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      
      // Fetch total count for pagination
      const { count } = await supabase
        .from('car_ads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }

      // Fetch cars with pagination
      const { data: carAds, error } = await supabase
        .from('car_ads')
        .select('*')
        .eq('status', 'active')
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Fetch primary images for each car
      const carsWithImages = await Promise.all(
        carAds.map(async (car) => {
          const { data: images } = await supabase
            .from('car_images')
            .select('image_url')
            .eq('car_id', car.id)
            .eq('is_primary', true)
            .limit(1);

          // Fetch features for this car
          const { data: featuresData } = await supabase
            .from('car_features')
            .select('feature_id')
            .eq('car_id', car.id);

          const features = featuresData 
            ? featuresData.map(feature => feature.feature_id)
            : [];

          return {
            ...car,
            image: images && images.length > 0 ? images[0].image_url : undefined,
            features,
          };
        })
      );

      setCars(carsWithImages);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast({
        title: "Erro ao carregar veículos",
        description: "Não foi possível carregar a lista de veículos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toLocaleString('pt-BR')}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Veículos Disponíveis</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          </div>
        ) : cars.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg text-gray-600">
                Nenhum veículo disponível no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                image={car.image || "/placeholder.svg"}
                name={car.title}
                price={formatPrice(car.price)}
                features={car.features.length > 0 
                  ? car.features 
                  : [`${car.year}`, `${car.mileage} km`, car.transmission]}
                carId={car.id}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Vehicles;
