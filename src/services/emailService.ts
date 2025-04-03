
/**
 * Serviço responsável por salvar as solicitações de financiamento no Supabase
 */
import { supabase } from '@/integrations/supabase/client';

// Interface para os dados do formulário de financiamento
export interface FinancingFormData {
  // Informações do veículo
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleValue?: string;
  downPayment?: string;
  installments?: string;
  vehicleColor?: string;
  
  // Informações pessoais
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  motherName?: string;
  fatherName?: string;
  nationality?: string;
  maritalStatus?: string;
  gender?: string;
  
  // Endereço
  address?: string;
  addressComplement?: string;
  zipCode?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  residenceType?: string;
  
  // Dados profissionais
  company?: string;
  cnpj?: string;
  role?: string;
  income?: string;
  workAddress?: string;
  workNumber?: string;
  workComplement?: string;
  workZipCode?: string;
  workNeighborhood?: string;
  workCity?: string;
  workState?: string;
  workPhone?: string;
  timeAtWork?: string;
  
  // Dados bancários
  bank?: string;
  agency?: string;
  account?: string;
  accountType?: string;
  
  // Informações adicionais
  additionalInfo?: string;
  
  // Flags de documentos
  residenceProof?: boolean;
  incomeProof?: boolean;
  driverLicense?: boolean;
  
  // URLs para os documentos (opcional)
  residenceProofUrl?: string;
  incomeProofUrl?: string;
  driverLicenseUrl?: string;
}

/**
 * Salva a solicitação de financiamento no Supabase
 */
export async function sendFinancingEmail(formData: FinancingFormData): Promise<string> {
  try {
    // Salvando os dados no Supabase
    const { error } = await supabase
      .from('financing_requests')
      .insert({
        // Dados do veículo
        vehicle_brand: formData.vehicleBrand || '',
        vehicle_model: formData.vehicleModel || '',
        vehicle_year: formData.vehicleYear || '',
        vehicle_value: formData.vehicleValue || '',
        down_payment: formData.downPayment || null,
        installments: formData.installments || null,
        vehicle_color: formData.vehicleColor || '',
        
        // Dados pessoais
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        cpf: formData.cpf || '',
        rg: formData.rg || '',
        birth_date: formData.birthDate || '',
        mother_name: formData.motherName || '',
        father_name: formData.fatherName || null,
        nationality: formData.nationality || '',
        marital_status: formData.maritalStatus || '',
        gender: formData.gender || '',
        
        // Endereço
        address: formData.address || '',
        address_complement: formData.addressComplement || null,
        zip_code: formData.zipCode || '',
        neighborhood: formData.neighborhood || '',
        city: formData.city || '',
        state: formData.state || '',
        residence_type: formData.residenceType || '',
        
        // Dados profissionais
        company: formData.company || '',
        cnpj: formData.cnpj || null,
        role: formData.role || '',
        income: formData.income || '',
        work_address: formData.workAddress || '',
        work_number: formData.workNumber || '',
        work_complement: formData.workComplement || null,
        work_zip_code: formData.workZipCode || '',
        work_neighborhood: formData.workNeighborhood || '',
        work_city: formData.workCity || '',
        work_state: formData.workState || '',
        work_phone: formData.workPhone || '',
        time_at_work: formData.timeAtWork || '',
        
        // Dados bancários
        bank: formData.bank || '',
        agency: formData.agency || '',
        account: formData.account || '',
        account_type: formData.accountType || '',
        
        // Informações adicionais
        additional_info: formData.additionalInfo || null,
        
        // URLs para os documentos
        residence_proof_url: formData.residenceProofUrl || null,
        income_proof_url: formData.incomeProofUrl || null,
        driver_license_url: formData.driverLicenseUrl || null,
        
        // Flags de documentos
        residence_proof: formData.residenceProof || false,
        income_proof: formData.incomeProof || false,
        driver_license: formData.driverLicense || false,
        
        // Status inicial
        status: 'new'
      });

    if (error) {
      console.error('Erro ao salvar solicitação:', error);
      throw new Error(`Falha ao salvar solicitação: ${error.message}`);
    }

    return 'Solicitação de financiamento enviada com sucesso! Entraremos em contato em breve.';
  } catch (error: any) {
    console.error('Erro no processo de envio:', error);
    throw new Error(`Falha ao enviar formulário: ${error.message}`);
  }
}
