import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  VehicleInfoStep, 
  PersonalInfoStep, 
  ProfessionalInfoStep, 
  BankInfoStep, 
  AdditionalInfoStep,
  DocumentsStep 
} from "@/components/financing/form-steps";

// Define form steps
const formSteps = [
  "Documentos",
  "Dados do Veículo",
  "Dados Pessoais",
  "Dados Profissionais",
  "Referência Bancária",
  "Informações Adicionais",
];

export const FinancingForm = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFiles, setDocumentFiles] = useState({
    residenceProof: null,
    incomeProof: null,
    driverLicense: null,
    residenceProofUrl: null,
    incomeProofUrl: null,
    driverLicenseUrl: null
  });
  
  // Create form schema
  const formSchema = z.object({
    // Vehicle info
    vehicleBrand: z.string().min(1, "Campo obrigatório"),
    vehicleModel: z.string().min(1, "Campo obrigatório"),
    vehicleColor: z.string().min(1, "Campo obrigatório"),
    vehicleYear: z.string().min(1, "Campo obrigatório"),
    vehicleValue: z.string().min(1, "Campo obrigatório"),
    downPayment: z.string(),
    installments: z.string(),
    
    // Personal info
    name: z.string().min(1, "Campo obrigatório"),
    rg: z.string().min(1, "Campo obrigatório"),
    cpf: z.string().min(11, "CPF inválido"),
    birthDate: z.string().min(1, "Campo obrigatório"),
    motherName: z.string().min(1, "Campo obrigatório"),
    fatherName: z.string().optional(),
    nationality: z.string().min(1, "Campo obrigatório"),
    maritalStatus: z.string().min(1, "Campo obrigatório"),
    gender: z.string().min(1, "Campo obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(1, "Campo obrigatório"),
    address: z.string().min(1, "Campo obrigatório"),
    addressComplement: z.string().optional(),
    zipCode: z.string().min(1, "Campo obrigatório"),
    neighborhood: z.string().min(1, "Campo obrigatório"),
    city: z.string().min(1, "Campo obrigatório"),
    state: z.string().min(1, "Campo obrigatório"),
    residenceType: z.string().min(1, "Campo obrigatório"),
    
    // Professional info
    company: z.string().min(1, "Campo obrigatório"),
    cnpj: z.string().optional(),
    role: z.string().min(1, "Campo obrigatório"),
    income: z.string().min(1, "Campo obrigatório"),
    workAddress: z.string().min(1, "Campo obrigatório"),
    workNumber: z.string().min(1, "Campo obrigatório"),
    workComplement: z.string().optional(),
    workZipCode: z.string().min(1, "Campo obrigatório"),
    workNeighborhood: z.string().min(1, "Campo obrigatório"),
    workCity: z.string().min(1, "Campo obrigatório"),
    workState: z.string().min(1, "Campo obrigatório"),
    workPhone: z.string().min(1, "Campo obrigatório"),
    timeAtWork: z.string().min(1, "Campo obrigatório"),
    
    // Bank info
    bank: z.string().min(1, "Campo obrigatório"),
    agency: z.string().min(1, "Campo obrigatório"),
    account: z.string().min(1, "Campo obrigatório"),
    accountType: z.string().min(1, "Campo obrigatório"),
    
    // Additional info
    additionalInfo: z.string().optional(),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleBrand: "",
      vehicleModel: "",
      vehicleColor: "",
      vehicleYear: "",
      vehicleValue: "",
      downPayment: "",
      installments: "",
      
      name: "",
      rg: "",
      cpf: "",
      birthDate: "",
      motherName: "",
      fatherName: "",
      nationality: "",
      maritalStatus: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      addressComplement: "",
      zipCode: "",
      neighborhood: "",
      city: "",
      state: "",
      residenceType: "",
      
      company: "",
      cnpj: "",
      role: "",
      income: "",
      workAddress: "",
      workNumber: "",
      workComplement: "",
      workZipCode: "",
      workNeighborhood: "",
      workCity: "",
      workState: "",
      workPhone: "",
      timeAtWork: "",
      
      bank: "",
      agency: "",
      account: "",
      accountType: "",
      
      additionalInfo: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Definir carregamento como true
    setIsSubmitting(true);
    
    try {
      // Inserir os dados no Supabase
      const { data: insertedData, error } = await supabase
        .from('financing_requests')
        .insert([
          {
            // Dados do veículo
            vehicle_brand: data.vehicleBrand,
            vehicle_model: data.vehicleModel,
            vehicle_color: data.vehicleColor,
            vehicle_year: data.vehicleYear,
            vehicle_value: data.vehicleValue,
            down_payment: data.downPayment,
            installments: data.installments,
            
            // Dados pessoais
            name: data.name,
            rg: data.rg,
            cpf: data.cpf,
            birth_date: data.birthDate,
            mother_name: data.motherName,
            father_name: data.fatherName,
            nationality: data.nationality,
            marital_status: data.maritalStatus,
            gender: data.gender,
            email: data.email,
            phone: data.phone,
            
            // Endereço
            address: data.address,
            address_complement: data.addressComplement,
            zip_code: data.zipCode,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            residence_type: data.residenceType,
            
            // Dados profissionais
            company: data.company,
            cnpj: data.cnpj,
            role: data.role,
            income: data.income,
            work_address: data.workAddress,
            work_number: data.workNumber,
            work_complement: data.workComplement,
            work_zip_code: data.workZipCode,
            work_neighborhood: data.workNeighborhood,
            work_city: data.workCity,
            work_state: data.workState,
            work_phone: data.workPhone,
            time_at_work: data.timeAtWork,
            
            // Dados bancários
            bank: data.bank,
            agency: data.agency,
            account: data.account,
            account_type: data.accountType,
            
            // Informações adicionais
            additional_info: data.additionalInfo,
            
            // Documentos enviados (flags)
            residence_proof: !!documentFiles.residenceProof,
            income_proof: !!documentFiles.incomeProof,
            driver_license: !!documentFiles.driverLicense,
            
            // URLs dos documentos
            residence_proof_url: documentFiles.residenceProofUrl,
            income_proof_url: documentFiles.incomeProofUrl,
            driver_license_url: documentFiles.driverLicenseUrl,
            
            // Status inicial
            status: "Pendente"
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Mostrar mensagem de sucesso
      toast.success("Solicitação de financiamento enviada com sucesso!");
      
      // Resetar formulário
      form.reset();
      setStep(0);
      setDocumentFiles({
        residenceProof: null,
        incomeProof: null,
        driverLicense: null,
        residenceProofUrl: null,
        incomeProofUrl: null,
        driverLicenseUrl: null
      });
    } catch (error: any) {
      console.error("Erro no envio do formulário:", error);
      toast.error(error.message || "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.");
    } finally {
      // Definir carregamento como false, independente do resultado
      setIsSubmitting(false);
    }
  };

  // Next step handler
  const handleNext = async () => {
    if (step === 0) {
      // Check if all documents are uploaded for step 0
      if (!documentFiles.residenceProof || !documentFiles.incomeProof || !documentFiles.driverLicense) {
        toast.error("Por favor, anexe todos os documentos necessários antes de prosseguir.");
        return;
      }
      setStep(step + 1);
      return;
    }
    
    const fields = getFieldsByStep(step);
    const isValid = await validateFields(fields);
    
    if (isValid) {
      if (step < formSteps.length - 1) {
        setStep(step + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  // Update document files
  const handleDocumentFilesChange = (files) => {
    setDocumentFiles(files);
  };

  // Field validation by step
  const validateFields = async (fields: string[]) => {
    const result = await form.trigger(fields as any);
    return result;
  };

  // Get fields by current step
  const getFieldsByStep = (currentStep: number): string[] => {
    switch (currentStep) {
      case 0: // Documents
        return [];
      case 1: // Vehicle info
        return ["vehicleBrand", "vehicleModel", "vehicleColor", "vehicleYear", "vehicleValue"];
      case 2: // Personal info
        return ["name", "rg", "cpf", "birthDate", "motherName", "nationality", "maritalStatus", "gender", "email", "phone", "address", "zipCode", "neighborhood", "city", "state", "residenceType"];
      case 3: // Professional info
        return ["company", "role", "income", "workAddress", "workNumber", "workZipCode", "workNeighborhood", "workCity", "workState", "workPhone", "timeAtWork"];
      case 4: // Bank info
        return ["bank", "agency", "account", "accountType"];
      case 5: // Additional info
        return [];
      default:
        return [];
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 0:
        return <DocumentsStep files={documentFiles} onFilesChange={handleDocumentFilesChange} />;
      case 1:
        return <VehicleInfoStep form={form} />;
      case 2:
        return <PersonalInfoStep form={form} />;
      case 3:
        return <ProfessionalInfoStep form={form} />;
      case 4:
        return <BankInfoStep form={form} />;
      case 5:
        return <AdditionalInfoStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {formSteps.map((formStep, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center ${index <= step ? "text-red-600" : "text-gray-400"}`}
            >
              <div 
                className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 
                  ${index < step ? "bg-green-500 text-white" : 
                    index === step ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {index < step ? "✓" : index + 1}
              </div>
              <span className="text-xs hidden md:block">{formStep}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute h-1 bg-gray-200 w-full top-0"></div>
          <div 
            className="absolute h-1 bg-red-600 top-0 transition-all duration-300"
            style={{ width: `${(step / (formSteps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 0 ? (
            <DocumentsStep files={documentFiles} onFilesChange={handleDocumentFilesChange} />
          ) : (
            renderStep()
          )}
          
          <div className="flex justify-between pt-4 mt-8 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Voltar
            </Button>
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {step === formSteps.length - 1 ? (
                isSubmitting ? "Enviando..." : "Enviar"
              ) : "Próximo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
