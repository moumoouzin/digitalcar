import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoForm } from "./cars/components/BasicInfoForm";
import { DetailsForm } from "./cars/components/DetailsForm";
import { ImagesForm } from "./cars/components/ImagesForm";
import { useCarData } from "./cars/hooks/useCarData";
import { useImageHandling } from "./cars/utils/imageUtils";
import { carFormSchema, CarFormValues } from "./cars/types";

const EditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const { uploadImageToSupabase } = useImageHandling();

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      title: "",
      description: "",
      model: "",
      year: "",
      price: "",
      color: "",
      transmission: "",
      mileage: "",
      whatsapp: "",
    },
  });

  const { 
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
    setIsFeatured
  } = useCarData(id, form.setValue);

  const onSubmit = async (data: CarFormValues) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      const updatedCar = {
        title: data.title,
        price: parseFloat(data.price),
        brand: isCustomBrand ? customBrand : selectedBrand,
        model: isCustomModel ? customModel : data.model,
        year: isCustomYear ? customYear : data.year,
        color: data.color,
        transmission: isCustomTransmission ? customTransmission : data.transmission,
        mileage: data.mileage,
        description: data.description,
        whatsapp: data.whatsapp,
        is_featured: isFeatured
      };

      const { error } = await supabase
        .from('car_ads')
        .update(updatedCar)
        .eq('id', id);

      if (error) {
        throw error;
      }

      await supabase
        .from('car_features')
        .delete()
        .eq('car_id', id);
        
      if (selectedFeatures.length > 0) {
        const featureObjects = selectedFeatures.map(featureId => ({
          car_id: id,
          feature_id: featureId
        }));

        const { error: featuresError } = await supabase
          .from('car_features')
          .insert(featureObjects);

        if (featuresError) {
          console.error('Error saving features:', featuresError);
        }
      }

      // Process uploaded images
      if (uploadedImages.length > 0) {
        console.log(`Starting upload of ${uploadedImages.length} new images...`);
        
        // Upload all images in parallel and include index information
        const uploadPromises = uploadedImages.map((file, index) => {
          // First new image is primary only if there are no existing images
          const makeFirstPrimary = existingImages.length === 0 && index === 0;
          return uploadImageToSupabase(file, id, makeFirstPrimary);
        });
        
        const results = await Promise.all(uploadPromises);
        console.log('Image upload results:', results);
        
        // Clear uploaded images after successful upload
        setUploadedImages([]);
        setImagePreviewUrls([]);
      }

      toast({
        title: "Anúncio atualizado com sucesso!",
        description: "As alterações foram salvas.",
        variant: "default",
      });

      navigate("/admin/painel/cars");
    } catch (error: any) {
      console.error('Erro ao atualizar anúncio:', error);
      toast({
        title: "Erro ao atualizar anúncio",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Verificar limite total de imagens (existentes + já upadas + novas)
      const totalImages = existingImages.length + uploadedImages.length + files.length;
      if (totalImages > 10) {
        toast({
          title: "Limite de imagens excedido",
          description: "Você pode ter no máximo 10 imagens por anúncio.",
          variant: "destructive",
        });
        return;
      }

      // Verificar duplicação por nome de arquivo
      const existingFileNames = new Set([
        ...existingImages.map(img => img.image_url.split('/').pop()),
        ...uploadedImages.map(file => file.name)
      ]);

      const newFiles = files.filter(file => !existingFileNames.has(file.name));

      if (newFiles.length !== files.length) {
        toast({
          title: "Arquivos duplicados ignorados",
          description: "Algumas imagens foram ignoradas por já existirem no anúncio.",
          variant: "default",
        });
      }

      if (newFiles.length > 0) {
        setUploadedImages(prev => [...prev, ...newFiles]);
        const newImagePreviews = newFiles.map((file) => URL.createObjectURL(file));
        setImagePreviewUrls(prev => [...prev, ...newImagePreviews]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2Icon className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando dados do anúncio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Editar Anúncio</h1>
        <p className="text-muted-foreground mt-1">
          Altere as informações do anúncio conforme necessário.
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="info" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações Básicas</TabsTrigger>
              <TabsTrigger value="details">Detalhes e Opcionais</TabsTrigger>
              <TabsTrigger value="photos">Fotos e Finalização</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Edite as informações essenciais do veículo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BasicInfoForm
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                    customBrand={customBrand}
                    setCustomBrand={setCustomBrand}
                    customModel={customModel}
                    setCustomModel={setCustomModel}
                    customYear={customYear}
                    setCustomYear={setCustomYear}
                    isCustomBrand={isCustomBrand}
                    setIsCustomBrand={setIsCustomBrand}
                    isCustomModel={isCustomModel}
                    setIsCustomModel={setIsCustomModel}
                    isCustomYear={isCustomYear}
                    setIsCustomYear={setIsCustomYear}
                    onNext={() => setActiveTab("details")}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes e Opcionais</CardTitle>
                  <CardDescription>
                    Edite os detalhes e opcionais do veículo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DetailsForm
                    customTransmission={customTransmission}
                    setCustomTransmission={setCustomTransmission}
                    isCustomTransmission={isCustomTransmission}
                    setIsCustomTransmission={setIsCustomTransmission}
                    selectedFeatures={selectedFeatures}
                    setSelectedFeatures={setSelectedFeatures}
                    isFeatured={isFeatured}
                    setIsFeatured={setIsFeatured}
                    onPrevious={() => setActiveTab("info")}
                    onNext={() => setActiveTab("photos")}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fotos e Finalização</CardTitle>
                  <CardDescription>
                    Edite as fotos do veículo e revise as informações antes de atualizar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImagesForm
                    existingImages={existingImages}
                    setExistingImages={setExistingImages}
                    onPrevious={() => setActiveTab("details")}
                    onSubmit={form.handleSubmit(onSubmit)}
                    isSubmitting={isSubmitting}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditCar;
