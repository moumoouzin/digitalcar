
import React from "react";
import { FileText, User, Building, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export const DocumentsStep = ({ files, onFilesChange }) => {
  const handleFileChange = (type) => (e) => {
    if (e.target.files && e.target.files[0]) {
      onFilesChange({
        ...files,
        [type]: e.target.files[0]
      });
    }
  };
  
  const DocumentCard = ({ icon: Icon, title, fileType, file }) => {
    return (
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center h-40">
        <Icon className="w-8 h-8 mb-2 text-gray-700" />
        <span className="text-sm text-center font-medium mb-3">{title}</span>
        
        <label className={cn(
          "relative cursor-pointer flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm",
          file ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        )}>
          <input 
            type="file" 
            className="sr-only" 
            onChange={handleFileChange(fileType)}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <Upload className="h-4 w-4" />
          {file ? file.name.substring(0, 15) + (file.name.length > 15 ? '...' : '') : "Anexar arquivo"}
        </label>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Documentos necessários</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <DocumentCard 
          icon={FileText} 
          title="Comprovante de Residência" 
          fileType="residenceProof"
          file={files.residenceProof}
        />
        
        <DocumentCard 
          icon={Building} 
          title="Comprovante de Renda" 
          fileType="incomeProof"
          file={files.incomeProof}
        />
        
        <DocumentCard 
          icon={User} 
          title="CNH" 
          fileType="driverLicense"
          file={files.driverLicense}
        />
      </div>
      
      <p className="mt-6 text-sm text-gray-600">
        Para dar continuidade ao seu financiamento, você precisará anexar estes documentos.
        Clique nos botões acima para fazer o upload dos documentos necessários e prosseguir com a solicitação.
      </p>
    </div>
  );
};
