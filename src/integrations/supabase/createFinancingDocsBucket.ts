
import { supabase } from "@/integrations/supabase/client";

// Função para verificar o bucket de documentos de financiamento
export const createFinancingDocsBucket = async () => {
  try {
    // Verificar se o bucket já existe
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Erro ao verificar buckets:', bucketError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'financing-docs');
    
    if (bucketExists) {
      console.log('Bucket financing-docs verificado com sucesso.');
      return true;
    } else {
      console.warn('Bucket financing-docs não encontrado. Por favor, verifique as configurações do Supabase.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao verificar bucket de documentos:', error);
    return false;
  }
};
