
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useImageUploader } from "@/hooks/useImageUploader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { verificarBucket } from "@/services/imageService";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { Loader2Icon, CheckCircleIcon, XCircleIcon } from "lucide-react";

const TestUpload = () => {
  const { ImageUploaderComponent, uploadImages, isUploading } = useImageUploader();
  const [testId] = useState(`test-${new Date().getTime()}`);
  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({
    bucket: null,
    policies: null,
    upload: null,
    database: null
  });
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults({
      bucket: null,
      policies: null,
      upload: null,
      database: null
    });
    setUploadedUrls([]);
    setLogs([]);
    
    addLog("Iniciando testes de upload de imagens...");
    
    // Teste 1: Verificar bucket
    addLog("Teste 1: Verificando bucket 'car-images'...");
    try {
      const bucketOk = await verificarBucket();
      setTestResults(prev => ({ ...prev, bucket: bucketOk }));
      
      if (bucketOk) {
        addLog("✅ Bucket 'car-images' verificado com sucesso!");
      } else {
        addLog("❌ Falha ao verificar bucket 'car-images'");
      }
    } catch (error: any) {
      addLog(`❌ Erro ao verificar bucket: ${error.message}`);
      setTestResults(prev => ({ ...prev, bucket: false }));
    }
    
    // Teste 2: Verificar políticas
    addLog("Teste 2: Verificando políticas de storage...");
    try {
      const { data: policies, error } = await supabase
        .from('_supabase_policy_catalog')
        .select('*')
        .or('name.ilike.%car-images%,definition.ilike.%car-images%')
      
      if (error) {
        addLog(`❌ Erro ao verificar políticas: ${error.message}`);
        setTestResults(prev => ({ ...prev, policies: false }));
      } else {
        const hasRequiredPolicies = policies && policies.length >= 2;
        setTestResults(prev => ({ ...prev, policies: hasRequiredPolicies }));
        
        if (hasRequiredPolicies) {
          addLog(`✅ Políticas verificadas: ${policies.length} políticas encontradas`);
        } else {
          addLog(`⚠️ Possível problema: Apenas ${policies?.length || 0} políticas encontradas`);
        }
      }
    } catch (error: any) {
      addLog(`❌ Erro ao verificar políticas: ${error.message}`);
      setTestResults(prev => ({ ...prev, policies: false }));
    }
    
    // Teste 3 e 4: Upload de imagem e salvamento no banco
    addLog(`Teste 3 e 4: Testando upload de imagem para ID: ${testId}...`);
    
    const handleUploadButtonClick = async () => {
      try {
        addLog("Iniciando upload via hook useImageUploader...");
        const urls = await uploadImages(testId);
        
        if (urls && urls.length > 0) {
          addLog(`✅ Upload bem-sucedido: ${urls.length} imagens enviadas`);
          setTestResults(prev => ({ ...prev, upload: true }));
          setUploadedUrls(urls);
          
          // Verificar se as imagens foram salvas no banco
          addLog("Verificando registros no banco de dados...");
          const { data, error } = await supabase
            .from('car_images')
            .select('*')
            .eq('car_id', testId);
          
          if (error) {
            addLog(`❌ Erro ao verificar registros: ${error.message}`);
            setTestResults(prev => ({ ...prev, database: false }));
          } else if (data && data.length > 0) {
            addLog(`✅ ${data.length} registros encontrados no banco de dados`);
            setTestResults(prev => ({ ...prev, database: true }));
          } else {
            addLog("❌ Nenhum registro encontrado no banco de dados");
            setTestResults(prev => ({ ...prev, database: false }));
          }
        } else {
          addLog("❌ Falha no upload: Nenhuma imagem enviada");
          setTestResults(prev => ({ ...prev, upload: false, database: false }));
        }
      } catch (error: any) {
        addLog(`❌ Erro durante o upload: ${error.message}`);
        setTestResults(prev => ({ ...prev, upload: false, database: false }));
      } finally {
        setIsRunningTests(false);
      }
    };
    
    // Aguardar um momento para o componente renderizar
    setTimeout(() => {
      addLog("Aguardando seleção de imagens...");
      setIsRunningTests(false);
    }, 1500);
  };
  
  const cleanupTest = async () => {
    if (!testId) return;
    
    setIsRunningTests(true);
    addLog("Limpando dados de teste...");
    
    try {
      // Remover registros do banco
      const { error: dbError } = await supabase
        .from('car_images')
        .delete()
        .eq('car_id', testId);
      
      if (dbError) {
        addLog(`❌ Erro ao remover registros: ${dbError.message}`);
      } else {
        addLog("✅ Registros removidos do banco de dados");
      }
      
      // Remover arquivos do storage
      try {
        const { data: files } = await supabase.storage
          .from('car-images')
          .list(testId);
        
        if (files && files.length > 0) {
          const filePaths = files.map(file => `${testId}/${file.name}`);
          
          const { error: storageError } = await supabase.storage
            .from('car-images')
            .remove(filePaths);
          
          if (storageError) {
            addLog(`❌ Erro ao remover arquivos: ${storageError.message}`);
          } else {
            addLog(`✅ ${filePaths.length} arquivos removidos do storage`);
          }
        } else {
          addLog("ℹ️ Nenhum arquivo encontrado para remover");
        }
      } catch (error: any) {
        addLog(`❌ Erro ao listar/remover arquivos: ${error.message}`);
      }
    } catch (error: any) {
      addLog(`❌ Erro durante limpeza: ${error.message}`);
    } finally {
      setIsRunningTests(false);
    }
  };
  
  const getTestStatusIcon = (status: boolean | null) => {
    if (status === null) return <Loader2Icon className="h-5 w-5 text-gray-300" />;
    return status ? 
      <CheckCircleIcon className="h-5 w-5 text-green-500" /> : 
      <XCircleIcon className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Diagnóstico de Upload de Imagens</h1>
        <p className="text-muted-foreground mt-1">
          Esta página ajuda a diagnosticar problemas com o upload de imagens
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Testes de Configuração</CardTitle>
            <CardDescription>
              Verifique se o sistema está configurado corretamente para upload de imagens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Bucket 'car-images' existe</span>
                {getTestStatusIcon(testResults.bucket)}
              </div>
              
              <div className="flex items-center justify-between">
                <span>Políticas de acesso configuradas</span>
                {getTestStatusIcon(testResults.policies)}
              </div>
              
              <div className="flex items-center justify-between">
                <span>Upload de imagens funciona</span>
                {getTestStatusIcon(testResults.upload)}
              </div>
              
              <div className="flex items-center justify-between">
                <span>Salvamento no banco de dados</span>
                {getTestStatusIcon(testResults.database)}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={runTests} 
                disabled={isRunningTests}
              >
                {isRunningTests ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Executando testes
                  </>
                ) : "Iniciar Diagnóstico"}
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={cleanupTest}
                disabled={isRunningTests || !testId}
              >
                Limpar Dados de Teste
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Teste de Upload</CardTitle>
            <CardDescription>
              Selecione imagens e teste o upload na prática
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <p className="text-sm font-medium mb-3">ID de teste: {testId}</p>
                <ImageUploaderComponent carroId={testId} maxImagens={3} />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={async () => {
                    const urls = await uploadImages(testId);
                    setUploadedUrls(urls || []);
                    if (urls && urls.length > 0) {
                      addLog(`✅ Upload bem-sucedido: ${urls.length} imagens`);
                    } else {
                      addLog("❌ Nenhuma imagem enviada");
                    }
                  }} 
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : "Testar Upload"}
                </Button>
              </div>
              
              {uploadedUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">URLs geradas:</p>
                  <div className="text-xs overflow-auto bg-muted p-2 rounded max-h-40">
                    {uploadedUrls.map((url, idx) => (
                      <div key={idx} className="mb-1">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                          {url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Logs de Diagnóstico</CardTitle>
          <CardDescription>
            Histórico detalhado das verificações realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-64 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <div key={idx} className="mb-1">{log}</div>
              ))
            ) : (
              <p>Execute o diagnóstico para ver os logs...</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setLogs([])} 
            disabled={logs.length === 0}
          >
            Limpar Logs
          </Button>
          
          <Button 
            onClick={() => {
              navigator.clipboard.writeText(logs.join('\n'));
              alert('Logs copiados para a área de transferência');
            }} 
            disabled={logs.length === 0}
          >
            Copiar Logs
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestUpload;
