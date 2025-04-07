import { v4 as uuidv4 } from "uuid";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useImageHandling = () => {
  const { toast } = useToast();

  const uploadImageToSupabase = async (file: File, carId: string, isPrimary: boolean = false): Promise<string | null> => {
    try {
      // Verificar se o bucket existe
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'car-images');
      
      if (!bucketExists) {
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('car-images', { public: true });
          
        if (createBucketError) {
          throw createBucketError;
        }
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${carId}/${uuidv4()}.${fileExt}`;
      
      // Upload da imagem
      const { data, error } = await supabase.storage
        .from('car-images')
        .upload(uniqueFileName, file, {
          upsert: true // Permitir substituição se arquivo existir
        });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Upload falhou - nenhum dado retornado');
      }
      
      // Gerar URL pública
      const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/car-images/${uniqueFileName}`;
      
      // Verificar se já existe uma imagem primária
      if (isPrimary) {
        const { data: existingPrimary } = await supabase
          .from('car_images')
          .select('id')
          .eq('car_id', carId)
          .eq('is_primary', true)
          .single();

        if (existingPrimary) {
          // Atualizar imagem existente para não ser mais primária
          await supabase
            .from('car_images')
            .update({ is_primary: false })
            .eq('id', existingPrimary.id);
        }
      }

      // Salvar registro da imagem
      const { error: insertError } = await supabase
        .from('car_images')
        .insert({
          car_id: carId,
          image_url: imageUrl,
          is_primary: isPrimary
        });
        
      if (insertError) {
        throw insertError;
      }

      return imageUrl;
    } catch (error: any) {
      console.error('Erro no upload da imagem:', error);
      toast({
        title: "Erro no upload da imagem",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return null;
    }
  };

  const removeExistingImage = async (imageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('car_images')
        .delete()
        .eq('id', imageId);
        
      if (error) {
        toast({
          title: "Erro ao remover imagem",
          description: error.message || "Ocorreu um erro inesperado.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Imagem removida",
        description: "A imagem foi removida com sucesso.",
        variant: "default",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao remover imagem:', error);
      toast({
        title: "Erro ao remover imagem",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { uploadImageToSupabase, removeExistingImage };
};
