-- Criar uma função SQL para alternar o destaque de um anúncio
-- Executar isto no console SQL do Supabase

CREATE OR REPLACE FUNCTION toggle_car_featured(car_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_value BOOLEAN;
BEGIN
  -- Primeiro, verificamos se a coluna existe
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'car_ads' 
    AND column_name = 'is_featured'
  ) THEN
    -- Se a coluna não existir, criamos ela
    ALTER TABLE car_ads ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;
  
  -- Obtém o valor atual
  SELECT is_featured INTO current_value 
  FROM car_ads 
  WHERE id = car_id;
  
  -- Se for null, considera como falso
  IF current_value IS NULL THEN
    current_value := false;
  END IF;
  
  -- Inverte o valor
  UPDATE car_ads 
  SET is_featured = NOT current_value 
  WHERE id = car_id;
  
  -- Retorna o novo valor
  RETURN NOT current_value;
END;
$$; 