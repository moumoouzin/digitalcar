import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, Phone, Share2, ArrowRight, Loader2, X, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface CarDetail {
  id: string;
  title: string;
  price: number;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  transmission: string;
  color: string;
  description: string;
  whatsapp: string;
  images: string[];
  features: string[];
}

const featureTranslations: Record<string, string> = {
  "air-conditioning": "Ar-condicionado",
  "power-steering": "Direção Hidráulica",
  "electric-windows": "Vidros Elétricos",
  "abs": "Freios ABS",
  "airbags": "Airbags",
  "alarm": "Alarme",
  "central-lock": "Trava Central",
  "leather-seats": "Bancos de Couro",
  "alloy-wheels": "Rodas de Liga Leve",
  "parking-sensor": "Sensor de Estacionamento",
  "reverse-camera": "Câmera de Ré",
  "roof-rack": "Rack de Teto",
  "sunroof": "Teto Solar",
  "integrated-gps": "GPS Integrado",
  "bluetooth": "Bluetooth",
  "cruise-control": "Piloto Automático",
};

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCarDetails(id);
      incrementViewCount(id);
    }
  }, [id]);

  const fetchCarDetails = async (carId: string) => {
    try {
      setLoading(true);
      
      const { data: carData, error } = await supabase
        .from('car_ads')
        .select(`
          *,
          car_images(*),
          car_features(feature_id)
        `)
        .eq('id', carId)
        .eq('status', 'active')
        .single();

      if (error) {
        throw error;
      }

      const features = carData.car_features 
        ? carData.car_features.map(feature => feature.feature_id)
        : [];
      
      const images = carData.car_images && carData.car_images.length > 0
        ? carData.car_images.map(img => img.image_url)
        : [];

      setCar({
        ...carData,
        images,
        features,
      });
    } catch (error) {
      console.error('Error fetching car details:', error);
      toast({
        title: "Erro ao carregar detalhes",
        description: "Não foi possível encontrar informações sobre este veículo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (carId: string) => {
    try {
      await supabase.rpc('increment_view_count', {
        car_id: carId
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const incrementContactCount = async () => {
    if (!car) return;
    
    try {
      await supabase.rpc('increment_contact_count', {
        car_id: car.id
      });
    } catch (error) {
      console.error('Error incrementing contact count:', error);
    }
  };

  const handleWhatsAppClick = () => {
    if (!car) return;
    
    incrementContactCount();
    
    const message = `Olá, vi seu anúncio do ${car.title} no site e gostaria de mais informações.`;
    const whatsappLink = `https://wa.me/${car.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  const handleShare = async () => {
    if (!car) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: car.title,
          text: `Confira este ${car.brand} ${car.model} ${car.year}!`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para sua área de transferência.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toLocaleString('pt-BR')}`;
  };

  const nextImage = () => {
    if (car && car.images.length > 0) {
      setCurrentImageIndex((currentImageIndex + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car && car.images.length > 0) {
      setCurrentImageIndex((currentImageIndex - 1 + car.images.length) % car.images.length);
    }
  };

  const openFullscreenImage = (imageUrl: string) => {
    setFullscreenImage(imageUrl);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };

  const getTranslatedFeature = (featureId: string) => {
    return featureTranslations[featureId] || featureId;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link to="/veiculos" className="flex items-center gap-1 mb-6 text-gray-600 hover:text-gray-900 transition-colors">
          <ChevronLeft size={16} />
          <span>Voltar para Veículos</span>
        </Link>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          </div>
        ) : !car ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg text-gray-600">
                Veículo não encontrado ou não está mais disponível.
              </p>
              <Link to="/veiculos">
                <Button className="mt-4">Ver outros veículos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: "400px" }}>
                {car.images.length > 0 ? (
                  <>
                    <img 
                      src={car.images[currentImageIndex]} 
                      alt={car.title}
                      className="w-full h-full object-contain cursor-zoom-in"
                      onClick={() => openFullscreenImage(car.images[currentImageIndex])}
                    />
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full opacity-70 hover:opacity-100" 
                      onClick={() => openFullscreenImage(car.images[currentImageIndex])}
                    >
                      <ZoomIn size={20} />
                    </Button>
                    {car.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="rounded-full opacity-70 hover:opacity-100" 
                          onClick={prevImage}
                        >
                          <ChevronLeft size={24} />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="rounded-full opacity-70 hover:opacity-100" 
                          onClick={nextImage}
                        >
                          <ArrowRight size={24} />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Sem imagens disponíveis</p>
                  </div>
                )}
              </div>
              
              {car.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {car.images.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                        index === currentImageIndex ? 'border-[#9F1717]' : 'border-transparent'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Imagem ${index + 1} do ${car.title}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{car.title}</h1>
                <p className="text-2xl font-bold text-[#9F1717] mt-2">
                  {formatPrice(car.price)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-gray-500">Marca</p>
                  <p className="font-medium">{car.brand}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="font-medium">{car.model}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-gray-500">Ano</p>
                  <p className="font-medium">{car.year}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-gray-500">Quilometragem</p>
                  <p className="font-medium">{car.mileage} km</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-gray-500">Câmbio</p>
                  <p className="font-medium">{car.transmission}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-gray-500">Cor</p>
                  <p className="font-medium">{car.color}</p>
                </div>
              </div>
              
              {car.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Destaques</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#A82626] rounded-full" />
                        <span className="text-sm">{getTranslatedFeature(feature)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-line">{car.description}</p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button 
                  className="flex-1 bg-[#25D366] hover:bg-[#1cb956] gap-2"
                  onClick={handleWhatsAppClick}
                >
                  <Phone size={20} />
                  <span>Contato</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 size={20} />
                  <span>Compartilhar</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      
      {/* Fullscreen Image Dialog */}
      <Dialog open={!!fullscreenImage} onOpenChange={(open) => !open && closeFullscreenImage()}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/90">
          <DialogClose className="absolute right-4 top-4 z-10">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <X size={24} />
            </Button>
          </DialogClose>
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {fullscreenImage && (
              <img 
                src={fullscreenImage} 
                alt="Visualização em tela cheia" 
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleDetail;
