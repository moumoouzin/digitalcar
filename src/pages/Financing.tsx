
import React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Financing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation />
      
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold text-red-600 mb-2">A DIGITAL FACILITA PARA VOCÊ</h1>
          <p className="mb-6 sm:mb-8 text-gray-800 text-sm sm:text-base">
            Trabalhando com as maiores financeiras com você podendo financiar até 100% do valor do
            veículo, podendo também parcelar o valor em até 60x.
          </p>
        
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mb-8">
              <p className="text-lg text-gray-800 mb-6">
                Para iniciar seu financiamento, clique no botão abaixo e preencha o formulário de solicitação.
              </p>
              
              <p className="text-sm text-gray-600 mb-8">
                Nossa equipe entrará em contato com você em breve para dar continuidade ao processo.
              </p>
            </div>

            <div className="flex justify-center">
              <a 
                href="https://forms.gle/uC6qKDtuPpP8LG3eA" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="flex items-center gap-2 text-base px-8 py-6">
                  Solicitar Financiamento
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Financing;
