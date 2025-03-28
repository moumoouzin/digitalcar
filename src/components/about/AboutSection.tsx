import React from "react";
import { ValueCard } from "./ValueCard";

export const AboutSection = () => {
  return (
    <>
      <div className="text-center mb-10">
        <div className="text-xs font-extrabold mb-5">SOBRE NÓS</div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/729882791ee6a20adc8c9159e20b33212d13feaa"
          alt="Digital Car Store"
          className="w-full max-w-[381px] h-[185px] rounded-[50px] mx-auto mb-[20px]"
        />
        <div className="text-xs font-bold max-w-[386px] mx-auto">
          A Digital car é uma empresa que zela pela qualidade dos serviços
          prestados ao cliente. A empresa atua no ramo automotivo na compra e
          venda de veículos seminovos. Hoje a Digital Car possui uma equipe
          altamente treinada para te atender, por isso somos a loja que mais
          aprova do DF. Temos como principal objetivo negociar de maneira
          transparente e sincera com você para te levar a uma experiência única
          ! Com veículos de procedência superior ao mercado de usados, sem
          dúvidas seremos a sua escolha mais inteligente, na hora de realizar o
          seu sonho.
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 mb-10 max-sm:grid-cols-1">
        <ValueCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3b407da19bc7872d030c0433f1dc0cfbfa4da023"
          title="Alvo"
          description="Negociar os melhores veículos do mercado afim de atender e suas expectativas e ajudar a realizar seu sonho."
        />
        <ValueCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/98f2ec87878e647affad3f18cee391decc8538d2"
          title="Valores"
          description="Excelência em processos administrativos, agilidade, garantia de boa procedência,segurança e sua satisfação."
        />
        <ValueCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/288126476593524443e71cc092ba436cf7b2cc52"
          title="Visão"
          description="Ser a maior e melhor empresa no ramo de veículos seminovos na Capital e no entorno com diversas as marcas"
        />
      </div>
    </>
  );
};
