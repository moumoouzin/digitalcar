-- Remover as políticas existentes (se houver) para evitar conflitos
DROP POLICY IF EXISTS delete_financing_requests_policy ON financing_requests;
DROP POLICY IF EXISTS select_financing_requests_policy ON financing_requests;
DROP POLICY IF EXISTS insert_financing_requests_policy ON financing_requests;
DROP POLICY IF EXISTS update_financing_requests_policy ON financing_requests;

-- Criar uma política que permita qualquer pessoa inserir dados
-- (útil para o formulário público de financiamento)
CREATE POLICY insert_financing_requests_policy ON financing_requests 
  FOR INSERT TO public 
  WITH CHECK (true);

-- Criar uma política que permita qualquer pessoa (autenticada ou não) selecionar dados
-- Assim a página de admin poderá listar os financiamentos
CREATE POLICY select_financing_requests_policy ON financing_requests 
  FOR SELECT TO public
  USING (true);

-- Criar uma política que permita qualquer pessoa atualizar dados
-- (útil para o painel administrativo)
CREATE POLICY update_financing_requests_policy ON financing_requests 
  FOR UPDATE TO public
  USING (true);

-- Criar uma política que permita qualquer pessoa excluir dados
-- (útil para o painel administrativo)
CREATE POLICY delete_financing_requests_policy ON financing_requests 
  FOR DELETE TO public
  USING (true);

-- Reabilitar RLS se estiver desabilitado
ALTER TABLE financing_requests ENABLE ROW LEVEL SECURITY; 