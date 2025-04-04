
export interface FinancingRequest {
  id: string;
  created_at: string;
  status?: string;
  // Informações do veículo
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_value?: string;
  down_payment?: string;
  // Informações pessoais
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  // Informações profissionais
  occupation?: string;
  workplace_type?: string;
  gross_income?: string;
}
