-- Arquivo: setup_car_images.sql
-- Este script configura a tabela car_images e os recursos de storage necessários para
-- o funcionamento correto do upload de imagens no Supabase.

-- =============================================
-- Parte 1: Verificar e criar a tabela car_images
-- =============================================

-- Verificar se a tabela existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'car_images'
    ) THEN
        -- Criar tabela car_images
        CREATE TABLE public.car_images (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            car_id UUID NOT NULL REFERENCES car_ads(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            is_primary BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT now()
        );
        
        -- Adicionar comentários
        COMMENT ON TABLE public.car_images IS 'Armazena informações sobre imagens de carros';
        COMMENT ON COLUMN public.car_images.id IS 'ID único da imagem';
        COMMENT ON COLUMN public.car_images.car_id IS 'ID do anúncio do carro (referência à tabela car_ads)';
        COMMENT ON COLUMN public.car_images.image_url IS 'URL completa da imagem';
        COMMENT ON COLUMN public.car_images.is_primary IS 'Indica se esta é a imagem principal do anúncio';
        COMMENT ON COLUMN public.car_images.created_at IS 'Data e hora em que a imagem foi cadastrada';
    ELSE
        RAISE NOTICE 'Tabela car_images já existe.';
    END IF;
END
$$;

-- =============================================
-- Parte 2: Criar índices e constraints
-- =============================================

-- Índice para melhorar consultas por car_id
CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON public.car_images(car_id);

-- Índice para otimizar consultas por imagens primárias
CREATE INDEX IF NOT EXISTS idx_car_images_is_primary ON public.car_images(is_primary) WHERE is_primary = true;

-- =============================================
-- Parte 3: Ativar RLS (Row Level Security)
-- =============================================

-- Ativar RLS para a tabela
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Parte 4: Criar políticas para a tabela car_images
-- =============================================

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS car_images_insert_policy ON public.car_images;
DROP POLICY IF EXISTS car_images_select_policy ON public.car_images;
DROP POLICY IF EXISTS car_images_update_policy ON public.car_images;
DROP POLICY IF EXISTS car_images_delete_policy ON public.car_images;

-- Criar política para inserção (qualquer usuário pode inserir)
CREATE POLICY car_images_insert_policy 
ON public.car_images FOR INSERT 
TO public
WITH CHECK (true);

-- Criar política para leitura (qualquer usuário pode visualizar)
CREATE POLICY car_images_select_policy 
ON public.car_images FOR SELECT 
TO public
USING (true);

-- Criar política para atualização (qualquer usuário pode atualizar)
CREATE POLICY car_images_update_policy 
ON public.car_images FOR UPDATE 
TO public
USING (true);

-- Criar política para exclusão (qualquer usuário pode excluir)
CREATE POLICY car_images_delete_policy 
ON public.car_images FOR DELETE 
TO public
USING (true);

-- =============================================
-- Parte 5: Configurar storage (bucket car-images)
-- =============================================

-- Verificar se a extensão para storage está ativada
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- As políticas para buckets devem ser configuradas pela UI do Supabase ou via API
-- As seguintes políticas são necessárias:

/*
-- Política para permitir leitura pública
CREATE POLICY "Permitir acesso público para visualização" 
ON storage.objects FOR SELECT 
TO public
USING (bucket_id = 'car-images');

-- Política para permitir upload público
CREATE POLICY "Permitir upload de imagens" 
ON storage.objects FOR INSERT 
TO public
WITH CHECK (bucket_id = 'car-images');

-- Política para permitir atualização pública
CREATE POLICY "Permitir atualização de imagens" 
ON storage.objects FOR UPDATE 
TO public
USING (bucket_id = 'car-images');

-- Política para permitir exclusão pública
CREATE POLICY "Permitir deleção de imagens" 
ON storage.objects FOR DELETE 
TO public
USING (bucket_id = 'car-images');
*/

-- Instruções para configuração do bucket via UI do Supabase:
-- 1. Acesse o painel do Supabase e vá para "Storage"
-- 2. Crie um bucket chamado 'car-images' e marque como público
-- 3. Na aba "Policies", crie as seguintes políticas:
--    - SELECT policy: Permitir acesso público para visualização (bucket_id = 'car-images')
--    - INSERT policy: Permitir upload de imagens (bucket_id = 'car-images')
--    - UPDATE policy: Permitir atualização de imagens (bucket_id = 'car-images')
--    - DELETE policy: Permitir deleção de imagens (bucket_id = 'car-images')
--
-- OU execute o script 'fix_car_images_policies.sql' para configurar as políticas.

-- =============================================
-- Parte 6: Criar função auxiliar para gerenciar imagens principais
-- =============================================

-- Função que garante apenas uma imagem primária por carro
CREATE OR REPLACE FUNCTION public.manage_primary_car_image()
RETURNS TRIGGER AS $$
BEGIN
    -- Se a nova imagem é marcada como primária
    IF NEW.is_primary THEN
        -- Remover o status primário de todas as outras imagens do mesmo carro
        UPDATE public.car_images
        SET is_primary = false
        WHERE car_id = NEW.car_id
          AND id <> NEW.id
          AND is_primary = true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover o trigger se existir
DROP TRIGGER IF EXISTS trigger_manage_primary_car_image ON public.car_images;

-- Criar o trigger
CREATE TRIGGER trigger_manage_primary_car_image
BEFORE INSERT OR UPDATE ON public.car_images
FOR EACH ROW
EXECUTE FUNCTION public.manage_primary_car_image();

-- =============================================
-- Parte 7: Criar função para verificar se o bucket existe
-- =============================================

-- Esta função não pode ser criada diretamente no SQL,
-- precisa ser implementada no código da aplicação.
-- Veja a função verificarBucket() no arquivo imageService.ts 