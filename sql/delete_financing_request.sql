-- Função para garantir a exclusão segura e efetiva de um pedido de financiamento
CREATE OR REPLACE FUNCTION public.delete_financing_request(request_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Isso garante que a função seja executada com as permissões do criador
AS $$
DECLARE
  deletion_result boolean;
BEGIN
  -- Verifica se o ID é válido
  IF request_id IS NULL THEN
    RAISE EXCEPTION 'ID do pedido de financiamento não pode ser nulo';
  END IF;
  
  -- Tenta excluir o registro e retorna o resultado
  DELETE FROM public.financing_requests 
  WHERE id = request_id;
  
  -- Verifica se a exclusão foi bem-sucedida
  GET DIAGNOSTICS deletion_result = ROW_COUNT;
  
  -- Retorna true se pelo menos uma linha foi afetada (deletada)
  RETURN deletion_result > 0;
END;
$$; 