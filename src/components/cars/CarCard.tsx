
import React from "react";
import { Link } from "react-router-dom";
import { CarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Feature translations from English to Portuguese
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

export function CarCard({
  id,
  name,
  price,
  image,
  features = [],
  compact = false,
}: {
  id: string;
  name: string;
  price: string;
  image: string;
  features?: string[];
  compact?: boolean;
}) {
  // Translate feature names to Portuguese
  const translatedFeatures = features.map(feature => 
    featureTranslations[feature] || feature
  );

  return (
    <Link
      to={`/veiculo/${id}`}
      className="group relative overflow-hidden rounded-lg border bg-white shadow transition-all hover:shadow-lg"
    >
      <div className="aspect-h-9 aspect-w-16 relative w-full overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <CarIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="p-3 sm:p-4">
        <h3
          className={`line-clamp-2 font-medium text-gray-900 ${
            compact ? "text-sm" : "text-base sm:text-lg"
          }`}
        >
          {name}
        </h3>
        <div
          className={`mt-1 font-semibold text-red-600 hover-scale ${
            compact ? "text-base" : "text-lg sm:text-xl"
          } animate-pulse`}
        >
          {price}
        </div>
        
        {!compact && translatedFeatures.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {translatedFeatures.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
