
import { supabase } from "@/integrations/supabase/client";

// Função para verificar e criar o bucket de documentos de financiamento
export const createFinancingDocsBucket = async () => {
  try {
    // Verificar se o bucket já existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'financing-docs');
    
    if (!bucketExists) {
      console.log('Inicializando bucket financing-docs...');
      const { data, error } = await supabase.storage.createBucket('financing-docs', {
        public: true // Permitir acesso público aos documentos
      });
      
      if (error) {
        console.error('Erro ao criar bucket financing-docs:', error);
        return false;
      }
      
      console.log('Bucket financing-docs criado com sucesso!');
      return true;
    } else {
      console.log('Bucket financing-docs já existe.');
      return true;
    }
  } catch (error) {
    console.error('Erro ao verificar/criar bucket de documentos:', error);
    return false;
  }
};
