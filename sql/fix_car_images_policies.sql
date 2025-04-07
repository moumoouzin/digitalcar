-- Arquivo: fix_car_images_policies.sql
-- Descrição: Este arquivo contém comandos SQL para corrigir políticas de segurança 
-- relacionadas ao upload e gerenciamento de imagens no Supabase.

-- Parte 1: Configurar políticas para o bucket de storage 'car-images'
-- Estas políticas permitem acesso público para visualização, upload e exclusão de imagens

-- Política para permitir visualização pública de imagens
BEGIN;
CREATE POLICY "allow_public_select_car_images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');
COMMIT;

-- Política para permitir upload público de imagens
BEGIN;
CREATE POLICY "allow_public_insert_car_images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'car-images');
COMMIT;

-- Política para permitir exclusão pública de imagens
BEGIN;
CREATE POLICY "allow_public_delete_car_images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'car-images');
COMMIT;

-- Parte 2: Configurar políticas para a tabela 'car_images'
-- Estas políticas permitem operações públicas na tabela que armazena metadados das imagens

-- Ativar Row Level Security (RLS) para a tabela
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de registros na tabela
CREATE POLICY "car_images_insert_policy"
ON car_images FOR INSERT
TO public
WITH CHECK (true);

-- Política para permitir visualização de registros na tabela
CREATE POLICY "car_images_select_policy"
ON car_images FOR SELECT
TO public
USING (true);

-- Política para permitir atualização de registros na tabela
CREATE POLICY "car_images_update_policy"
ON car_images FOR UPDATE
TO public
USING (true);

-- Política para permitir exclusão de registros na tabela
CREATE POLICY "car_images_delete_policy"
ON car_images FOR DELETE
TO public
USING (true);

-- Nota: Se houver erros indicando que as políticas já existem, 
-- você pode usar a versão DROP IF EXISTS + CREATE:

/*
BEGIN;
DROP POLICY IF EXISTS "allow_public_select_car_images" ON storage.objects;
CREATE POLICY "allow_public_select_car_images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');
COMMIT;

-- Repita o padrão para as outras políticas
*/ 