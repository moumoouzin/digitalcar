
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
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
import { carFormSchema, CarFormValues } from "./cars/types";
import { useImageUploader } from "@/hooks/useImageUploader";
import { Button } from "@/components/ui/button";

const EditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ImageUploaderComponent, uploadImages, isUploading } = useImageUploader();

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
        
        if (!id) {
          throw new Error("ID do carro não encontrado");
        }
        
        console.log("🔍 Buscando imagens para o carro ID:", id);
        
        // Verificar se o bucket de imagens existe
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.error('❌ Erro ao listar buckets:', bucketsError);
          toast({
            title: "Aviso",
            description: "Não foi possível verificar o armazenamento de imagens",
            variant: "destructive",
          });
        } else {
          const bucketExists = buckets.some(b => b.name === 'car-images');
          console.log(`ℹ️ Bucket 'car-images' ${bucketExists ? 'existe' : 'NÃO existe'}`);
        }
        
        // Buscar imagens existentes
        const { data: carImages, error: imagesError } = await supabase
          .from('car_images')
          .select('*')
          .eq('car_id', id);
          
        if (imagesError) {
          console.error('❌ Erro ao buscar imagens:', imagesError);
          toast({
            title: "Erro ao carregar imagens",
            description: "Não foi possível carregar as imagens do carro",
            variant: "destructive",
          });
        } else {
          console.log("✅ Imagens carregadas:", carImages);
          setExistingImages(carImages || []);
        }
      } catch (error: any) {
        console.error('❌ Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar os dados do anúncio.",
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
      console.log("🔄 Iniciando atualização do anúncio");
      
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

      console.log("📋 Dados do anúncio para atualização:", updatedCar);

      const { error } = await supabase
        .from('car_ads')
        .update(updatedCar)
        .eq('id', id);

      if (error) {
        console.error("❌ Erro ao atualizar dados do anúncio:", error);
        throw error;
      }
      
      console.log("✅ Dados do anúncio atualizados com sucesso");

      // Atualizar características
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
          console.error('❌ Erro ao salvar recursos:', featuresError);
          toast({
            title: "Aviso",
            description: "Algumas características podem não ter sido salvas corretamente.",
            variant: "destructive",
          });
        } else {
          console.log(`✅ ${selectedFeatures.length} recursos salvos com sucesso`);
        }
      }

      // Processar imagens enviadas
      try {
        console.log("📸 Iniciando upload de imagens...");
        const resultadoUpload = await uploadImages(id);
        console.log(`✅ Upload de imagens concluído: ${resultadoUpload.length} imagens enviadas`);
        
        if (resultadoUpload.length > 0) {
          // Verificando se o upload foi bem-sucedido com uma consulta adicional
          const { data: carImages, error: imagesError } = await supabase
            .from('car_images')
            .select('*')
            .eq('car_id', id);
            
          if (imagesError) {
            console.error('❌ Erro ao verificar imagens após upload:', imagesError);
          } else {
            console.log("✅ Verificação após upload: ", carImages?.length, " imagens encontradas");
          }
        }
      } catch (uploadError: any) {
        console.error("❌ Erro durante upload de imagens:", uploadError);
        toast({
          title: "Aviso",
          description: "Algumas imagens podem não ter sido salvas corretamente.",
          variant: "destructive",
        });
      }

      toast({
        title: "Anúncio atualizado com sucesso!",
        description: "As alterações foram salvas.",
        variant: "default",
      });

      navigate("/admin/painel/cars");
    } catch (error: any) {
      console.error('❌ Erro ao atualizar anúncio:', error);
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
                    <div className="space-y-2">
                      <p className="font-medium">Fotos do Veículo</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Adicione até 10 fotos do veículo. A primeira imagem será usada como capa.
                      </p>
                      
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>Importante:</strong> As imagens serão enviadas quando você clicar no botão "Salvar Alterações".
                          Você pode adicionar várias imagens antes de salvar.
                        </p>
                      </div>
                      
                      <ImageUploaderComponent 
                        carroId={id} 
                        imagensExistentes={existingImages}
                        maxImagens={10}
                        disabled={isSubmitting || isUploading} 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Atenção:</strong> Revise todas as informações antes de salvar as alterações.
                      As imagens serão salvas quando você clicar no botão "Salvar Alterações".
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
                    disabled={isSubmitting || isUploading}
                  >
                    {isSubmitting || isUploading ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        {isUploading ? "Enviando imagens..." : "Salvando..."}
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
