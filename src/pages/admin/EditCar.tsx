import React, { useState, useEffect } from "react";
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
import { useImageUploader } from "@/hooks/useImageUploader";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ImageUploaderComponent, uploadImages } = useImageUploader();

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
    selectedBrand,
    setSelectedBrand,
    selectedFeatures,
    setSelectedFeatures,
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

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setIsLoading(true);
        
        // Buscar imagens existentes
        const { data: carImages, error: imagesError } = await supabase
          .from('car_images')
          .select('*')
          .eq('car_id', id);
          
        if (imagesError) {
          console.error('Erro ao buscar imagens:', imagesError);
        } else {
          console.log("Imagens carregadas:", carImages);
          setExistingImages(carImages || []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do anúncio.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchCarData();
    }
  }, [id, toast]);

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
      try {
        console.log("📸 Iniciando upload de imagens...");
        const resultadoUpload = await uploadImages(id);
        console.log(`✅ Upload de imagens concluído: ${resultadoUpload.length} imagens enviadas`);
      } catch (uploadError) {
        console.error("❌ Erro durante upload de imagens:", uploadError);
        // Continua mesmo com erro no upload
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
                    Adicione ou remova fotos do veículo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Fotos do Veículo</Label>
                    <ImageUploaderComponent 
                      carroId={id} 
                      imagensExistentes={existingImages}
                      maxImagens={10}
                      disabled={isSubmitting} 
                    />
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Atenção:</strong> Revise todas as informações antes de salvar as alterações.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("details")}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditCar; 