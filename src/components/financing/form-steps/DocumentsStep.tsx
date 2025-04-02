
import React from "react";
import { FileText, User, Building } from "lucide-react";

export const DocumentsStep = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Documentos necessários</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center h-32">
          <FileText className="w-8 h-8 mb-2 text-gray-700" />
          <span className="text-sm text-center font-medium">Comprovante de Residência</span>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center h-32">
          <Building className="w-8 h-8 mb-2 text-gray-700" />
          <span className="text-sm text-center font-medium">Comprovante de Renda</span>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center h-32">
          <User className="w-8 h-8 mb-2 text-gray-700" />
          <span className="text-sm text-center font-medium">CNH</span>
        </div>
      </div>
      
      <p className="mt-6 text-sm text-gray-600">
        Para dar continuidade ao seu financiamento, você precisará ter em mãos estes documentos. 
        Prossiga para preencher as informações necessárias para sua solicitação.
      </p>
    </div>
  );
};
