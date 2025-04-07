
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CarFormValues, carBrands, generateYears } from "../types";
import { UseFormSetValue } from "react-hook-form";

export const useCarData = (id: string | undefined, setValue: UseFormSetValue<CarFormValues>) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{id: string, url: string}>>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [customBrand, setCustomBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customYear, setCustomYear] = useState("");
  const [customTransmission, setCustomTransmission] = useState("");
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [isCustomYear, setIsCustomYear] = useState(false);
  const [isCustomTransmission, setIsCustomTransmission] = useState(false);

  // Fetch car data
  const fetchCarDetails = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      const { data: carData, error: carError } = await supabase
        .from('car_ads')
        .select('*')
        .eq('id', id)
        .single();
        
      if (carError) {
        throw carError;
      }
      
      if (!carData) {
        toast({
          title: "Anúncio não encontrado",
          description: "Não foi possível encontrar o anúncio solicitado.",
          variant: "destructive",
        });
        navigate("/admin/painel/cars");
        return;
      }
      
      setValue("title", carData.title);
      setValue("description", carData.description);
      setValue("price", carData.price.toString());
      setValue("color", carData.color);
      setValue("mileage", carData.mileage);
      setValue("whatsapp", carData.whatsapp);
      setIsFeatured(carData.is_featured || false);
      
      const brandExists = carBrands.some(brand => brand.name === carData.brand);
      if (brandExists) {
        setSelectedBrand(carData.brand);
        setIsCustomBrand(false);
      } else {
        setIsCustomBrand(true);
        setCustomBrand(carData.brand);
      }
      
      const modelExists = carData.brand && carBrands.find(
        brand => brand.name === carData.brand
      )?.models.includes(carData.model);
      
      if (modelExists) {
        setValue("model", carData.model);
        setIsCustomModel(false);
      } else {
        setIsCustomModel(true);
        setCustomModel(carData.model);
        setValue("model", carData.model);
      }
      
      const yearExists = generateYears().includes(carData.year);
      if (yearExists) {
        setValue("year", carData.year);
        setIsCustomYear(false);
      } else {
        setIsCustomYear(true);
        setCustomYear(carData.year);
        setValue("year", carData.year);
      }
      
      const standardTransmissions = ["manual", "automatic", "cvt", "semi-automatic"];
      if (standardTransmissions.includes(carData.transmission)) {
        setValue("transmission", carData.transmission);
        setIsCustomTransmission(false);
      } else {
        setIsCustomTransmission(true);
        setCustomTransmission(carData.transmission);
        setValue("transmission", carData.transmission);
      }
      
      const { data: featuresData, error: featuresError } = await supabase
        .from('car_features')
        .select('feature_id')
        .eq('car_id', id);
        
      if (!featuresError && featuresData) {
        const featureIds = featuresData.map(f => f.feature_id);
        setSelectedFeatures(featureIds);
      }
      
      const { data: imagesData, error: imagesError } = await supabase
        .from('car_images')
        .select('id, image_url')
        .eq('car_id', id);
        
      if (!imagesError && imagesData) {
        const images = imagesData.map(img => ({
          id: img.id,
          url: img.image_url
        }));
        setExistingImages(images);
      }
      
    } catch (error: any) {
      console.error('Erro ao carregar dados do anúncio:', error);
      toast({
        title: "Erro ao carregar anúncio",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      navigate("/admin/painel/cars");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  return {
    isLoading,
    selectedBrand,
    setSelectedBrand,
    selectedFeatures,
    setSelectedFeatures,
    existingImages,
    setExistingImages,
    customBrand,
    setCustomBrand,
    customModel,
    setCustomModel,
    customYear,
    setCustomYear,
    customTransmission,
    setCustomTransmission,
    isCustomBrand,
    setIsCustomBrand,
    isCustomModel, 
    setIsCustomModel,
    isCustomYear,
    setIsCustomYear,
    isCustomTransmission,
    setIsCustomTransmission,
    isFeatured,
    setIsFeatured,
  };
};
