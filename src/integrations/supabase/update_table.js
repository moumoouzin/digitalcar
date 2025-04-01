import { supabase } from './client.js';

// Função para adicionar a coluna is_featured à tabela car_ads
async function addFeaturedColumnToCarAds() {
  console.log('Iniciando a atualização da tabela car_ads...');
  
  try {
    // Método 1: Podemos tentar adicionar a coluna diretamente através da API
    const { error } = await supabase
      .from('car_ads')
      .update({ is_featured: false })
      .is('is_featured', null);
    
    if (error) {
      console.error('Erro ao atualizar tabela:', error);
      return;
    }
    
    console.log('Tabela car_ads atualizada com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar a tabela:', error);
  }
}

// Executar a função
addFeaturedColumnToCarAds(); 