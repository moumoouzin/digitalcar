# Solução para Problemas de Upload de Imagens no Supabase

Este documento fornece instruções passo a passo para resolver problemas relacionados ao upload, visualização e exclusão de imagens no Supabase.

## Problema

O upload de imagens não está funcionando corretamente devido a:

1. Possíveis políticas de segurança (RLS) restritivas no bucket de storage
2. Erros no manuseio de erros durante o processo de upload
3. Problemas com configurações de acesso ao bucket 'car-images'

## Solução

### 1. Verificar e configurar as políticas no Supabase

Acesse o painel do Supabase e execute os seguintes passos:

#### 1.1 Configurar políticas para o bucket 'car-images'

1. Vá para a seção **Storage** no menu lateral
2. Selecione o bucket **car-images** (ou crie-o caso não exista)
3. Vá para a aba **Policies**
4. Crie as seguintes políticas (clique em "New Policy" para cada uma):

   a. **Política para SELECT (visualização)**
   - Nome: `allow_public_select_car_images`
   - Permissão: SELECT
   - Usuários: Para TODOS OS USUÁRIOS (public)
   - Definição da política: `(bucket_id = 'car-images')`

   b. **Política para INSERT (upload)**
   - Nome: `allow_public_insert_car_images`
   - Permissão: INSERT
   - Usuários: Para TODOS OS USUÁRIOS (public)
   - Definição da política: `(bucket_id = 'car-images')`

   c. **Política para DELETE (exclusão)**
   - Nome: `allow_public_delete_car_images`
   - Permissão: DELETE
   - Usuários: Para TODOS OS USUÁRIOS (public)
   - Definição da política: `(bucket_id = 'car-images')`

#### 1.2 Configurar políticas para a tabela 'car_images'

1. Vá para **Table Editor** no menu lateral
2. Selecione a tabela **car_images**
3. Vá para a aba **Policies**
4. Ative RLS (Row Level Security) se ainda não estiver ativado
5. Crie as seguintes políticas:

   a. **Política para INSERT**
   - Nome: `car_images_insert_policy`
   - Permissão: INSERT
   - Usuários: Para TODOS OS USUÁRIOS (public)
   - Definição da política: `true`

   b. **Política para SELECT**
   - Nome: `car_images_select_policy`
   - Permissão: SELECT
   - Usuários: Para TODOS OS USUÁRIOS (public)
   - Definição da política: `true`

   c. **Política para UPDATE**
   - Nome: `car_images_update_policy`
   - Permissão: UPDATE
   - Usuários: Para TODOS OS USUÁRIOS (public)
   - Definição da política: `true`

   d. **Política para DELETE**
   - Nome: `car_images_delete_policy`
   - Permissão: DELETE
   - Usuários: Para TODOS OS USUÁRIOS (public)
   - Definição da política: `true`

### 2. Alternativa: Usar o Editor SQL do Supabase

Como alternativa, você pode executar o script SQL disponível em `p-714904/sql/fix_car_images_policies.sql` no Editor SQL do Supabase.

1. Vá para a seção **SQL Editor** no painel do Supabase
2. Crie um novo script e cole o conteúdo do arquivo `fix_car_images_policies.sql`
3. Execute o script

Nota: Se ocorrer algum erro indicando que as políticas já existem, você pode usar as versões com `DROP IF EXISTS` comentadas no final do arquivo.

### 3. Verifique se você está usando a implementação correta

Certifique-se de que:

1. A função `uploadImageToSupabase` está sendo importada do hook `useImageHandling` em `imageUtils.ts`
2. Não existem implementações duplicadas da função em arquivos como `CreateCar.tsx` ou `EditCar.tsx`

## Como testar

Após aplicar as alterações:

1. Abra o Chrome DevTools (F12)
2. Vá para a aba **Console**
3. Tente adicionar uma imagem ao criar ou editar um anúncio
4. Observe os logs no console para verificar se o processo está sendo executado corretamente

## Dicas para solução de problemas

- Verifique se o tamanho da imagem não excede 5MB
- Tente com imagens simples no formato JPG
- Verifique se o bucket 'car-images' está configurado como público
- Certifique-se de que não há regras CORS bloqueando as requisições

## Suporte

Se os problemas persistirem, verifique:

1. Os logs do console do navegador para mensagens de erro específicas
2. O log de requisições na aba Network do DevTools para ver detalhes das chamadas à API
3. As configurações de autenticação do Supabase no arquivo de configuração do cliente 