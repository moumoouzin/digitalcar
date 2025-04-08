
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Loader2Icon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from "lucide-react";
import { useImageUploader } from "@/hooks/useImageUploader";
import { v4 as uuidv4 } from "uuid";

const DiagnosticoUpload: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [testId, setTestId] = useState(() => uuidv4());
  const [diagStatus, setDiagStatus] = useState<Record<string, {status: 'success' | 'error' | 'warning' | 'loading', message: string}>>({});
  const { toast } = useToast();
  const { ImageUploaderComponent, uploadImages, isUploading } = useImageUploader();

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setIsLoading(true);
    setDiagStatus({});

    // Verificar conexão com Supabase
    checkStatus('conexao', 'loading', 'Verificando conexão com Supabase...');
    try {
      const { data, error } = await supabase.from('car_ads').select('count').single();
      
      if (error) {
        checkStatus('conexao', 'error', `Erro de conexão: ${error.message}`);
      } else {
        checkStatus('conexao', 'success', 'Conexão com Supabase estabelecida com sucesso');
      }
    } catch (error: any) {
      checkStatus('conexao', 'error', `Erro: ${error.message}`);
    }

    // Verificar tabela car_images
    checkStatus('tabela', 'loading', 'Verificando tabela car_images...');
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .from('car_images')
        .select('count').single();
      
      if (tableError) {
        checkStatus('tabela', 'error', `Erro ao verificar tabela car_images: ${tableError.message}`);
      } else {
        checkStatus('tabela', 'success', 'Tabela car_images está disponível');
      }
    } catch (error: any) {
      checkStatus('tabela', 'error', `Erro: ${error.message}`);
    }

    // Verificar bucket de armazenamento
    checkStatus('bucket', 'loading', 'Verificando bucket car-images...');
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        checkStatus('bucket', 'error', `Erro ao listar buckets: ${bucketsError.message}`);
      } else {
        const carImagesBucket = buckets?.find(b => b.name === 'car-images');
        
        if (carImagesBucket) {
          checkStatus('bucket', 'success', 'Bucket car-images encontrado');
          
          // Verificar políticas do bucket
          checkStatus('politicas', 'loading', 'Verificando políticas do bucket...');
          
          try {
            // Tentar upload de teste para verificar políticas
            const testFile = new File(['teste'], 'teste.txt', { type: 'text/plain' });
            const testPath = `test/policy-check-${uuidv4()}.txt`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('car-images')
              .upload(testPath, testFile);
            
            if (uploadError) {
              checkStatus('politicas', 'error', `Erro ao testar políticas: ${uploadError.message}`);
            } else {
              // Tentar remover o arquivo de teste
              await supabase.storage.from('car-images').remove([testPath]);
              checkStatus('politicas', 'success', 'Políticas do bucket estão configuradas corretamente');
            }
          } catch (error: any) {
            checkStatus('politicas', 'error', `Erro ao testar políticas: ${error.message}`);
          }
        } else {
          checkStatus('bucket', 'error', 'Bucket car-images não encontrado');
          checkStatus('politicas', 'warning', 'Não foi possível verificar políticas (bucket não existe)');
          
          // Tentar criar o bucket
          try {
            const { data, error: createError } = await supabase.storage.createBucket('car-images', {
              public: true
            });
            
            if (createError) {
              checkStatus('criacao', 'error', `Erro ao criar bucket: ${createError.message}`);
            } else {
              checkStatus('criacao', 'success', 'Bucket car-images criado com sucesso');
            }
          } catch (error: any) {
            checkStatus('criacao', 'error', `Erro ao criar bucket: ${error.message}`);
          }
        }
      }
    } catch (error: any) {
      checkStatus('bucket', 'error', `Erro: ${error.message}`);
    }

    setIsLoading(false);
  };

  const checkStatus = (key: string, status: 'success' | 'error' | 'warning' | 'loading', message: string) => {
    setDiagStatus(prev => ({
      ...prev,
      [key]: { status, message }
    }));
  };

  const handleTestUpload = async () => {
    try {
      const result = await uploadImages(testId);
      
      if (result.length > 0) {
        toast({
          title: "Upload de teste concluído",
          description: `${result.length} imagens enviadas com sucesso`,
          variant: "default",
        });
      } else {
        toast({
          title: "Upload de teste",
          description: "Nenhuma imagem foi enviada. Adicione imagens primeiro.",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro no upload de teste",
        description: error.message || "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const renderStatusIcon = (status: 'success' | 'error' | 'warning' | 'loading') => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="text-green-500" />;
      case 'error': return <XCircleIcon className="text-red-500" />;
      case 'warning': return <AlertTriangleIcon className="text-amber-500" />;
      case 'loading': return <Loader2Icon className="animate-spin text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Diagnóstico de Upload</h1>
        <p className="text-muted-foreground mt-1">
          Ferramenta para diagnóstico e teste do sistema de upload de imagens.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>
            Verificação de componentes necessários para upload de imagens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(diagStatus).map(([key, { status, message }]) => (
              <div key={key} className="flex items-center gap-2">
                {renderStatusIcon(status)}
                <span>{message}</span>
              </div>
            ))}

            {isLoading && Object.keys(diagStatus).length === 0 && (
              <div className="flex items-center gap-2">
                <Loader2Icon className="animate-spin text-blue-500" />
                <span>Verificando componentes do sistema...</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={runDiagnostics} 
            disabled={isLoading}
            className="mr-2"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : "Verificar Novamente"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teste de Upload</CardTitle>
          <CardDescription>
            Envie imagens de teste para verificar o funcionamento do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                ID de Teste
              </label>
              <div className="flex gap-2">
                <Input
                  value={testId}
                  onChange={(e) => setTestId(e.target.value)}
                  placeholder="ID para teste"
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  onClick={() => setTestId(uuidv4())}
                >
                  Gerar Novo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Este ID será usado como referência para os uploads de teste
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Upload de Imagens</h3>
              <ImageUploaderComponent 
                carroId={testId}
                maxImagens={5}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleTestUpload} 
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : "Testar Upload"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DiagnosticoUpload;
