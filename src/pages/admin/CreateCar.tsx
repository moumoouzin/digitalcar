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

// Schema de validação para o formulário
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

// Lista de marcas e modelos para o dropdown
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

// Features/extras que podem ser selecionados
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

// Anos para o dropdown
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
  const [activeTab, setActiveTab] = useState("info");

  // Inicializar o formulário com validação Zod
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

  // Função para lidar com upload de imagens
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

      // Criar URLs para os previews
      const newImagePreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviews]);
    }
  };

  // Função para remover uma imagem
  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    const newImagePreviews = [...imagePreviewUrls];

    // Revogar URL do objeto para liberar memória
    URL.revokeObjectURL(newImagePreviews[index]);

    newImages.splice(index, 1);
    newImagePreviews.splice(index, 1);

    setUploadedImages(newImages);
    setImagePreviewUrls(newImagePreviews);
  };

  // Função para alternar features selecionadas
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((current) =>
      current.includes(featureId)
        ? current.filter((id) => id !== featureId)
        : [...current, featureId]
    );
  };

  // Função para enviar o formulário
  const onSubmit = (data: CarFormValues) => {
    // Criar um novo objeto de anúncio com os dados do formulário
    const newCar = {
      id: Date.now().toString(), // ID único baseado no timestamp
      title: data.title,
      price: `R$ ${parseFloat(data.price).toLocaleString('pt-BR')}`,
      brand: selectedBrand,
      model: data.model,
      year: data.year,
      color: data.color,
      transmission: data.transmission,
      mileage: data.mileage,
      description: data.description,
      whatsapp: data.whatsapp,
      status: "pending", // Anúncios começam com status pendente
      createdAt: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
      views: 0,
      contacts: 0,
      features: selectedFeatures,
      images: imagePreviewUrls.length > 0 ? [imagePreviewUrls[0]] : [] // Salva pelo menos a primeira imagem como URL
    };

    // Recuperar anúncios existentes do localStorage ou iniciar com array vazio
    const existingCars = JSON.parse(localStorage.getItem("carsList") || "[]");
    
    // Adicionar o novo anúncio à lista
    const updatedCars = [newCar, ...existingCars];
    
    // Salvar a lista atualizada no localStorage
    localStorage.setItem("carsList", JSON.stringify(updatedCars));

    // Mostrar toast de sucesso
    toast({
      title: "Anúncio criado com sucesso!",
      description: "Seu anúncio foi enviado para aprovação.",
      variant: "default",
    });

    // Redirecionar para lista de anúncios
    navigate("/admin/painel/cars");
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Criar Novo Anúncio</h1>
        <p className="text-muted-foreground mt-1">
          Preencha o formulário abaixo para cadastrar um novo veículo.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="info" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações Básicas</TabsTrigger>
            <TabsTrigger value="details">Detalhes e Opcionais</TabsTrigger>
            <TabsTrigger value="photos">Fotos e Finalização</TabsTrigger>
          </TabsList>

          {/* Tab 1: Informações Básicas */}
          <TabsContent value="info" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Preencha as informações essenciais do veículo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Título do Anúncio */}
                <div className="space-y-2">
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

                {/* Marca e Modelo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedBrand(value);
                        form.setValue("model", "");
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Select
                      onValueChange={(value) => form.setValue("model", value)}
                      disabled={!selectedBrand}
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
                      </SelectContent>
                    </Select>
                    {form.formState.errors.model && (
                      <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
                    )}
                  </div>
                </div>

                {/* Ano e Preço */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Ano</Label>
                    <Select onValueChange={(value) => form.setValue("year", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateYears().map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                {/* Descrição */}
                <div className="space-y-2">
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

                {/* WhatsApp */}
                <div className="space-y-2">
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
              <CardFooter>
                <Button 
                  type="button" 
                  className="ml-auto"
                  onClick={() => setActiveTab("details")}
                >
                  Próximo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tab 2: Detalhes e Opcionais */}
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes e Opcionais</CardTitle>
                <CardDescription>
                  Adicione mais detalhes e selecione os opcionais do veículo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cor, Câmbio e Quilometragem */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Select onValueChange={(value) => form.setValue("transmission", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o câmbio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automático</SelectItem>
                        <SelectItem value="cvt">CVT</SelectItem>
                        <SelectItem value="semi-automatic">Semi-automático</SelectItem>
                      </SelectContent>
                    </Select>
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

                {/* Lista de Opcionais/Features */}
                <div className="space-y-4">
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
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setActiveTab("info")}
                >
                  Voltar
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setActiveTab("photos")}
                >
                  Próximo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tab 3: Fotos e Finalização */}
          <TabsContent value="photos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fotos e Finalização</CardTitle>
                <CardDescription>
                  Adicione fotos do veículo e revise as informações antes de publicar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload de Fotos */}
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

                    {/* Preview de imagens */}
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

                {/* Aviso de Revisão */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> Revise todas as informações antes de publicar o anúncio.
                    Após a publicação, o anúncio passará por uma análise antes de ficar disponível no site.
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
                <Button type="submit">Publicar Anúncio</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default CreateCar; 