-- 1. Adicionar a coluna is_featured se não existir
ALTER TABLE public.car_ads 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 2. Desativar RLS temporariamente para testar
ALTER TABLE public.car_ads DISABLE ROW LEVEL SECURITY;

-- 3. Atualizar alguns registros para teste
UPDATE public.car_ads 
SET is_featured = false 
WHERE is_featured IS NULL;

-- 4. Reativar RLS (se necessário)
-- ALTER TABLE public.car_ads ENABLE ROW LEVEL SECURITY;

-- 5. Atualizar ou criar políticas RLS para permitir operações
DROP POLICY IF EXISTS "Permitir leitura para todos" ON public.car_ads;
CREATE POLICY "Permitir leitura para todos" 
ON public.car_ads 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir atualizações para todos" ON public.car_ads;
CREATE POLICY "Permitir atualizações para todos" 
ON public.car_ads 
FOR UPDATE USING (true);

-- 6. Verificar se as alterações foram aplicadas
SELECT id, title, is_featured FROM public.car_ads LIMIT 5; 