
import React, { useState } from "react";
import { FileText, User, Building, Upload, Check, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createFinancingDocsBucket } from "@/integrations/supabase/createFinancingDocsBucket";

export const DocumentsStep = ({ files, onFilesChange }) => {
  const [uploading, setUploading] = useState({
    residenceProof: false,
    incomeProof: false,
    driverLicense: false
  });

  // Initialize the bucket when component loads
  React.useEffect(() => {
    const initBucket = async () => {
      await createFinancingDocsBucket();
    };
    initBucket();
  }, []);

  // Fix: Changed from returning a promise to a regular event handler
  const handleFileChange = (type) => (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O arquivo é muito grande. O tamanho máximo é 5MB.");
        return;
      }
      
      // Start the upload process
      uploadFile(type, file);
    }
  };
  
  // Extracted upload logic to a separate function
  const uploadFile = async (type, file) => {
    try {
      // Iniciar o upload
      setUploading(prev => ({ ...prev, [type]: true }));
      
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('financing-docs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Obter a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('financing-docs')
        .getPublicUrl(filePath);
        
      // Atualizar o estado com o arquivo e a URL
      onFilesChange({
        ...files,
        [type]: file,
        [`${type}Url`]: urlData.publicUrl
      });
      
      toast.success("Documento enviado com sucesso!");
    } catch (error) {
      console.error(`Erro ao fazer upload do arquivo ${type}:`, error);
      toast.error(`Erro ao enviar o documento: ${error.message || 'Tente novamente'}`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };
  
  const getFileSize = (file) => {
    if (!file) return '';
    
    const sizeInKB = file.size / 1024;
    if (sizeInKB < 1024) {
      return `${Math.round(sizeInKB)} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
  };
  
  const DocumentCard = ({ icon: Icon, title, fileType, file, description }) => {
    const isUploading = uploading[fileType];
    
    return (
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col h-full">
        <div className="flex flex-col items-center justify-center mb-4">
          <Icon className="w-8 h-8 mb-2 text-gray-700" />
          <span className="text-sm text-center font-medium">{title}</span>
        </div>
        
        {file ? (
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2 text-green-700 bg-green-50 p-2 rounded">
              <Check className="w-4 h-4" />
              <span className="text-xs font-medium">Arquivo anexado</span>
            </div>
            
            <div className="text-xs text-gray-500 mb-2 truncate">
              {file.name}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <span>Tamanho: {getFileSize(file)}</span>
              <span>Tipo: {file.type.split('/')[1]}</span>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => onFilesChange({
                ...files,
                [fileType]: null,
                [`${fileType}Url`]: null
              })}
              disabled={isUploading}
            >
              Remover e anexar outro
            </Button>
          </div>
        ) : (
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3 text-yellow-700 bg-yellow-50 p-2 rounded">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">Documento necessário</span>
            </div>
            
            {description && (
              <p className="text-xs text-gray-600 mb-3">{description}</p>
            )}
            
            <label className={cn(
              "relative cursor-pointer flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm bg-primary text-white hover:bg-primary/90 w-full",
              isUploading && "opacity-70 cursor-not-allowed"
            )}>
              <input 
                type="file" 
                className="sr-only" 
                onChange={handleFileChange(fileType)}
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isUploading}
              />
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Anexar arquivo</span>
                </>
              )}
            </label>
          </div>
        )}
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
          description="Conta de luz, água, telefone ou internet dos últimos 3 meses."
        />
        
        <DocumentCard 
          icon={Building} 
          title="Comprovante de Renda" 
          fileType="incomeProof"
          file={files.incomeProof}
          description="Holerite, extrato bancário ou declaração de IR."
        />
        
        <DocumentCard 
          icon={User} 
          title="CNH ou RG" 
          fileType="driverLicense"
          file={files.driverLicense}
          description="Documento de identificação válido e com foto."
        />
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Informações importantes:</h3>
        <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
          <li>Os documentos devem estar legíveis e completos.</li>
          <li>Formatos aceitos: PDF, JPG ou PNG.</li>
          <li>Tamanho máximo por arquivo: 5MB.</li>
          <li>Para dar continuidade ao seu financiamento, todos os documentos acima são obrigatórios.</li>
        </ul>
      </div>
    </div>
  );
};
