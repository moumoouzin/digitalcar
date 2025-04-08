
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XCircleIcon, PlusCircleIcon, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";

interface ImagemPreview {
  id?: string;        // ID no banco (apenas para imagens já existentes)
  url: string;        // URL da imagem
  file?: File;        // Arquivo (apenas para novas imagens)
  isUploading?: boolean; // Se está em processo de upload
  isPrimary?: boolean;   // Se é a imagem principal
  error?: string;     // Mensagem de erro, se houver
}

interface ImageUploaderProps {
  carroId?: string;              // ID do carro (pode ser undefined ao criar)
  imagensExistentes?: any[];     // Imagens já existentes
  onChange?: (imagens: ImagemPreview[]) => void; // Callback quando a lista muda
  onUploadComplete?: (urls: string[]) => void;   // Callback quando upload termina
  disabled?: boolean;            // Se o uploader está desabilitado
  maxImagens?: number;           // Número máximo de imagens permitidas
  // Função de registro para expor métodos do componente externamente
  onRegister?: (uploader: {
    uploadImagensPendentes: (carroId: string) => Promise<string[]>;
  }) => void;
}

// Define a ImageUploaderFunctions type outside the component
export type ImageUploaderFunctions = {
  uploadImagensPendentes: (carroId: string) => Promise<string[]>;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  carroId,
  imagensExistentes = [],
  onChange,
  onUploadComplete,
  disabled = false,
  maxImagens = 10,
  onRegister
}) => {
  const { toast } = useToast();
  const [imagens, setImagens] = useState<ImagemPreview[]>(() => 
    imagensExistentes.map(img => ({
      id: img.id,
      url: img.image_url,
      isPrimary: img.is_primary
    }))
  );
  const [isUploading, setIsUploading] = useState(false);

  // Update images when imagensExistentes changes
  useEffect(() => {
    if (imagensExistentes && imagensExistentes.length > 0) {
      console.log("🔄 Atualizando imagens existentes:", imagensExistentes.length);
      setImagens(imagensExistentes.map(img => ({
        id: img.id,
        url: img.image_url,
        isPrimary: img.is_primary
      })));
    } else {
      console.log("ℹ️ Nenhuma imagem existente para carregar");
    }
  }, [imagensExistentes]);

  // Registrar a função de upload com o componente pai quando montado
  useEffect(() => {
    if (onRegister) {
      console.log("🔄 Registrando funções do ImageUploader");
      onRegister({
        uploadImagensPendentes
      });
    }
    
    // Log para depuração
    console.log("🔄 ImageUploader montado com:", {
      carroId,
      imagensExistentes: imagensExistentes?.length || 0,
      imagens: imagens.length
    });
  }, [onRegister]);

  // Manipular seleção de novos arquivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const arquivos = Array.from(e.target.files);
    console.log(`📂 ${arquivos.length} arquivo(s) selecionado(s):`);
    arquivos.forEach((file, i) => {
      console.log(`  ${i+1}) ${file.name} - ${Math.round(file.size/1024)}KB - ${file.type}`);
    });
    
    // Verificar limite de imagens
    if (imagens.length + arquivos.length > maxImagens) {
      toast({
        title: "Limite de imagens excedido",
        description: `Você pode ter no máximo ${maxImagens} imagens por anúncio.`,
        variant: "destructive",
      });
      return;
    }

    // Criar previews para os arquivos selecionados
    const novasImagens: ImagemPreview[] = arquivos.map(file => ({
      url: URL.createObjectURL(file),
      file: file, // Garantir que o arquivo está associado
      isUploading: false
    }));
    
    console.log(`🖼️ ${novasImagens.length} previews de imagem criados`);

    // Atualizar estado
    const imagensAtualizadas = [...imagens, ...novasImagens];
    setImagens(imagensAtualizadas);
    console.log(`📊 Estado atualizado: ${imagensAtualizadas.length} imagens totais (${novasImagens.length} novas)`);
    
    // Notificar mudança
    if (onChange) {
      onChange(imagensAtualizadas);
    }
    
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  // Remover imagem da lista
  const removerImagemDaLista = (index: number) => {
    const imagem = imagens[index];
    
    // Revogar URL de objeto se for preview local
    if (imagem.file && imagem.url) {
      URL.revokeObjectURL(imagem.url);
    }

    // Remover do estado
    const novasImagens = [...imagens];
    novasImagens.splice(index, 1);
    setImagens(novasImagens);
    
    // Notificar mudança
    if (onChange) {
      onChange(novasImagens);
    }
  };

  // Remover imagem do servidor
  const handleRemoverImagem = async (index: number) => {
    const imagem = imagens[index];
    
    // Se tiver ID, significa que já está no servidor e precisa ser removida
    if (imagem.id) {
      try {
        console.log(`🗑️ Removendo imagem do servidor: ${imagem.id}`);
        
        // Extrair caminho do arquivo da URL
        const pathMatch = imagem.url.match(/\/public\/car-images\/(.+)$/);
        const filePath = pathMatch?.[1];
        
        if (filePath) {
          console.log(`🗑️ Tentando remover arquivo: ${filePath}`);
          // Tentar remover o arquivo do storage
          const { error: storageError } = await supabase.storage
            .from('car-images')
            .remove([filePath]);
            
          if (storageError) {
            console.warn(`⚠️ Erro ao remover arquivo: ${storageError.message}`);
          } else {
            console.log("✅ Arquivo removido do storage com sucesso");
          }
        }
        
        // Remover o registro do banco
        const { error } = await supabase
          .from('car_images')
          .delete()
          .eq('id', imagem.id);
          
        if (error) {
          console.error(`❌ Erro ao remover registro: ${error.message}`);
          toast({
            title: "Erro ao remover imagem",
            description: "Não foi possível remover a imagem do servidor.",
            variant: "destructive",
          });
        } else {
          console.log("✅ Registro removido do banco com sucesso");
          toast({
            title: "Imagem removida",
            description: "A imagem foi removida com sucesso.",
            variant: "default",
          });
        }
      } catch (erro) {
        console.error("❌ Erro ao remover imagem:", erro);
        toast({
          title: "Erro ao remover imagem",
          description: "Não foi possível remover a imagem do servidor.",
          variant: "destructive",
        });
      }
    }
    
    // Remover da lista de qualquer forma
    removerImagemDaLista(index);
  };

  // Realizar upload de todas as imagens pendentes
  const uploadImagensPendentes = async (idCarro: string): Promise<string[]> => {
    if (!idCarro) {
      console.error("❌ ID do carro não fornecido para upload de imagens");
      toast({
        title: "Erro de upload",
        description: "ID do carro não definido. Salve o formulário primeiro.",
        variant: "destructive",
      });
      return [];
    }
    
    setIsUploading(true);
    const imagensPendentes = imagens.filter(img => img.file);
    
    console.log("🔎 Verificando imagens pendentes:", imagensPendentes.length); 
    console.log("📋 Total de imagens em estado:", imagens.length);
    
    if (imagensPendentes.length === 0) {
      console.log("ℹ️ Nenhuma imagem pendente para upload");
      setIsUploading(false);
      return [];
    }
    
    console.log(`📤 Iniciando upload de ${imagensPendentes.length} imagens para o carro ${idCarro}...`);
    
    // Verificar bucket
    try {
      console.log("🔍 Verificando bucket 'car-images'");
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error("❌ Erro ao listar buckets:", bucketsError);
        toast({
          title: "Erro no upload",
          description: "Não foi possível verificar o armazenamento de imagens",
          variant: "destructive",
        });
        setIsUploading(false);
        return [];
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'car-images');
      if (!bucketExists) {
        console.error("❌ Bucket 'car-images' não existe");
        toast({
          title: "Erro no upload",
          description: "O sistema de armazenamento não está configurado corretamente",
          variant: "destructive",
        });
        setIsUploading(false);
        return [];
      }
      
      console.log("✅ Bucket 'car-images' encontrado");
    } catch (bucketError) {
      console.error("❌ Erro ao verificar bucket:", bucketError);
      setIsUploading(false);
      return [];
    }
    
    // Marcar todas as imagens como 'uploading'
    setImagens(currentImagens => {
      return currentImagens.map(img => {
        if (img.file) {
          return { ...img, isUploading: true };
        }
        return img;
      });
    });
    
    const urlsUpload: string[] = [];
    const naoExistePrimaria = !imagens.some(img => img.isPrimary && !img.file);
    
    // Upload sequencial para evitar corrida de condição com imagens primárias
    for (let i = 0; i < imagensPendentes.length; i++) {
      const imagem = imagensPendentes[i];
      
      if (!imagem.file) {
        console.warn(`⚠️ Imagem ${i} não possui arquivo`);
        continue;
      }
      
      console.log(`⬆️ Enviando imagem ${i+1}/${imagensPendentes.length}: ${imagem.file.name} para o carro ID: ${idCarro}`);
      
      try {
        // Verificar tamanho do arquivo
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB em bytes
        if (imagem.file.size > MAX_SIZE) {
          const errorMsg = `Arquivo muito grande (${Math.round(imagem.file.size / 1024 / 1024)}MB). Máximo permitido: 5MB`;
          console.error(`❌ ${errorMsg}`);
          
          // Atualizar estado da imagem com erro
          setImagens(currentImagens => {
            return currentImagens.map(img => {
              if (img === imagem) {
                return { ...img, isUploading: false, error: errorMsg };
              }
              return img;
            });
          });
          continue;
        }
        
        // Gerar nome único para o arquivo
        const fileExt = imagem.file.name.split('.').pop() || 'jpg';
        const uniqueFileName = `${idCarro}/${uuidv4()}.${fileExt}`;
        console.log(`📝 Nome de arquivo gerado: ${uniqueFileName}`);
        
        // Upload do arquivo
        console.log(`⬆️ Iniciando upload para: ${uniqueFileName}`);
        const { data, error: uploadError } = await supabase.storage
          .from('car-images')
          .upload(uniqueFileName, imagem.file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          console.error(`❌ Erro no upload: ${uploadError.message}`);
          
          // Atualizar estado da imagem com erro
          setImagens(currentImagens => {
            return currentImagens.map(img => {
              if (img === imagem) {
                return { 
                  ...img, 
                  isUploading: false, 
                  error: uploadError.message 
                };
              }
              return img;
            });
          });
          continue;
        }
        
        if (!data) {
          console.error("❌ Upload falhou - sem dados retornados");
          
          // Atualizar estado da imagem com erro
          setImagens(currentImagens => {
            return currentImagens.map(img => {
              if (img === imagem) {
                return { 
                  ...img, 
                  isUploading: false, 
                  error: "Falha no upload" 
                };
              }
              return img;
            });
          });
          continue;
        }
        
        console.log(`✅ Upload concluído com sucesso: ${data.path}`);
        
        // Gerar URL da imagem
        const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/car-images/${uniqueFileName}`;
        console.log(`🔗 URL da imagem: ${imageUrl}`);
        
        // Determinar se é imagem primária
        // Primeira imagem é primária se não houver outra primária
        const ehPrimaria = (i === 0 && naoExistePrimaria) || imagem.isPrimary === true;
        
        // Inserir no banco de dados
        console.log(`📝 Inserindo no banco de dados: ${imageUrl} (primária: ${ehPrimaria})`);
        const { data: insertData, error: insertError } = await supabase
          .from('car_images')
          .insert({
            car_id: idCarro,
            image_url: imageUrl,
            is_primary: ehPrimaria
          })
          .select()
          .single();
          
        if (insertError) {
          console.error(`❌ Erro ao inserir no banco: ${insertError.message}`);
          
          // Atualizar estado da imagem com erro
          setImagens(currentImagens => {
            return currentImagens.map(img => {
              if (img === imagem) {
                return { 
                  ...img, 
                  isUploading: false, 
                  error: "Erro no banco de dados" 
                };
              }
              return img;
            });
          });
          
          try {
            // Tentar remover o arquivo já que falhou a inserção
            await supabase.storage
              .from('car-images')
              .remove([uniqueFileName]);
            console.log("🗑️ Arquivo removido após falha na inserção");
          } catch (removeError) {
            console.error("❌ Erro ao remover arquivo após falha:", removeError);
          }
          
          continue;
        }
        
        console.log(`✅ Inserido no banco com ID: ${insertData?.id}`);
        urlsUpload.push(imageUrl);
        
        // Atualizar estado da imagem
        setImagens(currentImagens => {
          return currentImagens.map(img => {
            if (img === imagem) {
              return {
                id: insertData?.id,
                url: imageUrl,
                isUploading: false,
                isPrimary: ehPrimaria
              };
            }
            return img;
          });
        });
        
      } catch (error: any) {
        console.error(`❌ Erro não tratado no upload: ${error.message}`);
        
        // Atualizar estado da imagem com erro
        setImagens(currentImagens => {
          return currentImagens.map(img => {
            if (img === imagem) {
              return { 
                ...img, 
                isUploading: false, 
                error: error.message || "Erro desconhecido" 
              };
            }
            return img;
          });
        });
      }
    }
    
    setIsUploading(false);
    console.log(`✅ Upload finalizado: ${urlsUpload.length} imagens enviadas`);
    
    if (urlsUpload.length > 0) {
      // Notificar conclusão
      if (onUploadComplete) {
        onUploadComplete(urlsUpload);
      }
    }
    
    return urlsUpload;
  };

  return (
    <div className="space-y-4">
      {/* Input de arquivo visualmente escondido mas acessível */}
      <input
        type="file"
        id="image-upload-input"
        multiple
        accept="image/*"
        className="sr-only"
        onChange={handleFileSelect}
        disabled={disabled || isUploading || imagens.length >= maxImagens}
      />

      {/* Botão para abrir seletor de arquivos */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="image-upload-input"
          className={`flex items-center px-4 py-2 rounded-md border border-input ${
            disabled || isUploading || imagens.length >= maxImagens
              ? "opacity-50 cursor-not-allowed bg-muted"
              : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <PlusCircleIcon className="w-4 h-4 mr-2" />
          <span>Adicionar imagens</span>
        </label>
        
        <span className="text-sm text-muted-foreground">
          {imagens.length} de {maxImagens} imagens
        </span>
      </div>

      {/* Área de preview de imagens */}
      {imagens.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {imagens.map((imagem, index) => (
            <div 
              key={imagem.id || `new-${index}`} 
              className={`relative group border rounded-md overflow-hidden aspect-square ${
                imagem.isUploading ? "opacity-60" : ""
              } ${imagem.error ? "border-red-500" : ""}`}
            >
              <img
                src={imagem.url}
                alt={`Imagem ${index + 1}`}
                className="h-full w-full object-cover"
              />
              
              {/* Indicador de imagem primária */}
              {imagem.isPrimary && (
                <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1 py-0.5 rounded">
                  Principal
                </div>
              )}
              
              {/* Indicador de erro */}
              {imagem.error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 truncate">
                  Erro: {imagem.error}
                </div>
              )}
              
              {/* Botão de remover */}
              {!disabled && !imagem.isUploading && (
                <button
                  type="button"
                  onClick={() => handleRemoverImagem(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              )}
              
              {/* Indicador de upload */}
              {imagem.isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-md p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Nenhuma imagem adicionada
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Clique no botão acima para adicionar imagens
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
