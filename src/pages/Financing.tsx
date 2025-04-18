
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
      
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">A DIGITAL FACILITA PARA VOCÊ</h1>
        <p className="mb-6 sm:mb-8 text-gray-800 text-sm sm:text-base">
          Trabalhando com as maiores financeiras com você podendo financiar até 100% do valor do
          veículo, podendo também parcelar o valor em até 60x.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Documentos necessários</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex flex-col items-center mb-4">
                <h3 className="font-medium text-center">Comprovante de Residência</h3>
              </div>
              <p className="text-sm text-gray-600">
                Conta de luz, água, telefone ou internet dos últimos 3 meses.
              </p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex flex-col items-center mb-4">
                <h3 className="font-medium text-center">Comprovante de Renda</h3>
              </div>
              <p className="text-sm text-gray-600">
                Holerite, extrato bancário ou declaração de IR.
              </p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex flex-col items-center mb-4">
                <h3 className="font-medium text-center">CNH ou RG</h3>
              </div>
              <p className="text-sm text-gray-600">
                Documento de identificação válido e com foto.
              </p>
            </div>
          </div>
          
          <div className="mt-6 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Informações importantes:</h3>
            <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
              <li>Os documentos devem estar legíveis e completos</li>
              <li>Formatos aceitos: PDF, JPG ou PNG</li>
              <li>Tamanho máximo por arquivo: 5MB</li>
              <li>Para dar continuidade ao seu financiamento, todos os documentos acima são obrigatórios</li>
            </ul>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Financing;
