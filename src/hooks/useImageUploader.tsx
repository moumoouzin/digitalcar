import React, { useRef, useCallback } from 'react';
import ImageUploader, { ImageUploaderFunctions } from '@/components/ImageUploader';

/**
 * Hook personalizado para acessar o ImageUploader de forma imperativa
 * 
 * Exemplo de uso:
 * ```tsx
 * const { ImageUploaderComponent, uploadImages } = useImageUploader();
 * 
 * // Render do componente de upload
 * <ImageUploaderComponent carroId={id} />
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
  
  // Função para registrar o uploader
  const registerUploader = useCallback((uploader: ImageUploaderFunctions) => {
    uploaderRef.current = uploader;
  }, []);
  
  // Função para realizar upload das imagens
  const uploadImages = useCallback(async (carroId: string): Promise<string[]> => {
    if (uploaderRef.current) {
      return uploaderRef.current.uploadImagensPendentes(carroId);
    }
    console.warn('🔴 ImageUploader não está registrado ou não está pronto');
    return [];
  }, []);
  
  // Componente com registro automático
  const ImageUploaderComponent = useCallback(
    (props: Omit<React.ComponentProps<typeof ImageUploader>, 'onRegister'>) => {
      return <ImageUploader {...props} onRegister={registerUploader} />;
    },
    [registerUploader]
  );
  
  return {
    ImageUploaderComponent,
    uploadImages
  };
};

export default useImageUploader; 