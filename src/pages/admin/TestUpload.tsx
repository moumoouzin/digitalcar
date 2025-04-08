import React, { useState } from 'react';
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from "uuid";

// Página de diagnóstico para upload de imagens
const TestUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Função auxiliar para adicionar logs
  const addLog = (message: string) => {
    setLogMessages(prev => [...prev, `${new Date().toISOString().substring(11, 19)} - ${message}`]);
  };

  // 1. Teste de listagem de buckets
  const testListBuckets = async () => {
    setLoading(true);
    addLog("🔍 Teste 1: Listando buckets disponíveis...");

    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        addLog(`❌ Erro ao listar buckets: ${error.message}`);
        setResult('Falha ao listar buckets. Verifique os logs.');
      } else {
        const bucketNames = data.map(b => b.name).join(', ');
        addLog(`✅ Buckets encontrados: ${bucketNames || 'nenhum'}`);
        
        const carImagesBucket = data.find(b => b.name === 'car-images');
        if (carImagesBucket) {
          addLog(`✅ Bucket 'car-images' encontrado! ID: ${carImagesBucket.id}`);
        } else {
          addLog(`⚠️ Bucket 'car-images' NÃO encontrado!`);
        }
        
        setResult('Listagem de buckets concluída com sucesso. Verifique os logs.');
      }
    } catch (error: any) {
      addLog(`❌ Exceção ao listar buckets: ${error.message}`);
      setResult('Erro ao listar buckets. Verifique os logs.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Teste de criação de bucket
  const testCreateBucket = async () => {
    setLoading(true);
    addLog("🔍 Teste 2: Tentando criar bucket 'car-images'...");

    try {
      // Removed the problematic code that was querying _supabase_policy_catalog
      // Instead, we'll directly try to create the bucket and handle any errors
      
      const { data, error } = await supabase.storage.createBucket('car-images', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          addLog(`ℹ️ Bucket 'car-images' já existe`);
          setResult('Bucket já existe. Teste as outras funções.');
        } else {
          addLog(`❌ Erro ao criar bucket: ${error.message}`);
          setResult('Falha ao criar bucket. Verifique os logs.');
        }
      } else {
        addLog(`✅ Bucket 'car-images' criado com sucesso!`);
        setResult('Bucket criado com sucesso. Continue com os outros testes.');
      }
    } catch (error: any) {
      addLog(`❌ Exceção ao criar bucket: ${error.message}`);
      setResult('Erro ao criar bucket. Verifique os logs.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Criar uma imagem simples para teste
  const createTestImage = (): Promise<File> => {
    return new Promise((resolve) => {
      // Criar um canvas para desenhar uma imagem simples
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Desenhar um retângulo vermelho
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 200, 200);
        
        // Adicionar texto
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Teste Supabase', 30, 100);
      }
      
      // Converter para blob e criar um arquivo
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `teste-${Date.now()}.png`, { type: 'image/png' });
          resolve(file);
        } else {
          // Fallback para um pequeno arquivo de texto se não conseguir criar a imagem
          const textBlob = new Blob(['Arquivo de teste'], { type: 'text/plain' });
          resolve(new File([textBlob], 'fallback.txt', { type: 'text/plain' }));
        }
      }, 'image/png');
    });
  };

  // 4. Teste de upload direto para o bucket
  const testDirectUpload = async () => {
    setLoading(true);
    addLog("🔍 Teste 3: Fazendo upload direto para o bucket...");

    try {
      // Criar arquivo para teste
      const file = await createTestImage();
      addLog(`📂 Arquivo de teste criado: ${file.name} (${file.size} bytes) - Tipo: ${file.type}`);
      
      // Gerar um nome de arquivo único
      const fileName = `teste-direto-${uuidv4()}.png`;
      addLog(`📝 Nome gerado para o arquivo: ${fileName}`);
      
      // Verificar se o bucket existe
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        addLog(`❌ Erro ao verificar buckets: ${bucketsError.message}`);
      } else {
        const hasBucket = buckets.some(b => b.name === 'car-images');
        addLog(`ℹ️ Bucket 'car-images' ${hasBucket ? 'encontrado' : 'NÃO encontrado'}`);
      }
      
      // Upload para o storage
      addLog(`⬆️ Iniciando upload do arquivo...`);
      const { data, error } = await supabase.storage
        .from('car-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        addLog(`❌ Erro no upload: ${error.message}`);
        addLog(`❓ Informações adicionais de erro: ${JSON.stringify(error)}`);
        
        if (error.message.includes('permission') || error.message.includes('not authorized')) {
          addLog(`⚠️ Parece ser um problema de permissão. Verifique as políticas do bucket.`);
        }
        setResult('Falha no upload direto. Verifique os logs.');
      } else {
        addLog(`✅ Upload concluído com sucesso! Path: ${data.path}`);
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/car-images/${fileName}`;
        addLog(`🔗 URL pública: ${publicUrl}`);
        
        // Verificar se a URL é acessível
        try {
          addLog(`🔍 Verificando se a URL é acessível...`);
          const response = await fetch(publicUrl, { method: 'HEAD' });
          if (response.ok) {
            addLog(`✅ URL pública está acessível! Status: ${response.status}`);
          } else {
            addLog(`⚠️ URL pública retornou status ${response.status}`);
          }
        } catch (error: any) {
          addLog(`⚠️ Erro ao verificar URL pública: ${error.message}`);
        }
        
        setResult(`Upload bem-sucedido! URL: ${publicUrl}`);
      }
    } catch (error: any) {
      addLog(`❌ Exceção no upload: ${error.message}`);
      addLog(`🔍 Stack de erro: ${error.stack}`);
      setResult('Erro no upload direto. Verifique os logs.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Teste de inserção no banco de dados
  const testDatabaseInsert = async () => {
    setLoading(true);
    addLog("🔍 Teste 4: Inserindo registro na tabela car_images...");

    try {
      // Criar um ID de teste para o carro
      const carId = uuidv4();
      addLog(`🚗 ID de carro gerado para teste: ${carId}`);
      
      // URL fictícia para teste
      const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/car-images/teste-db-${Date.now()}.jpg`;
      addLog(`🔗 URL de imagem para teste: ${imageUrl}`);
      
      // Tentar inserir na tabela car_images
      const { data, error } = await supabase
        .from('car_images')
        .insert({
          car_id: carId,
          image_url: imageUrl,
          is_primary: true
        })
        .select();
        
      if (error) {
        addLog(`❌ Erro ao inserir no banco: ${error.message}`);
        
        if (error.message.includes('violates foreign key constraint')) {
          addLog(`⚠️ Erro de chave estrangeira. Precisamos de um car_id válido.`);
          
          // Tentar criar um carro primeiro
          addLog(`🔄 Tentando criar um carro primeiro...`);
          const { data: carData, error: carError } = await supabase
            .from('car_ads')
            .insert({
              title: 'Carro de teste',
              price: 10000,
              brand: 'Teste',
              model: 'Teste',
              year: '2023',
              color: 'Preto',
              transmission: 'Manual',
              mileage: '0',
              description: 'Veículo de teste para diagnóstico do sistema',
              whatsapp: '11912345678',
              status: 'pending'
            })
            .select('id')
            .single();
            
          if (carError) {
            addLog(`❌ Erro ao criar carro: ${carError.message}`);
          } else if (carData) {
            const newCarId = carData.id;
            addLog(`✅ Carro criado com ID: ${newCarId}`);
            
            // Tentar inserir novamente com o ID válido
            addLog(`🔄 Tentando inserir com ID válido...`);
            const { data: imageData, error: imageError } = await supabase
              .from('car_images')
              .insert({
                car_id: newCarId,
                image_url: imageUrl,
                is_primary: true
              })
              .select();
              
            if (imageError) {
              addLog(`❌ Erro ao inserir novamente: ${imageError.message}`);
            } else {
              addLog(`✅ Inserção no banco bem-sucedida!`);
              setResult('Inserção no banco bem-sucedida após criar carro.');
              return;
            }
          }
        }
        
        setResult('Falha ao inserir no banco. Verifique os logs.');
      } else {
        addLog(`✅ Inserção no banco bem-sucedida! ID: ${data[0]?.id}`);
        setResult('Inserção no banco bem-sucedida!');
      }
    } catch (error: any) {
      addLog(`❌ Exceção ao inserir no banco: ${error.message}`);
      setResult('Erro ao inserir no banco. Verifique os logs.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Teste completo (upload + inserção)
  const testCompleteFlow = async () => {
    setLoading(true);
    addLog("🔍 Teste 5: Fluxo completo (upload + inserção no banco)...");

    try {
      // 1. Criar carro para teste
      addLog(`🚗 Criando carro para teste...`);
      const { data: carData, error: carError } = await supabase
        .from('car_ads')
        .insert({
          title: 'Carro de teste completo',
          price: 10000,
          brand: 'Teste',
          model: 'Completo',
          year: '2023',
          color: 'Vermelho',
          transmission: 'Automático',
          mileage: '0',
          description: 'Veículo de teste para diagnóstico do sistema completo',
          whatsapp: '11912345678',
          status: 'pending'
        })
        .select('id')
        .single();
        
      if (carError) {
        addLog(`❌ Erro ao criar carro: ${carError.message}`);
        setResult('Falha ao criar carro para teste. Verifique os logs.');
        setLoading(false);
        return;
      }
      
      const carId = carData.id;
      addLog(`✅ Carro criado com ID: ${carId}`);
      
      // 2. Criar imagem de teste
      const file = await createTestImage();
      addLog(`📂 Arquivo de teste criado: ${file.name} (${file.size} bytes)`);
      
      // 3. Gerar nome único para a imagem
      const fileName = `${carId}/${uuidv4()}.png`;
      addLog(`📝 Nome gerado para o arquivo: ${fileName}`);
      
      // 4. Upload para o storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        addLog(`❌ Erro no upload: ${uploadError.message}`);
        setResult('Falha no upload da imagem. Verifique os logs.');
        setLoading(false);
        return;
      }
      
      addLog(`✅ Upload concluído com sucesso! Path: ${uploadData.path}`);
      
      // 5. Criar URL pública
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/car-images/${fileName}`;
      addLog(`🔗 URL pública: ${publicUrl}`);
      
      // 6. Inserir no banco
      const { data: imageData, error: imageError } = await supabase
        .from('car_images')
        .insert({
          car_id: carId,
          image_url: publicUrl,
          is_primary: true
        })
        .select();
        
      if (imageError) {
        addLog(`❌ Erro ao inserir imagem no banco: ${imageError.message}`);
        setResult('Falha ao inserir imagem no banco. Verifique os logs.');
      } else {
        addLog(`✅ Inserção no banco bem-sucedida! ID: ${imageData[0]?.id}`);
        setResult(`Fluxo completo bem-sucedido! ID da imagem: ${imageData[0]?.id}`);
      }
    } catch (error: any) {
      addLog(`❌ Exceção no fluxo completo: ${error.message}`);
      setResult('Erro no fluxo completo. Verifique os logs.');
    } finally {
      setLoading(false);
    }
  };

  // 7. Limpar logs
  const clearLogs = () => {
    setLogMessages([]);
    setResult('');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Diagnóstico de Upload de Imagens</CardTitle>
          <CardDescription>
            Esta página executa vários testes para identificar problemas com uploads de imagens para o Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={testListBuckets} 
              disabled={loading}
              variant="outline"
            >
              1. Listar Buckets
            </Button>
            
            <Button 
              onClick={testCreateBucket} 
              disabled={loading}
              variant="outline"
            >
              2. Criar Bucket
            </Button>
            
            <Button 
              onClick={testDirectUpload} 
              disabled={loading}
              variant="outline"
            >
              3. Testar Upload Direto
            </Button>
            
            <Button 
              onClick={testDatabaseInsert} 
              disabled={loading}
              variant="outline"
            >
              4. Testar Inserção no BD
            </Button>
            
            <Button 
              onClick={testCompleteFlow} 
              disabled={loading}
              variant="outline"
            >
              5. Testar Fluxo Completo
            </Button>
            
            <Button 
              onClick={clearLogs} 
              disabled={loading}
              variant="destructive"
            >
              Limpar Logs
            </Button>
          </div>
          
          {result && (
            <div className={`mt-6 p-4 rounded-md ${result.includes('erro') || result.includes('falha') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              <p className="font-medium">{result}</p>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="bg-black text-green-400 font-mono p-4 rounded-md h-64 overflow-y-auto text-sm">
            {logMessages.length > 0 ? (
              logMessages.map((log, i) => (
                <div key={i}>{log}</div>
              ))
            ) : (
              <div className="text-gray-500">Execute um teste para ver os logs aqui...</div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Esta página ajuda a identificar onde está o problema com o upload de imagens.
            Execute os testes na sequência para diagnosticar o problema.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestUpload;
