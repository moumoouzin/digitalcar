
import React, { useRef, useCallback, useState } from 'react';
import ImageUploader, { ImageUploaderFunctions } from '@/components/ImageUploader';
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook personalizado para acessar o ImageUploader de forma imperativa
 * 
 * Exemplo de uso:
 * ```tsx
 * const { ImageUploaderComponent, uploadImages, isUploading } = useImageUploader();
 * 
 * // Render do componente de upload
 * <ImageUploaderComponent carroId={id} imagensExistentes={existingImages} />
 * 
 * // Chamada imperativa para upload quando necessário
 * const handleSubmit = async () => {
 *   const imagesUrls = await uploadImages(carId);
 *   console.log('Imagens enviadas:', imagesUrls);
 * };
 * ```
 */
export const useImageUploader = () => {
  // Ref para armazenar as funções do uploader
  const uploaderRef = useRef<ImageUploaderFunctions | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // Função para registrar o uploader
  const registerUploader = useCallback((uploader: ImageUploaderFunctions) => {
    console.log("🔄 Registrando funções do uploader");
    uploaderRef.current = uploader;
  }, []);
  
  // Função para realizar upload das imagens
  const uploadImages = useCallback(async (carroId: string): Promise<string[]> => {
    if (!carroId) {
      console.error("🚫 Tentativa de upload sem ID do carro");
      toast({
        title: "Erro no upload",
        description: "ID do carro não fornecido",
        variant: "destructive",
      });
      return [];
    }
    
    setIsUploading(true);
    console.log("🚀 Iniciando processo de upload para o carro ID:", carroId);
    
    try {
      if (uploaderRef.current) {
        console.log("✅ Uploader está pronto, chamando função de upload");
        const result = await uploaderRef.current.uploadImagensPendentes(carroId);
        console.log(`✅ Upload concluído: ${result.length} imagens enviadas`);
        
        if (result.length > 0) {
          toast({
            title: "Upload concluído",
            description: `${result.length} imagens enviadas com sucesso`,
            variant: "default",
          });
        }
        
        return result;
      }
      
      console.warn("🔴 ImageUploader não está registrado ou não está pronto");
      toast({
        title: "Erro no upload",
        description: "O componente de upload não está inicializado",
        variant: "destructive",
      });
      return [];
    } catch (error) {
      console.error("❌ Erro durante o processo de upload:", error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro durante o upload das imagens",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [toast]);
  
  // Componente com registro automático
  const ImageUploaderComponent = useCallback(
    (props: Omit<React.ComponentProps<typeof ImageUploader>, 'onRegister'>) => {
      console.log("🔄 Renderizando ImageUploaderComponent", { carroId: props.carroId });
      return <ImageUploader {...props} onRegister={registerUploader} />;
    },
    [registerUploader]
  );
  
  return {
    ImageUploaderComponent,
    uploadImages,
    isUploading
  };
};

export default useImageUploader;
