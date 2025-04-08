
import React, { useRef, useCallback, useState } from 'react';
import ImageUploader, { ImageUploaderFunctions } from '@/components/ImageUploader';
import { useToast } from "@/components/ui/use-toast";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";

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

  // Verificar se o bucket existe e criar se necessário
  const verifyBucket = useCallback(async (): Promise<boolean> => {
    console.log("🔍 Verificando bucket car-images no Supabase");
    try {
      // Verificar buckets existentes
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("❌ Erro ao listar buckets:", error);
        return false;
      }
      
      console.log("📋 Buckets disponíveis:", buckets?.map(b => b.name).join(", ") || "nenhum");
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'car-images');
      
      if (!bucketExists) {
        console.log("🆕 Bucket car-images não encontrado, tentando criar...");
        
        // Tentar criar o bucket
        const { error: createError } = await supabase.storage.createBucket('car-images', {
          public: true,
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
          console.error("❌ Erro ao criar bucket:", createError);
          toast({
            title: "Erro de configuração",
            description: "Não foi possível criar o bucket de armazenamento. Contate o administrador.",
            variant: "destructive",
          });
          return false;
        }
        
        console.log("✅ Bucket criado com sucesso");
        return true;
      }
      
      console.log("✅ Bucket car-images encontrado");
      return true;
    } catch (error) {
      console.error("❌ Erro ao verificar bucket:", error);
      toast({
        title: "Erro de configuração",
        description: "Não foi possível verificar o bucket de armazenamento",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);
  
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
      // Verificar primeiro se o bucket existe
      const bucketOk = await verifyBucket();
      if (!bucketOk) {
        throw new Error("Bucket de armazenamento não disponível");
      }
      
      if (uploaderRef.current) {
        console.log("✅ Uploader está pronto, chamando função de upload");
        // Testar primeiro com uma pequena consulta para garantir que as políticas de acesso estão corretas
        try {
          const testQuery = await supabase.from('car_images').select('id').limit(1);
          console.log("🔍 Teste de consulta SQL:", testQuery.error ? "erro" : "sucesso");
          
          if (testQuery.error) {
            console.error("❌ Erro no teste de consulta:", testQuery.error);
          }
        } catch (testError) {
          console.error("❌ Erro no teste de acesso ao banco:", testError);
        }
        
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
  }, [toast, verifyBucket]);
  
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
