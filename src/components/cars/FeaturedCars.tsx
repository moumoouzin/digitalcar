
import React from "react";
import { CarCard } from "./CarCard";

export const FeaturedCars = () => {
  return (
    <div className="bg-neutral-100 mb-12 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">Veículos em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/5a31f9e49e1c83e28e34b3e46ac555552fb82580"
          name="Honda HR-V"
          price="R$ 120.900"
          features={["Som original", "2020-2021"]}
          compact
        />
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/01b66cfb02848421fef34f11a70414649581c5ab"
          name="Honda HR-V"
          price="R$ 92.500"
          features={["Sensor de ré", "2015-2016"]}
          compact
        />
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/7924ddaa4c66029a336d6a7e27aeb8efac7d9719"
          name="Hyundai HB20"
          price="R$ 75.990"
          features={["Rodas liga leve", "2020-2020"]}
          compact
        />
      </div>
    </div>
  );
};
