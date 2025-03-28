import React from "react";
import { CarCard } from "./CarCard";

export const CarHighlights = () => {
  return (
    <div className="bg-neutral-800 mb-10 p-5">
      <div className="text-white text-[13px] font-extrabold mb-[5px]">
        Nossos Destaques
      </div>
      <div className="w-[119px] h-0.5 bg-[#F00] mb-5" />
      <div className="grid grid-cols-3 gap-5 max-sm:grid-cols-1">
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/b20c7304f7e42390cf4d6e6cba09b0967971384b"
          name="Jeep Renegade 1.9"
          price="R$69.900"
          features={["Bancos de Couro", "Piloto Automático"]}
        />
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/6268af9d2847f1916069fb0ecd9b13d06c7e57d0"
          name="Fiat Strada Freedom"
          price="R$79.900"
          features={["2020-2021", "Comando no Volante"]}
        />
        <CarCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/1326335909abdf93418d99a8b827cffe82d9d0ac"
          name="Honda HR-V 1.8"
          price="R$96.900"
          features={["2015-2016", "Câmbio automático"]}
        />
      </div>
    </div>
  );
};
