import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ler as credenciais do Supabase do arquivo .env ou definir diretamente (apenas para desenvolvimento)
const supabaseUrl = 'https://jqrwvfmbocfpspomwddq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcndwZm1ib2NmcHNwb213ZGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2MTUxNDUsImV4cCI6MjAxOTE5MTE0NX0.GZKKvOj7wKvwZ0QbKbzZIAUQUzioswXJOZE7r6bU3Ug';

// Inicializar o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function addFeaturedColumn() {
  try {
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'add_featured_field.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Executar o SQL usando a função rpc do Supabase
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Erro ao executar SQL:', error);
      return;
    }
    
    console.log('Campo is_featured adicionado com sucesso à tabela car_ads');
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Executar a função
addFeaturedColumn(); 