-- Verifica se a tabela já existe antes de tentar criá-la
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'financing_requests') THEN
        -- Cria a tabela financing_requests
        CREATE TABLE public.financing_requests (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            status TEXT DEFAULT 'Pendente',
            
            -- Dados do veículo
            vehicle_brand TEXT NOT NULL,
            vehicle_model TEXT NOT NULL,
            vehicle_color TEXT NOT NULL,
            vehicle_year TEXT NOT NULL,
            vehicle_value TEXT NOT NULL,
            down_payment TEXT,
            installments TEXT,
            
            -- Dados pessoais
            name TEXT NOT NULL,
            rg TEXT NOT NULL,
            cpf TEXT NOT NULL,
            birth_date TEXT NOT NULL,
            mother_name TEXT NOT NULL,
            father_name TEXT,
            nationality TEXT NOT NULL,
            marital_status TEXT NOT NULL,
            gender TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            address_complement TEXT,
            zip_code TEXT NOT NULL,
            neighborhood TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            residence_type TEXT NOT NULL,
            
            -- Dados profissionais
            company TEXT NOT NULL,
            cnpj TEXT,
            role TEXT NOT NULL,
            income TEXT NOT NULL,
            work_address TEXT NOT NULL,
            work_number TEXT NOT NULL,
            work_complement TEXT,
            work_zip_code TEXT NOT NULL,
            work_neighborhood TEXT NOT NULL,
            work_city TEXT NOT NULL,
            work_state TEXT NOT NULL,
            work_phone TEXT NOT NULL,
            time_at_work TEXT NOT NULL,
            
            -- Dados bancários
            bank TEXT NOT NULL,
            agency TEXT NOT NULL,
            account TEXT NOT NULL,
            account_type TEXT NOT NULL,
            
            -- Informações adicionais
            additional_info TEXT,
            
            -- Documentos (flags)
            residence_proof BOOLEAN DEFAULT false,
            income_proof BOOLEAN DEFAULT false,
            driver_license BOOLEAN DEFAULT false
        );

        -- Adiciona comentário à tabela
        COMMENT ON TABLE public.financing_requests IS 'Tabela para armazenar solicitações de financiamento de veículos';
        
        -- Configura permissões e políticas de segurança
        ALTER TABLE public.financing_requests ENABLE ROW LEVEL SECURITY;
        
        -- Criando políticas de acesso
        CREATE POLICY "Permitir inserção para todos" 
        ON public.financing_requests FOR INSERT 
        WITH CHECK (true);
        
        CREATE POLICY "Permitir leitura para todos" 
        ON public.financing_requests FOR SELECT 
        USING (true);
        
        CREATE POLICY "Permitir atualização para todos" 
        ON public.financing_requests FOR UPDATE 
        USING (true);
        
        RAISE NOTICE 'Tabela financing_requests criada com sucesso!';
    ELSE
        RAISE NOTICE 'A tabela financing_requests já existe.';
    END IF;
END $$; 