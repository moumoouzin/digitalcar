import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2Icon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useImageUploader } from "@/hooks/useImageUploader";

const carFormSchema = z.object({
  title: z.string().min(5, "O título precisa ter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição precisa ter pelo menos 20 caracteres"),
  model: z.string().min(1, "Selecione um modelo"),
  year: z.string().min(4, "Informe o ano do veículo"),
  price: z.string().min(1, "Informe o preço do veículo"),
  color: z.string().min(1, "Informe a cor do veículo"),
  transmission: z.string().min(1, "Selecione o tipo de câmbio"),
  mileage: z.string().min(1, "Informe a quilometragem"),
  whatsapp: z.string().min(11, "Informe um número de WhatsApp válido").max(15),
});

type CarFormValues = z.infer<typeof carFormSchema>;

const carBrands = [
  { name: "Toyota", models: ["Corolla", "Yaris", "Hilux", "SW4", "RAV4"] },
  { name: "Honda", models: ["Civic", "City", "Fit", "HR-V", "CR-V"] },
  { name: "Volkswagen", models: ["Gol", "Polo", "T-Cross", "Virtus", "Nivus"] },
  { name: "Chevrolet", models: ["Onix", "Tracker", "Cruze", "S10", "Spin"] },
  { name: "Fiat", models: ["Uno", "Argo", "Mobi", "Strada", "Toro"] },
  { name: "Hyundai", models: ["HB20", "Creta", "Tucson", "i30", "Santa Fe"] },
  { name: "Jeep", models: ["Renegade", "Compass", "Commander", "Wrangler"] },
  { name: "Ford", models: ["Ka", "EcoSport", "Ranger", "Bronco", "Territory"] },
  { name: "Nissan", models: ["Versa", "Sentra", "Kicks", "Frontier"] },
  { name: "Renault", models: ["Kwid", "Sandero", "Logan", "Duster", "Captur"] },
];

const carFeatures = [
  { id: "air-conditioning", label: "Ar-condicionado" },
  { id: "power-steering", label: "Direção Hidráulica" },
  { id: "electric-windows", label: "Vidros Elétricos" },
  { id: "abs", label: "Freios ABS" },
  { id: "airbags", label: "Airbags" },
  { id: "alarm", label: "Alarme" },
  { id: "central-lock", label: "Trava Central" },
  { id: "leather-seats", label: "Bancos de Couro" },
  { id: "alloy-wheels", label: "Rodas de Liga Leve" },
  { id: "parking-sensor", label: "Sensor de Estacionamento" },
  { id: "reverse-camera", label: "Câmera de Ré" },
  { id: "roof-rack", label: "Rack de Teto" },
  { id: "sunroof", label: "Teto Solar" },
  { id: "integrated-gps", label: "GPS Integrado" },
  { id: "bluetooth", label: "Bluetooth" },
  { id: "cruise-control", label: "Piloto Automático" },
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 30; i--) {
    years.push(i.toString());
  }
  return years;
};

const CreateCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { ImageUploaderComponent, uploadImages, isUploading } = useImageUploader();
  
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customBrand, setCustomBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customYear, setCustomYear] = useState("");
  const [customTransmission, setCustomTransmission] = useState("");
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [isCustomYear, setIsCustomYear] = useState(false);
  const [isCustomTransmission, setIsCustomTransmission] = useState(false);

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

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((current) =>
      current.includes(featureId)
        ? current.filter((id) => id !== featureId)
        : [...current, featureId]
    );
  };

  const onSubmit = async (data: CarFormValues) => {
    console.log("🚗 Iniciando envio do formulário...");
    try {
      setIsSubmitting(true);
      
      // 1. Preparar dados do carro
      const newCar = {
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
        status: "pending", 
      };
      
      console.log("📋 Dados do carro:", newCar);
      
      // 2. Inserir dados do carro e obter o ID
      const { data: carData, error } = await supabase
        .from('car_ads')
        .insert(newCar)
        .select('id')
        .single();
        
      if (error) {
        console.error("❌ Erro ao inserir anúncio:", error);
        throw error;
      }
      
      if (!carData) {
        throw new Error("Não foi possível obter o ID do anúncio criado");
      }
      
      const carId = carData.id;
      console.log("✅ Anúncio criado com ID:", carId);
      
      // 3. Inserir características selecionadas
      if (selectedFeatures.length > 0) {
        const featureObjects = selectedFeatures.map(featureId => ({
          car_id: carId,
          feature_id: featureId
        }));
        
        console.log("🔍 Salvando características:", featureObjects);
        const { error: featuresError } = await supabase
          .from('car_features')
          .insert(featureObjects);
          
        if (featuresError) {
          console.error('❌ Erro ao salvar características:', featuresError);
          // Continua mesmo com erro nas características
        }
      }
      
      // 4. Fazer upload das imagens
      console.log("📸 Iniciando upload de imagens para ID:", carId);
      try {
        const resultadoUpload = await uploadImages(carId);
        console.log(`✅ Upload de imagens concluído: ${resultadoUpload.length} imagens enviadas`, resultadoUpload);
        
        if (resultadoUpload.length === 0) {
          console.warn("⚠️ Nenhuma imagem foi enviada");
        }
      } catch (uploadError) {
        console.error("❌ Erro durante upload de imagens:", uploadError);
        toast({
          title: "Aviso",
          description: "O anúncio foi criado, mas pode haver problemas com as imagens.",
          variant: "destructive",
        });
      }
      
      // 5. Notificar sucesso e redirecionar
      toast({
        title: "Anúncio criado com sucesso!",
        description: "Seu anúncio foi enviado para aprovação.",
        variant: "default",
      });
      
      navigate("/admin/painel/cars");
    } catch (error: any) {
      console.error('❌ Erro ao criar anúncio:', error);
      toast({
        title: "Erro ao criar anúncio",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const BasicInfoForm = ({ onNext }: { onNext: () => void }) => (
    <div className="space-y-6">
      <div className="space-y-2 form-section">
        <Label htmlFor="title">Título do Anúncio</Label>
        <Input
          id="title"
          placeholder="Ex: Honda Civic EXL 2020 Completo"
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 form-section">
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          {!isCustomBrand ? (
            <Select
              onValueChange={(value) => {
                if (value === "outro") {
                  setIsCustomBrand(true);
                  setSelectedBrand("");
                  form.setValue("model", "");
                } else {
                  setSelectedBrand(value);
                  form.setValue("model", "");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a marca" />
              </SelectTrigger>
              <SelectContent>
                {carBrands.map((brand) => (
                  <SelectItem key={brand.name} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite a marca"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCustomBrand(false);
                    setCustomBrand("");
                  }}
                  size="sm"
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          {!isCustomModel ? (
            <Select
              onValueChange={(value) => {
                if (value === "outro") {
                  setIsCustomModel(true);
                  form.setValue("model", "");
                } else {
                  form.setValue("model", value);
                }
              }}
              disabled={!selectedBrand && !isCustomBrand}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                {selectedBrand &&
                  carBrands
                    .find((brand) => brand.name === selectedBrand)
                    ?.models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Digite o modelo"
                value={customModel}
                onChange={(e) => {
                  setCustomModel(e.target.value);
                  form.setValue("model", e.target.value);
                }}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsCustomModel(false);
                  setCustomModel("");
                }}
                size="sm"
              >
                Voltar
              </Button>
            </div>
          )}
          {form.formState.errors.model && (
            <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 form-section">
        <div className="space-y-2">
          <Label htmlFor="year">Ano</Label>
          {!isCustomYear ? (
            <Select 
              onValueChange={(value) => {
                if (value === "outro") {
                  setIsCustomYear(true);
                  form.setValue("year", "");
                } else {
                  form.setValue("year", value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {generateYears().map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Digite o ano"
                value={customYear}
                onChange={(e) => {
                  setCustomYear(e.target.value);
                  form.setValue("year", e.target.value);
                }}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsCustomYear(false);
                  setCustomYear("");
                }}
                size="sm"
              >
                Voltar
              </Button>
            </div>
          )}
          {form.formState.errors.year && (
            <p className="text-sm text-red-500">{form.formState.errors.year.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            placeholder="Ex: 75000"
            {...form.register("price")}
          />
          {form.formState.errors.price && (
            <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 form-section">
        <Label htmlFor="description">Descrição do Veículo</Label>
        <Textarea
          id="description"
          placeholder="Descreva o veículo com detalhes. Informe condições, diferenciais e outros aspectos relevantes."
          rows={6}
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2 form-section">
        <Label htmlFor="whatsapp">Número de WhatsApp para Contato</Label>
        <Input
          id="whatsapp"
          placeholder="Ex: 61981974187"
          {...form.register("whatsapp")}
        />
        <p className="text-xs text-muted-foreground">
          Insira apenas números, incluindo DDD, sem espaços ou caracteres especiais.
        </p>
        {form.formState.errors.whatsapp && (
          <p className="text-sm text-red-500">{form.formState.errors.whatsapp.message}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button type="button" onClick={onNext}>
          Próximo
        </Button>
      </div>
    </div>
  );

  const DetailsForm = ({ onPrevious, onNext }: { onPrevious: () => void, onNext: () => void }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 form-section">
        <div className="space-y-2">
          <Label htmlFor="color">Cor</Label>
          <Input
            id="color"
            placeholder="Ex: Preto"
            {...form.register("color")}
          />
          {form.formState.errors.color && (
            <p className="text-sm text-red-500">{form.formState.errors.color.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Câmbio</Label>
          {!isCustomTransmission ? (
            <Select 
              onValueChange={(value) => {
                if (value === "outro") {
                  setIsCustomTransmission(true);
                  form.setValue("transmission", "");
                } else {
                  form.setValue("transmission", value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o câmbio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automatic">Automático</SelectItem>
                <SelectItem value="cvt">CVT</SelectItem>
                <SelectItem value="semi-automatic">Semi-automático</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Digite o tipo de câmbio"
                value={customTransmission}
                onChange={(e) => {
                  setCustomTransmission(e.target.value);
                  form.setValue("transmission", e.target.value);
                }}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsCustomTransmission(false);
                  setCustomTransmission("");
                }}
                size="sm"
              >
                Voltar
              </Button>
            </div>
          )}
          {form.formState.errors.transmission && (
            <p className="text-sm text-red-500">
              {form.formState.errors.transmission.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Quilometragem</Label>
          <Input
            id="mileage"
            placeholder="Ex: 45000"
            {...form.register("mileage")}
          />
          {form.formState.errors.mileage && (
            <p className="text-sm text-red-500">{form.formState.errors.mileage.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 form-section">
        <Label>Características e Opcionais</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {carFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={feature.id}
                checked={selectedFeatures.includes(feature.id)}
                onCheckedChange={() => toggleFeature(feature.id)}
              />
              <label
                htmlFor={feature.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Voltar
        </Button>
        <Button type="button" onClick={onNext}>
          Próximo
        </Button>
      </div>
    </div>
  );

  const PhotosForm = ({ onPrevious }: { onPrevious: () => void }) => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="font-medium">Fotos do Veículo</p>
          <p className="text-sm text-muted-foreground mb-4">
            Adicione até 10 fotos do veículo. A primeira imagem será usada como capa.
          </p>
          <ImageUploaderComponent 
            maxImagens={10} 
            disabled={isSubmitting || isUploading}
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Atenção:</strong> Revise todas as informações antes de publicar o anúncio.
          Após a publicação, o anúncio passará por uma análise antes de ficar disponível no site.
        </p>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Voltar
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting || isUploading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              {isUploading ? "Enviando imagens..." : "Enviando..."}
            </>
          ) : (
            "Publicar Anúncio"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Criar Novo Anúncio</h1>
        <p className="text-muted-foreground mt-1">
          Preencha o formulário abaixo para cadastrar um novo veículo.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs 
          defaultValue="info" 
          className="w-full create-car-tabs" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <div className="tabs-list-container overflow-x-auto">
            <TabsList className="w-full mb-2 tabs-list">
              <TabsTrigger value="info" className="tabs-trigger">Informações Básicas</TabsTrigger>
              <TabsTrigger value="details" className="tabs-trigger">Detalhes e Opcionais</TabsTrigger>
              <TabsTrigger value="photos" className="tabs-trigger">Fotos e Finalização</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="tab-header">Informações Básicas</CardTitle>
                <CardDescription>
                  Preencha as informações essenciais do veículo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BasicInfoForm onNext={() => setActiveTab("details")} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="tab-header">Detalhes e Opcionais</CardTitle>
                <CardDescription>
                  Adicione mais detalhes e selecione os opcionais do veículo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DetailsForm
                  onPrevious={() => setActiveTab("info")}
                  onNext={() => setActiveTab("photos")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="tab-header">Fotos e Finalização</CardTitle>
                <CardDescription>
                  Adicione fotos do veículo e revise as informações antes de publicar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PhotosForm
                  onPrevious={() => setActiveTab("details")}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default CreateCar;
