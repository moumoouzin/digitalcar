import React from "react";
import { CarCard } from "./CarCard";

export const FeaturedCars = () => {
  return (
    <div className="bg-[#D9D9D9] mb-10 p-5 rounded-lg">
      <div className="flex gap-5 overflow-x-auto">
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/5a31f9e49e1c83e28e34b3e46ac555552fb82580"
          name="Honda HR-V"
          features={["Som original", "2020-2021"]}
          compact
        />
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/01b66cfb02848421fef34f11a70414649581c5ab"
          name="Honda HR-V"
          features={["Sensor de ré", "2015-2016"]}
          compact
        />
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/7924ddaa4c66029a336d6a7e27aeb8efac7d9719"
          name="Hyundai HB20"
          features={["Rodas liga leve", "2020-2020"]}
          compact
        />
      </div>
    </div>
  );
};
