import { v4 as uuidv4 } from "uuid";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useImageHandling = () => {
  const { toast } = useToast();

  const uploadImageToSupabase = async (file: File, carId: string, isPrimary: boolean = false): Promise<string | null> => {
    try {
      console.log("🔄 Iniciando upload para carId:", carId);
      console.log("📂 Arquivo:", file.name, "Tamanho:", Math.round(file.size / 1024) + "KB", "Tipo:", file.type);
      
      // Verificar tamanho do arquivo
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB em bytes
      if (file.size > MAX_SIZE) {
        const errorMsg = `Arquivo muito grande (${Math.round(file.size / 1024 / 1024)}MB). Máximo permitido: 5MB`;
        toast({
          title: "Erro no upload",
          description: errorMsg,
          variant: "destructive",
        });
        return null;
      }
      
      // Verificar se o bucket existe e criar se necessário
      try {
        console.log("🔍 Verificando bucket 'car-images'");
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.error("❌ Erro ao listar buckets:", bucketsError);
          throw bucketsError;
        }
        
        const bucketExists = buckets?.some(bucket => bucket.name === 'car-images');
        if (!bucketExists) {
          console.log("🆕 Bucket 'car-images' não existe, criando...");
          const { error: createBucketError } = await supabase.storage
            .createBucket('car-images', { public: true });
            
          if (createBucketError) {
            if (createBucketError.message.includes("already exists")) {
              console.log("ℹ️ Bucket já existe (corrida de condição)");
            } else {
              console.error("❌ Erro ao criar bucket:", createBucketError);
              throw createBucketError;
            }
          } else {
            console.log("✅ Bucket criado com sucesso");
          }
        } else {
          console.log("✅ Bucket 'car-images' encontrado");
        }
      } catch (bucketError: any) {
        console.error("❌ Erro de operação com bucket:", bucketError);
        // Continua mesmo se falhar verificação de bucket - talvez já exista
      }
      
      // Gerar nome único para o arquivo usando UUID
      const fileExt = file.name.split('.').pop() || 'jpg';
      const uniqueFileName = `${carId}/${uuidv4()}.${fileExt}`;
      console.log("📝 Nome de arquivo gerado:", uniqueFileName);
      
      // Realizar upload da imagem
      console.log("⬆️ Iniciando upload para:", uniqueFileName);
      let uploadResult;
      
      try {
        uploadResult = await supabase.storage
          .from('car-images')
          .upload(uniqueFileName, file, {
            upsert: true, // Substituir se existir
            cacheControl: '3600'
          });
      } catch (uploadErr) {
        console.error("❌ Exceção no upload:", uploadErr);
        throw new Error("Falha no upload da imagem: " + (uploadErr as Error).message);
      }
      
      const { data, error } = uploadResult;
      
      if (error) {
        console.error("❌ Erro no upload:", error);
        
        // Verificar erros de permissão
        if (error.message.includes("permission") || error.message.includes("not authorized")) {
          toast({
            title: "Erro de permissão",
            description: "Você não tem permissão para fazer upload de imagens. Verifique as políticas do bucket.",
            variant: "destructive",
          });
          return null;
        }
        
        throw error;
      }

      if (!data) {
        console.error("❌ Upload falhou - sem dados retornados");
        throw new Error("Upload falhou sem mensagem de erro específica");
      }
      
      console.log("✅ Upload concluído com sucesso:", data);
      
      // Gerar URL pública para a imagem
      const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/car-images/${uniqueFileName}`;
      console.log("🔗 URL gerada:", imageUrl);
      
      // Verificar se a URL é acessível
      try {
        const testResponse = await fetch(imageUrl, { method: 'HEAD' });
        if (!testResponse.ok) {
          console.warn("⚠️ URL da imagem pode não ser acessível:", testResponse.status);
        } else {
          console.log("✅ URL da imagem verificada e acessível");
        }
      } catch (urlCheckError) {
        console.warn("⚠️ Não foi possível verificar URL:", urlCheckError);
      }
      
      // Verificar se já existe uma imagem primária caso esta seja marcada como primária
      if (isPrimary) {
        console.log("🔄 Esta é uma imagem primária, verificando existência de outras primárias");
        try {
          const { data: existingPrimary, error: primaryCheckError } = await supabase
            .from('car_images')
            .select('id')
            .eq('car_id', carId)
            .eq('is_primary', true)
            .maybeSingle();
          
          if (primaryCheckError) {
            console.error("⚠️ Erro ao verificar imagens primárias:", primaryCheckError);
          } else if (existingPrimary) {
            console.log("🔄 Atualizando imagem primária existente:", existingPrimary.id);
            const { error: updateError } = await supabase
              .from('car_images')
              .update({ is_primary: false })
              .eq('id', existingPrimary.id);
            
            if (updateError) {
              console.error("⚠️ Erro ao atualizar status de imagem primária:", updateError);
            } else {
              console.log("✅ Status de imagem primária atualizado com sucesso");
            }
          } else {
            console.log("ℹ️ Nenhuma imagem primária existente encontrada");
          }
        } catch (primaryErr) {
          console.error("❌ Erro ao processar imagem primária:", primaryErr);
        }
      }

      // Registrar imagem no banco de dados
      console.log("📝 Inserindo registro no banco de dados para:", imageUrl);
      const { data: insertData, error: insertError } = await supabase
        .from('car_images')
        .insert({
          car_id: carId,
          image_url: imageUrl,
          is_primary: isPrimary
        })
        .select()
        .single();
        
      if (insertError) {
        console.error("❌ Erro ao registrar imagem no banco:", insertError);
        toast({
          title: "Imagem enviada, mas não registrada",
          description: "A imagem foi enviada, mas houve um erro ao registrá-la no banco de dados.",
          variant: "destructive",
        });
        return null;
      }
      
      console.log("✅ Registro inserido com sucesso:", insertData);
      
      toast({
        title: "Imagem enviada com sucesso",
        description: "A imagem foi enviada e registrada corretamente.",
        variant: "default",
      });

      return imageUrl;
    } catch (error: any) {
      console.error('❌ Erro completo no upload da imagem:', error);
      toast({
        title: "Erro no upload da imagem",
        description: error.message || "Ocorreu um erro inesperado. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
      return null;
    }
  };

  const removeExistingImage = async (imageId: string, imageUrl?: string): Promise<boolean> => {
    try {
      console.log("🗑️ Removendo imagem:", imageId);
      
      // Buscar dados da imagem se a URL não foi fornecida
      let urlToDelete = imageUrl;
      
      if (!urlToDelete) {
        const { data: imageData, error: fetchError } = await supabase
          .from('car_images')
          .select('image_url')
          .eq('id', imageId)
          .single();
          
        if (fetchError) {
          console.error("❌ Erro ao buscar dados da imagem:", fetchError);
        } else if (imageData) {
          urlToDelete = imageData.image_url;
        }
      }
      
      // Remover da tabela do banco de dados primeiro
      const { error: deleteDbError } = await supabase
        .from('car_images')
        .delete()
        .eq('id', imageId);
        
      if (deleteDbError) {
        console.error("❌ Erro ao remover imagem do banco:", deleteDbError);
        throw deleteDbError;
      }
      
      console.log("✅ Registro removido do banco de dados");
      
      // Remover do storage se temos a URL
      if (urlToDelete) {
        try {
          // Extrair o caminho do arquivo da URL
          const pathMatch = urlToDelete.match(/\/public\/car-images\/(.+)$/);
          if (pathMatch && pathMatch[1]) {
            const filePath = pathMatch[1];
            console.log("🗑️ Removendo arquivo do storage:", filePath);
            
            const { error: storageError } = await supabase.storage
              .from('car-images')
              .remove([filePath]);
              
            if (storageError) {
              console.warn("⚠️ Erro ao remover arquivo do storage:", storageError);
              // Continuamos mesmo com erro no storage - a referência já foi removida do banco
            } else {
              console.log("✅ Arquivo removido do storage com sucesso");
            }
          } else {
            console.warn("⚠️ Não foi possível extrair caminho do arquivo da URL:", urlToDelete);
          }
        } catch (storageErr) {
          console.warn("⚠️ Erro ao tentar remover do storage:", storageErr);
          // Continuamos mesmo com erro - a referência já foi removida do banco
        }
      }
      
      toast({
        title: "Imagem removida",
        description: "A imagem foi removida com sucesso.",
        variant: "default",
      });
      
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao remover imagem:', error);
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
