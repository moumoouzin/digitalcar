# Solução para o problema de Destaques

Estamos enfrentando um erro ao tentar marcar anúncios como destaque: **"Could not find the 'is_featured' column of 'car_ads' in the schema cache"**

Este erro ocorre porque o campo `is_featured` está definido nos tipos TypeScript, mas não existe no banco de dados Supabase.

## Etapas para resolver

### 1. Execute o SQL no Console do Supabase

1. Acesse o painel do Supabase: https://app.supabase.com
2. Navegue até seu projeto
3. Clique em "SQL Editor" no menu lateral
4. Clique em "Nova Consulta"
5. Cole o seguinte código SQL e execute:

```sql
-- 1. Adicionar a coluna is_featured
ALTER TABLE public.car_ads 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 2. Desativar RLS temporariamente para facilitar os testes
ALTER TABLE public.car_ads DISABLE ROW LEVEL SECURITY;

-- 3. Definir valores padrão para registros existentes
UPDATE public.car_ads 
SET is_featured = false 
WHERE is_featured IS NULL;

-- 4. Criar função RPC para alternar destaque 
CREATE OR REPLACE FUNCTION toggle_car_featured(car_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_value BOOLEAN;
BEGIN
  -- Obtém o valor atual
  SELECT is_featured INTO current_value 
  FROM car_ads 
  WHERE id = car_id;
  
  -- Se for null, considera como falso
  IF current_value IS NULL THEN
    current_value := false;
  END IF;
  
  -- Inverte o valor
  UPDATE car_ads 
  SET is_featured = NOT current_value 
  WHERE id = car_id;
  
  -- Retorna o novo valor
  RETURN NOT current_value;
END;
$$;

-- 5. Verificar se as alterações foram aplicadas
SELECT id, title, is_featured FROM public.car_ads LIMIT 5;
```

### 2. Recarregue o aplicativo

Depois de executar o SQL, volte ao aplicativo e recarregue a página. Tente marcar um anúncio como destaque novamente.

### 3. Se ainda houver problemas

Se ainda encontrar erros, verifique o console do navegador para ver a mensagem de erro exata. A modificação que fizemos no código deve mostrar mais detalhes sobre o erro.

## O que foi modificado

1. Adicionamos a coluna `is_featured` ao banco de dados
2. Criamos uma função `refreshSchemaCache` para atualizar o cache de esquema
3. Modificamos a função `handleToggleFeatured` para tentar múltiplas abordagens:
   - Primeiro tenta atualizar o cache
   - Usa REST API direto se o método normal falhar
   - Exibe mensagens de erro mais detalhadas

## Informações para desenvolvedores

O erro acontece porque o Supabase mantém um cache do esquema do banco de dados. Quando adicionamos uma coluna nova, esse cache pode ficar desatualizado. As soluções incluem:

1. Atualizar o cache usando uma consulta à API REST
2. Usar REST API direto em vez do cliente Supabase
3. Recriar o cliente Supabase

Se as etapas acima não funcionarem, você pode precisar implementar uma abordagem diferente para armazenar os destaques, como uma tabela separada. 