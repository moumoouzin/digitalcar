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
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

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
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + uploadedImages.length > 10) {
        toast({
          title: "Limite de imagens excedido",
          description: "Você pode fazer upload de no máximo 10 imagens.",
          variant: "destructive",
        });
        return;
      }

      const newImages = [...uploadedImages, ...files];
      setUploadedImages(newImages);

      const newImagePreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    const newImagePreviews = [...imagePreviewUrls];

    URL.revokeObjectURL(newImagePreviews[index]);

    newImages.splice(index, 1);
    newImagePreviews.splice(index, 1);

    setUploadedImages(newImages);
    setImagePreviewUrls(newImagePreviews);
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((current) =>
      current.includes(featureId)
        ? current.filter((id) => id !== featureId)
        : [...current, featureId]
    );
  };

  const uploadImageToSupabase = async (file: File, carId: string, isPrimary: boolean = false): Promise<string | null> => {
    try {
      console.log('Iniciando upload para car_id:', carId, 'isPrimary:', isPrimary);
      
      // Check if bucket exists and create if needed
      const { data: buckets } = await supabase
        .storage
        .listBuckets();
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'car-images');
      
      if (!bucketExists) {
        console.log('Bucket car-images não existe, criando...');
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('car-images', { public: true });
          
        if (createBucketError) {
          console.error('Erro ao criar bucket:', createBucketError);
          throw createBucketError;
        }
      }
      
      // Generate unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${carId}/${uuidv4()}.${fileExt}`;
      
      console.log('Fazendo upload do arquivo:', fileName);
      const { data, error } = await supabase.storage
        .from('car-images')
        .upload(fileName, file);

      if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw error;
      }

      console.log('Upload concluído com sucesso:', data);
      
      const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/car-images/${fileName}`;
      console.log('URL da imagem:', imageUrl);
      
      // Save image record to database
      const { error: insertError } = await supabase
        .from('car_images')
        .insert({
          car_id: carId,
          image_url: imageUrl,
          is_primary: isPrimary
        });
        
      if (insertError) {
        console.error('Erro ao registrar imagem no banco de dados:', insertError);
        throw insertError;
      }

      return imageUrl;
    } catch (error) {
      console.error('Erro ao processar upload da imagem:', error);
      throw error;
    }
  };

  const onSubmit = async (data: CarFormValues) => {
    console.log("Iniciando envio do formulário...");
    try {
      setIsSubmitting(true);
      
      // Parse the price string to a number, removing non-numeric characters
      const priceAsNumber = parseFloat(data.price.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      
      const newCar = {
        title: data.title,
        price: priceAsNumber, // Convertida para número após remover caracteres não numéricos
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

      console.log("Dados do carro:", newCar);

      // Insert car data and get the new ID
      const { data: carData, error } = await supabase
        .from('car_ads')
        .insert(newCar)
        .select('id')
        .single();

      if (error) {
        console.error("Erro ao inserir anúncio:", error);
        throw error;
      }

      if (!carData) {
        throw new Error("Não foi possível obter o ID do anúncio criado");
      }

      const carId = carData.id;
      console.log("Anúncio criado com ID:", carId);

      // Insert selected features
      if (selectedFeatures.length > 0) {
        const featureObjects = selectedFeatures.map(featureId => ({
          car_id: carId,
          feature_id: featureId
        }));

        console.log("Salvando features:", featureObjects);
        const { error: featuresError } = await supabase
          .from('car_features')
          .insert(featureObjects);

        if (featuresError) {
          console.error('Erro ao salvar características:', featuresError);
          // Continue even if features fail
        }
      }

      // Upload images
      if (uploadedImages.length > 0) {
        console.log(`Iniciando upload de ${uploadedImages.length} imagens...`);
        const uploadPromises = uploadedImages.map((file, index) => 
          uploadImageToSupabase(file, carId, index === 0) // First image is primary
            .catch(err => {
              console.error(`Erro no upload da imagem ${index}:`, err);
              return null; // Return null for failed uploads but don't break the process
            })
        );

        const results = await Promise.all(uploadPromises);
        console.log("Upload de imagens concluído com resultados:", results);
      } else {
        console.log("Nenhuma imagem para fazer upload");
      }

      toast({
        title: "Anúncio criado com sucesso!",
        description: "Seu anúncio foi enviado para aprovação.",
        variant: "default",
      });

      navigate("/admin/painel/cars");
    } catch (error: any) {
      console.error('Erro ao criar anúncio:', error);
      toast({
        title: "Erro ao criar anúncio",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Criar Novo Anúncio</h1>
        <p className="text-muted-foreground mt-1">
          Preencha o formulário abaixo para cadastrar um novo veículo.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Preencha as informações essenciais do veículo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes e Opcionais</CardTitle>
            <CardDescription>
              Adicione mais detalhes e selecione os opcionais do veículo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fotos e Finalização</CardTitle>
            <CardDescription>
              Adicione fotos do veículo e revise as informações antes de publicar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photos">Fotos do Veículo</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG ou JPEG (máx. 10 imagens)
                      </p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadedImages.length >= 10}
                    />
                  </label>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Imagens selecionadas ({imagePreviewUrls.length}/10):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            onClick={() => removeImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Revise todas as informações antes de publicar o anúncio.
                Após a publicação, o anúncio passará por uma análise antes de ficar disponível no site.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Publicar Anúncio"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CreateCar;
