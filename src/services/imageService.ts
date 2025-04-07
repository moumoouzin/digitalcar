import { v4 as uuidv4 } from "uuid";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";

/**
 * Verifica se o bucket de imagens existe e cria se necessário
 */
export const verificarBucket = async (): Promise<boolean> => {
  console.log("🔍 Verificando existência do bucket 'car-images'");
  try {
    // Verificar se o bucket existe
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("❌ Erro ao listar buckets:", error);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'car-images');
    
    if (!bucketExists) {
      console.log("🆕 Criando bucket 'car-images'...");
      const { error: createError } = await supabase.storage.createBucket('car-images', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        // Se o erro for porque o bucket já existe, consideramos como sucesso
        if (createError.message.includes("already exists")) {
          console.log("✅ Bucket já existe");
          return true;
        }
        
        console.error("❌ Erro ao criar bucket:", createError);
        return false;
      }
      
      console.log("✅ Bucket criado com sucesso");
    } else {
      console.log("✅ Bucket 'car-images' encontrado");
    }
    
    return true;
  } catch (error) {
    console.error("❌ Erro ao verificar bucket:", error);
    return false;
  }
};

/**
 * Faz o upload de uma imagem para o Supabase
 */
export const uploadImagem = async (
  arquivo: File, 
  carroId: string, 
  ehPrimaria: boolean = false
): Promise<{ sucesso: boolean; url?: string; erro?: string }> => {
  console.log(`📤 Iniciando upload: ${arquivo.name} (${Math.round(arquivo.size / 1024)}KB)`);
  
  try {
    // 1. Verificar tamanho do arquivo
    if (arquivo.size > 5 * 1024 * 1024) { // 5MB
      return {
        sucesso: false,
        erro: `Arquivo muito grande: ${Math.round(arquivo.size / 1024 / 1024)}MB. Máximo: 5MB`
      };
    }
    
    // 2. Verificar/criar bucket
    const bucketOk = await verificarBucket();
    if (!bucketOk) {
      return {
        sucesso: false,
        erro: "Não foi possível configurar o bucket de armazenamento"
      };
    }
    
    // 3. Gerar nome de arquivo único
    const extensao = arquivo.name.split('.').pop() || 'jpg';
    const nomeArquivo = `${carroId}/${uuidv4()}.${extensao}`;
    console.log("📝 Nome de arquivo:", nomeArquivo);
    
    // 4. Fazer upload do arquivo
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(nomeArquivo, arquivo, {
        upsert: false,
        contentType: arquivo.type
      });
      
    if (error) {
      console.error("❌ Erro no upload:", error);
      return {
        sucesso: false,
        erro: error.message
      };
    }
    
    if (!data || !data.path) {
      return {
        sucesso: false,
        erro: "Upload falhou - nenhuma informação retornada"
      };
    }
    
    console.log("✅ Upload concluído com sucesso:", data.path);
    
    // 5. Gerar URL pública
    const urlImagem = `${SUPABASE_URL}/storage/v1/object/public/car-images/${nomeArquivo}`;
    console.log("🔗 URL da imagem:", urlImagem);
    
    // 6. Se for primária, atualizar outras imagens primárias
    if (ehPrimaria) {
      await atualizarStatusPrimaria(carroId);
    }
    
    // 7. Inserir registro no banco de dados
    const { data: dadosInsercao, error: erroInsercao } = await supabase
      .from('car_images')
      .insert({
        car_id: carroId,
        image_url: urlImagem,
        is_primary: ehPrimaria
      })
      .select()
      .single();
      
    if (erroInsercao) {
      console.error("❌ Erro ao registrar imagem no banco:", erroInsercao);
      
      // Se falhou ao registrar no banco, tenta remover arquivo do storage
      try {
        await supabase.storage.from('car-images').remove([nomeArquivo]);
        console.log("🗑️ Arquivo removido do storage após falha no registro");
      } catch (removeError) {
        console.error("❌ Não foi possível remover arquivo após erro:", removeError);
      }
      
      return {
        sucesso: false,
        erro: `Erro ao registrar imagem: ${erroInsercao.message}`
      };
    }
    
    console.log("✅ Imagem registrada com sucesso:", dadosInsercao?.id);
    
    return {
      sucesso: true,
      url: urlImagem
    };
    
  } catch (erro: any) {
    console.error("❌ Erro não tratado durante upload:", erro);
    return {
      sucesso: false,
      erro: erro.message || "Erro desconhecido durante o upload"
    };
  }
};

/**
 * Atualiza status de imagem primária
 */
const atualizarStatusPrimaria = async (carroId: string): Promise<void> => {
  try {
    console.log("🔄 Atualizando status de imagem primária para o carro:", carroId);
    
    const { data: imagemPrimaria, error: erroConsulta } = await supabase
      .from('car_images')
      .select('id')
      .eq('car_id', carroId)
      .eq('is_primary', true)
      .maybeSingle();
      
    if (erroConsulta) {
      console.error("❌ Erro ao consultar imagem primária:", erroConsulta);
      return;
    }
    
    if (imagemPrimaria) {
      console.log("🔄 Removendo status primário da imagem:", imagemPrimaria.id);
      
      const { error: erroAtualizacao } = await supabase
        .from('car_images')
        .update({ is_primary: false })
        .eq('id', imagemPrimaria.id);
        
      if (erroAtualizacao) {
        console.error("❌ Erro ao atualizar status da imagem primária:", erroAtualizacao);
      } else {
        console.log("✅ Status de imagem primária atualizado com sucesso");
      }
    } else {
      console.log("ℹ️ Nenhuma imagem primária encontrada para este carro");
    }
  } catch (erro) {
    console.error("❌ Erro ao atualizar status de imagem primária:", erro);
  }
};

/**
 * Remove uma imagem do sistema
 */
export const removerImagem = async (
  imagemId: string
): Promise<{ sucesso: boolean; erro?: string }> => {
  console.log("🗑️ Removendo imagem:", imagemId);
  
  try {
    // 1. Obter dados da imagem
    const { data: dadosImagem, error: erroConsulta } = await supabase
      .from('car_images')
      .select('image_url')
      .eq('id', imagemId)
      .single();
      
    if (erroConsulta) {
      console.error("❌ Erro ao consultar dados da imagem:", erroConsulta);
      return {
        sucesso: false,
        erro: `Erro ao localizar imagem: ${erroConsulta.message}`
      };
    }
    
    if (!dadosImagem || !dadosImagem.image_url) {
      return {
        sucesso: false,
        erro: "Imagem não encontrada ou sem URL válida"
      };
    }
    
    // 2. Extrair caminho do arquivo da URL
    const urlImagem = dadosImagem.image_url;
    const caminho = extrairCaminhoArquivo(urlImagem);
    
    // 3. Remover registro do banco
    const { error: erroRemocao } = await supabase
      .from('car_images')
      .delete()
      .eq('id', imagemId);
      
    if (erroRemocao) {
      console.error("❌ Erro ao remover registro da imagem:", erroRemocao);
      return {
        sucesso: false,
        erro: `Erro ao remover registro: ${erroRemocao.message}`
      };
    }
    
    // 4. Remover arquivo do storage
    if (caminho) {
      try {
        const { error: erroStorage } = await supabase.storage
          .from('car-images')
          .remove([caminho]);
          
        if (erroStorage) {
          console.warn("⚠️ Erro ao remover arquivo do storage:", erroStorage);
          // Continuamos mesmo se falhar esta parte
        } else {
          console.log("✅ Arquivo removido do storage com sucesso");
        }
      } catch (erroRemocaoArquivo) {
        console.warn("⚠️ Exceção ao remover arquivo do storage:", erroRemocaoArquivo);
        // Continuamos mesmo se falhar esta parte
      }
    } else {
      console.warn("⚠️ Não foi possível extrair caminho do arquivo da URL");
    }
    
    console.log("✅ Imagem removida com sucesso");
    return { sucesso: true };
    
  } catch (erro: any) {
    console.error("❌ Erro não tratado durante remoção de imagem:", erro);
    return {
      sucesso: false,
      erro: erro.message || "Erro desconhecido durante a remoção"
    };
  }
};

/**
 * Extrai o caminho do arquivo a partir da URL
 */
const extrairCaminhoArquivo = (url: string): string | null => {
  try {
    const match = url.match(/\/public\/car-images\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

/**
 * Retorna todas as imagens de um carro
 */
export const listarImagensCarro = async (
  carroId: string
): Promise<{ sucesso: boolean; imagens?: any[]; erro?: string }> => {
  console.log("🔍 Listando imagens para o carro:", carroId);
  
  try {
    const { data, error } = await supabase
      .from('car_images')
      .select('*')
      .eq('car_id', carroId)
      .order('is_primary', { ascending: false });
      
    if (error) {
      console.error("❌ Erro ao listar imagens:", error);
      return {
        sucesso: false,
        erro: `Erro ao listar imagens: ${error.message}`
      };
    }
    
    console.log(`✅ ${data?.length || 0} imagens encontradas`);
    return {
      sucesso: true,
      imagens: data || []
    };
    
  } catch (erro: any) {
    console.error("❌ Erro não tratado ao listar imagens:", erro);
    return {
      sucesso: false,
      erro: erro.message || "Erro desconhecido ao listar imagens"
    };
  }
};

/**
 * Define uma imagem como primária
 */
export const definirImagemPrimaria = async (
  imagemId: string, 
  carroId: string
): Promise<{ sucesso: boolean; erro?: string }> => {
  console.log("🔄 Definindo imagem primária:", imagemId);
  
  try {
    // 1. Remover status primário de outras imagens
    await atualizarStatusPrimaria(carroId);
    
    // 2. Definir nova imagem primária
    const { error } = await supabase
      .from('car_images')
      .update({ is_primary: true })
      .eq('id', imagemId);
      
    if (error) {
      console.error("❌ Erro ao definir imagem primária:", error);
      return {
        sucesso: false,
        erro: `Erro ao definir imagem primária: ${error.message}`
      };
    }
    
    console.log("✅ Imagem definida como primária com sucesso");
    return { sucesso: true };
    
  } catch (erro: any) {
    console.error("❌ Erro não tratado ao definir imagem primária:", erro);
    return {
      sucesso: false,
      erro: erro.message || "Erro desconhecido ao definir imagem primária"
    };
  }
}; 