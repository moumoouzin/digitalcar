
import { v4 as uuidv4 } from "uuid";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useImageHandling = () => {
  const { toast } = useToast();

  const uploadImageToSupabase = async (file: File, carId: string, isPrimary: boolean = false): Promise<string | null> => {
    try {
      // Generate unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${carId}/${uuidv4()}.${fileExt}`;
      
      // Direct upload to storage bypassing bucket creation check
      const { data, error } = await supabase.storage
        .from('car-images')
        .upload(uniqueFileName, file, {
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }
      
      // Generate public URL for the uploaded image
      const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/car-images/${uniqueFileName}`;
      
      // Save image record to database
      const { error: insertError } = await supabase
        .from('car_images')
        .insert({
          car_id: carId,
          image_url: imageUrl,
          is_primary: isPrimary
        });
        
      if (insertError) {
        console.error('Error registering image in database:', insertError);
        return null;
      }

      return imageUrl;
    } catch (error) {
      console.error('Error processing image upload:', error);
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
