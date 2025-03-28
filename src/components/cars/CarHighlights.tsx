
import React from "react";
import { CarCard } from "./CarCard";

export const CarHighlights = () => {
  return (
    <div className="bg-neutral-800 mb-12 p-6 rounded-xl">
      <div className="flex items-center mb-6">
        <h2 className="text-white text-2xl font-bold">Nossos Destaques</h2>
        <div className="w-24 h-1 bg-[#FF0000] ml-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/b20c7304f7e42390cf4d6e6cba09b0967971384b"
          name="Jeep Renegade 1.9"
          price="R$ 69.900"
          features={["Bancos de Couro", "Piloto Automático"]}
        />
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/6268af9d2847f1916069fb0ecd9b13d06c7e57d0"
          name="Fiat Strada Freedom"
          price="R$ 79.900"
          features={["2020-2021", "Comando no Volante"]}
        />
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/1326335909abdf93418d99a8b827cffe82d9d0ac"
          name="Honda HR-V 1.8"
          price="R$ 96.900"
          features={["2015-2016", "Câmbio automático"]}
        />
      </div>
    </div>
  );
};
