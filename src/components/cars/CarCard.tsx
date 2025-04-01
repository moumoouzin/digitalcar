import React from "react";
import { Link } from "react-router-dom";

export interface CarCardProps {
  id?: string;
  image: string;
  name: string;
  price: string;
  features: string[];
  compact?: boolean;
  carId?: string;
}

export const CarCard = ({
  id,
  image,
  name,
  price,
  features,
  compact = false,
  carId,
}: CarCardProps) => {
  const vehicleId = id || carId;
  
  return (
    <div className={`overflow-hidden bg-white rounded-lg shadow-lg ${compact ? "h-full" : ""}`}>
      <div className={`${compact ? "h-32" : "h-48"} relative`}>
        <img
          src={image || "/placeholder-car.jpg"}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold">{name}</h3>
        <p className="text-xl font-bold text-[#FF0000] mb-3">{price}</p>
        <div className="mb-4">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="mb-1 text-sm">
              ✓ {feature}
            </div>
          ))}
        </div>
        <Link
          to={vehicleId ? `/veiculo/${vehicleId}` : "#"}
          className="block w-full py-2 text-center text-white bg-[#FF0000] rounded-md hover:bg-red-700"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};
