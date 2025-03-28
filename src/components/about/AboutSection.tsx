
import React from "react";
import { ValueCard } from "./ValueCard";

export const AboutSection = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-8">SOBRE NÓS</h2>
        <div className="max-w-3xl mx-auto">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/729882791ee6a20adc8c9159e20b33212d13feaa"
            alt="Digital Car Store"
            className="w-full max-w-lg h-auto rounded-2xl mx-auto mb-8"
          />
          <p className="text-base font-medium mx-auto px-4">
            A Digital car é uma empresa que zela pela qualidade dos serviços
            prestados ao cliente. A empresa atua no ramo automotivo na compra e
            venda de veículos seminovos. Hoje a Digital Car possui uma equipe
            altamente treinada para te atender, por isso somos a loja que mais
            aprova do DF. Temos como principal objetivo negociar de maneira
            transparente e sincera com você para te levar a uma experiência única!
            Com veículos de procedência superior ao mercado de usados, sem
            dúvidas seremos a sua escolha mais inteligente, na hora de realizar o
            seu sonho.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        <ValueCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3b407da19bc7872d030c0433f1dc0cfbfa4da023"
          title="Alvo"
          description="Negociar os melhores veículos do mercado afim de atender e suas expectativas e ajudar a realizar seu sonho."
        />
        <ValueCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/98f2ec87878e647affad3f18cee391decc8538d2"
          title="Valores"
          description="Excelência em processos administrativos, agilidade, garantia de boa procedência, segurança e sua satisfação."
        />
        <ValueCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/288126476593524443e71cc092ba436cf7b2cc52"
          title="Visão"
          description="Ser a maior e melhor empresa no ramo de veículos seminovos na Capital e no entorno com diversas as marcas"
        />
      </div>
    </div>
  );
};
