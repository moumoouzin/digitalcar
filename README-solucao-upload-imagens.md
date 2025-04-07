# Solução para Upload de Imagens no Supabase

Este documento contém instruções passo a passo para implementar a nova solução de upload de imagens para o Supabase.

## 🔍 Visão Geral

A solução consiste em:

1. **Novos serviços e componentes**:
   - `imageService.ts`: Serviço para gerenciar todas as operações com imagens
   - `ImageUploader.tsx`: Componente reutilizável para upload de imagens
   - `useImageUploader.tsx`: Hook para acessar o uploader de forma imperativa
   
2. **Scripts SQL para configuração do Supabase**:
   - `setup_car_images.sql`: Configura tabela, índices, triggers e políticas
   - `fix_car_images_policies.sql`: Configura políticas de storage

3. **Atualização dos componentes existentes**:
   - `CreateCar.tsx` e `EditCar.tsx` usando o novo sistema

## 🛠️ Passo a Passo para Implementação

### 1. Configuração do Backend (Supabase)

1. **Execute o script SQL principal**:
   - Acesse o [Console do Supabase](https://app.supabase.com/)
   - Vá para a seção "SQL Editor"
   - Crie um novo script
   - Cole o conteúdo do arquivo `setup_car_images.sql`
   - Execute o script

2. **Configure as políticas de Storage**:
   - No Console do Supabase, vá para "Storage"
   - Verifique se existe o bucket `car-images`
   - Se não existir, crie-o e marque como público
   - Vá para a aba "Policies" do bucket
   - Crie as seguintes políticas:
     - **SELECT**: para permitir visualização pública
     - **INSERT**: para permitir upload público
     - **UPDATE**: para permitir atualização pública
     - **DELETE**: para permitir exclusão pública
   - Use `bucket_id = 'car-images'` como condição

   Alternativamente, execute o script `fix_car_images_policies.sql` no SQL Editor.

### 2. Implementação no Frontend

1. **Copie os novos arquivos para o projeto**:
   - `src/services/imageService.ts`
   - `src/components/ImageUploader.tsx`
   - `src/hooks/useImageUploader.tsx`

2. **Atualize os componentes existentes**:
   - Substitua o código em `CreateCar.tsx` e `EditCar.tsx`
   - Remova qualquer implementação antiga de gerenciamento de imagens

3. **Verifique as dependências**:
   - Certifique-se de que `uuid` está instalado:
     ```bash
     npm install uuid
     npm install @types/uuid --save-dev
     ```

## ⚙️ Como Funciona

### 1. Serviço de Imagens (`imageService.ts`)

Este serviço gerencia todas as operações relacionadas a imagens:

- `verificarBucket()`: Verifica/cria o bucket de storage
- `uploadImagem()`: Faz upload de uma imagem para o Supabase
- `removerImagem()`: Remove uma imagem do banco e do storage
- `listarImagensCarro()`: Lista todas as imagens de um carro
- `definirImagemPrimaria()`: Define uma imagem como primária

### 2. Componente de Upload (`ImageUploader.tsx`)

Um componente reutilizável que:

- Exibe previews de imagens existentes e novas
- Permite selecionar novas imagens
- Gerencia remoção de imagens
- Mostra indicadores de progresso durante o upload
- Expõe função de upload via callback

### 3. Hook Personalizável (`useImageUploader.tsx`)

Um hook que facilita o uso do componente:

```jsx
const { ImageUploaderComponent, uploadImages } = useImageUploader();

// No render:
<ImageUploaderComponent carroId={id} imagensExistentes={existingImages} />

// Para fazer upload (por exemplo, ao enviar o formulário):
await uploadImages(carId);
```

## 🚀 Testando a Solução

1. **Verifique o console do navegador** enquanto utiliza o uploader, em busca de logs de debug
2. **Teste a criação de anúncios** com várias imagens
3. **Teste a edição de anúncios** existentes, adicionando e removendo imagens
4. **Verifique no Supabase** se os registros estão sendo criados corretamente na tabela `car_images`
5. **Verifique no Storage** se os arquivos estão sendo armazenados no bucket `car-images`

## 🔍 Resolução de Problemas

Se encontrar problemas:

1. **Verifique os logs no console do navegador**
2. **Certifique-se de que as políticas estão corretas** no Supabase
3. **Verifique o tamanho das imagens** (limite de 5MB)
4. **Teste formatos simples** como JPG/PNG
5. **Verifique permissões CORS** no Supabase

Se os problemas persistirem, inspecione as requisições de rede no navegador para identificar erros específicos do Supabase.

## 📝 Notas Adicionais

- A tabela `car_images` tem um trigger que garante apenas uma imagem primária por carro
- O sistema suporta até 10 imagens por anúncio (configurável via prop `maxImagens`)
- Imagens maiores que 5MB serão rejeitadas
- As imagens são armazenadas em subpastas por ID do carro (`car-id/uuid.jpg`)
- A política de cache das imagens está configurada para 1 hora (3600 segundos) 