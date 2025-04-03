-- Verificar se a tabela já existe
CREATE TABLE IF NOT EXISTS financing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  
  -- Dados do veículo
  vehicle_brand VARCHAR(100) NOT NULL,
  vehicle_model VARCHAR(100) NOT NULL,
  vehicle_color VARCHAR(50) NOT NULL,
  vehicle_year VARCHAR(20) NOT NULL,
  vehicle_value VARCHAR(50) NOT NULL,
  down_payment VARCHAR(50),
  installments VARCHAR(10),
  
  -- Dados pessoais
  name VARCHAR(100) NOT NULL,
  rg VARCHAR(20) NOT NULL,
  cpf VARCHAR(20) NOT NULL,
  birth_date VARCHAR(20) NOT NULL,
  mother_name VARCHAR(100) NOT NULL,
  father_name VARCHAR(100),
  nationality VARCHAR(50) NOT NULL,
  marital_status VARCHAR(20) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- Endereço
  address VARCHAR(200) NOT NULL,
  address_complement VARCHAR(100),
  zip_code VARCHAR(20) NOT NULL,
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  residence_type VARCHAR(50) NOT NULL,
  
  -- Dados profissionais
  company VARCHAR(100) NOT NULL,
  cnpj VARCHAR(20),
  role VARCHAR(100) NOT NULL,
  income VARCHAR(50) NOT NULL,
  work_address VARCHAR(200) NOT NULL,
  work_number VARCHAR(20) NOT NULL,
  work_complement VARCHAR(100),
  work_zip_code VARCHAR(20) NOT NULL,
  work_neighborhood VARCHAR(100) NOT NULL,
  work_city VARCHAR(100) NOT NULL,
  work_state VARCHAR(50) NOT NULL,
  work_phone VARCHAR(20) NOT NULL,
  time_at_work VARCHAR(50) NOT NULL,
  
  -- Dados bancários
  bank VARCHAR(100) NOT NULL,
  agency VARCHAR(20) NOT NULL,
  account VARCHAR(20) NOT NULL,
  account_type VARCHAR(20) NOT NULL,
  
  -- Informações adicionais
  additional_info TEXT,
  
  -- Documentos enviados (flags)
  residence_proof BOOLEAN NOT NULL DEFAULT FALSE,
  income_proof BOOLEAN NOT NULL DEFAULT FALSE,
  driver_license BOOLEAN NOT NULL DEFAULT FALSE
);

-- Criar índice para melhorar performance em buscas pelo status
CREATE INDEX IF NOT EXISTS idx_financing_requests_status ON financing_requests(status);

-- Criar índice para buscas por data de criação (útil para ordenação)
CREATE INDEX IF NOT EXISTS idx_financing_requests_created_at ON financing_requests(created_at);

-- Criar índice para buscar por nome (útil em pesquisas)
CREATE INDEX IF NOT EXISTS idx_financing_requests_name ON financing_requests(name);

-- Adicionar permissões RLS (Row Level Security)
ALTER TABLE financing_requests ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que apenas usuários autenticados possam inserir dados
CREATE POLICY insert_financing_requests_policy ON financing_requests 
  FOR INSERT WITH CHECK (true);

-- Criar política para permitir que apenas usuários autenticados possam visualizar todos os registros
CREATE POLICY select_financing_requests_policy ON financing_requests 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Criar política para permitir que apenas usuários autenticados possam atualizar registros
CREATE POLICY update_financing_requests_policy ON financing_requests 
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Criar política para permitir que apenas usuários autenticados possam excluir registros
CREATE POLICY delete_financing_requests_policy ON financing_requests 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Comentário na tabela para documentação
COMMENT ON TABLE financing_requests IS 'Armazena solicitações de financiamento de veículos submetidas pelos usuários'; 