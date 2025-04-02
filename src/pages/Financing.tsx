
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { FinancingForm } from "@/components/financing/FinancingForm";

const Financing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-2">A DIGITAL FACILITA PARA VOCÊ</h1>
        <p className="mb-8 text-gray-800">
          Trabalhando com as maiores financeiras com você podendo financiar até 100% do valor do
          veículo, podendo também parcelar o valor em até 60x.
        </p>
        
        <FinancingForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Financing;
