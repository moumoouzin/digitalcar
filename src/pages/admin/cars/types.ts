import { z } from "zod";

export const carFormSchema = z.object({
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

export type CarFormValues = z.infer<typeof carFormSchema>;

export type CarFeature = {
  id: string;
  label: string;
};

export type CarBrand = {
  name: string;
  models: string[];
};

export type CarImage = {
  id: string;
  image_url: string;
  is_primary?: boolean;
};

export const carBrands: CarBrand[] = [
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

export const carFeatures: CarFeature[] = [
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

export const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 30; i--) {
    years.push(i.toString());
  }
  return years;
};
