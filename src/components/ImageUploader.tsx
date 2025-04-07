import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XCircleIcon, PlusCircleIcon, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { uploadImagem, removerImagem } from "@/services/imageService";

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

  // Registrar a função de upload com o componente pai quando montado
  useEffect(() => {
    if (onRegister) {
      onRegister({
        uploadImagensPendentes
      });
    }
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
        const resultado = await removerImagem(imagem.id);
        
        if (resultado.sucesso) {
          toast({
            title: "Imagem removida",
            description: "A imagem foi removida com sucesso.",
            variant: "default",
          });
        } else {
          toast({
            title: "Erro ao remover imagem",
            description: resultado.erro || "Ocorreu um erro inesperado.",
            variant: "destructive",
          });
        }
      } catch (erro) {
        console.error("Erro ao remover imagem:", erro);
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
      console.log("⚠️ Nenhuma imagem pendente para upload");
      setIsUploading(false);
      return [];
    }
    
    console.log(`📤 Iniciando upload de ${imagensPendentes.length} imagens...`);
    
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
    const primeiraPrimeiraImagem = imagens.every(img => !img.isPrimary);
    
    // Upload sequencial para evitar corrida de condição com imagens primárias
    for (let i = 0; i < imagensPendentes.length; i++) {
      const imagem = imagensPendentes[i];
      
      if (!imagem.file) {
        console.log(`⚠️ Imagem ${i} não possui arquivo`, imagem);
        continue;
      }
      
      console.log(`⬆️ Enviando imagem ${i+1}/${imagensPendentes.length}: ${imagem.file.name}`);
      
      try {
        // Define se essa imagem será primária
        // - Se for a primeira imagem e não existir nenhuma primária
        // - OU se essa imagem específica já estiver marcada como primária
        const ehPrimaria = (i === 0 && primeiraPrimeiraImagem) || !!imagem.isPrimary;
        
        const resultado = await uploadImagem(
          imagem.file, 
          idCarro, 
          ehPrimaria
        );
        
        // Atualizar estado da imagem
        setImagens(currentImagens => {
          return currentImagens.map((img, idx) => {
            // Encontra a imagem que estamos atualizando
            if (img === imagem) {
              if (resultado.sucesso && resultado.url) {
                urlsUpload.push(resultado.url);
                return {
                  url: resultado.url,
                  isUploading: false,
                  isPrimary: ehPrimaria
                };
              } else {
                return {
                  ...img,
                  isUploading: false,
                  error: resultado.erro
                };
              }
            }
            return img;
          });
        });
        
        if (!resultado.sucesso) {
          console.error(`❌ Erro no upload da imagem ${i+1}:`, resultado.erro);
          toast({
            title: `Erro no upload (${i+1}/${imagensPendentes.length})`,
            description: resultado.erro || "Ocorreu um erro inesperado.",
            variant: "destructive",
          });
        }
      } catch (erro: any) {
        console.error(`❌ Exceção no upload da imagem ${i+1}:`, erro);
        
        // Atualizar estado da imagem com erro
        setImagens(currentImagens => {
          return currentImagens.map(img => {
            if (img === imagem) {
              return {
                ...img,
                isUploading: false,
                error: erro.message || "Erro desconhecido"
              };
            }
            return img;
          });
        });
        
        toast({
          title: `Erro no upload (${i+1}/${imagensPendentes.length})`,
          description: erro.message || "Ocorreu um erro inesperado.",
          variant: "destructive",
        });
      }
    }
    
    setIsUploading(false);
    console.log(`✅ Upload concluído: ${urlsUpload.length} imagens enviadas`);
    
    // Notificar conclusão
    if (onUploadComplete) {
      onUploadComplete(urlsUpload);
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

// Tipo para o objeto uploader
export type ImageUploaderFunctions = {
  uploadImagensPendentes: (carroId: string) => Promise<string[]>;
}; 