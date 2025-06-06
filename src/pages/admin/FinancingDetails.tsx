import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FinancingData {
  id: string;
  created_at: string;
  status: string;
  
  // Dados do veículo
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  vehicle_year?: string;
  vehicle_value?: string;
  down_payment?: string;
  installments?: string;
  
  // Dados pessoais
  name?: string;
  cpf?: string;
  rg?: string;
  birth_date?: string;
  mother_name?: string;
  father_name?: string;
  nationality?: string;
  marital_status?: string;
  gender?: string;
  email?: string;
  phone?: string;
  
  // Endereço
  address?: string;
  address_complement?: string;
  zip_code?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  residence_type?: string;
  
  // Dados profissionais
  profession?: string;
  role?: string;
  company?: string;
  cnpj?: string;
  income?: string;
  time_at_work?: string;
  work_address?: string;
  work_number?: string;
  work_complement?: string;
  work_zip_code?: string;
  work_neighborhood?: string;
  work_city?: string;
  work_state?: string;
  work_phone?: string;
  
  // Dados bancários
  bank?: string;
  agency?: string;
  account?: string;
  account_type?: string;
  
  // Informações adicionais
  additional_info?: string;
  
  // Documentos
  residence_proof?: boolean;
  income_proof?: boolean;
  driver_license?: boolean;
}

const FinancingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<FinancingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Carregar dados da solicitação
  useEffect(() => {
    const fetchFinancingData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('financing_requests')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          if (error.code === '42P01') { // Código para "relação não existe"
            toast({
              title: "Tabela não encontrada",
              description: "A tabela de solicitações de financiamento ainda não foi criada no banco de dados.",
              variant: "destructive",
            });
            navigate('/admin/painel/dashboard');
            return;
          }
          
          throw error;
        }
        
        setData(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do financiamento:', error);
        toast({
          title: "Erro ao carregar detalhes",
          description: "Não foi possível carregar os detalhes da solicitação.",
          variant: "destructive",
        });
        navigate('/admin/painel/financiamentos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFinancingData();
  }, [id, navigate, toast]);
  
  // Função para atualizar o status de uma solicitação
  const updateStatus = async (status: string) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('financing_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Status atualizado",
        description: `A solicitação foi marcada como "${status}".`,
        variant: "default",
      });
      
      // Atualizar os dados locais
      setData(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da solicitação.",
        variant: "destructive",
      });
    }
  };
  
  // Função para obter a cor do badge de status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-500';
      case 'Recusado':
        return 'bg-red-500';
      case 'Em análise':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500'; // Pendente
    }
  };
  
  // Função para formatar a data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado";
    
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };
  
  // Renderiza um item de informação
  const renderInfoItem = (label: string, value?: string | boolean) => {
    if (value === undefined || value === null) return null;
    
    let displayValue: React.ReactNode = "Não informado";
    
    if (typeof value === 'boolean') {
      displayValue = value ? "Sim" : "Não";
    } else if (value.trim() !== "") {
      displayValue = value;
    }
    
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
        <p className="mt-1">{displayValue}</p>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Carregando detalhes...</span>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Solicitação não encontrada</h2>
        <Button asChild>
          <Link to="/admin/painel/financiamentos">Voltar para a lista</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link to="/admin/painel/financiamentos">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detalhes do Financiamento</h1>
            <p className="text-muted-foreground">
              Solicitação de {data.name} em {formatDate(data.created_at)}
            </p>
          </div>
        </div>
        
        <Badge className={getStatusBadgeColor(data.status)}>
          {data.status}
        </Badge>
      </div>
      
      {/* Ações rápidas */}
      {(data.status === 'Pendente' || data.status === 'Em análise') && (
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {data.status === 'Pendente' && (
                <Button 
                  variant="outline" 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => updateStatus('Em análise')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Marcar em análise
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="text-green-600 hover:text-green-800"
                onClick={() => updateStatus('Aprovado')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar financiamento
              </Button>
              
              <Button 
                variant="outline" 
                className="text-red-600 hover:text-red-800"
                onClick={() => updateStatus('Recusado')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Recusar financiamento
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Informações do veículo */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Veículo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInfoItem("Marca", data.vehicle_brand)}
          {renderInfoItem("Modelo", data.vehicle_model)}
          {renderInfoItem("Cor", data.vehicle_color)}
          {renderInfoItem("Ano", data.vehicle_year)}
          {renderInfoItem("Valor", data.vehicle_value)}
        </CardContent>
      </Card>
      
      {/* Dados pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            {renderInfoItem("Nome completo", data.name)}
            {renderInfoItem("CPF", data.cpf)}
            {renderInfoItem("RG", data.rg)}
            {renderInfoItem("Data de nascimento", data.birth_date)}
            {renderInfoItem("Nome da mãe", data.mother_name)}
            {renderInfoItem("Nome do pai", data.father_name)}
          </div>
          <div>
            {renderInfoItem("Nacionalidade", data.nationality)}
            {renderInfoItem("Estado civil", data.marital_status)}
            {renderInfoItem("Gênero", data.gender)}
            {renderInfoItem("Email", data.email)}
            {renderInfoItem("Telefone", data.phone)}
          </div>
          <div>
            {renderInfoItem("Endereço", data.address)}
            {renderInfoItem("Complemento", data.address_complement)}
            {renderInfoItem("CEP", data.zip_code)}
            {renderInfoItem("Bairro", data.neighborhood)}
            {renderInfoItem("Cidade", data.city)}
            {renderInfoItem("Estado", data.state)}
            {renderInfoItem("Tipo de residência", data.residence_type)}
          </div>
        </CardContent>
      </Card>
      
      {/* Dados profissionais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderInfoItem("Profissão", data.profession)}
            {renderInfoItem("Cargo", data.role)}
            {renderInfoItem("Empresa", data.company)}
            {renderInfoItem("CNPJ", data.cnpj)}
            {renderInfoItem("Renda mensal", data.income)}
            {renderInfoItem("Tempo de empresa", data.time_at_work)}
          </div>
          <div>
            {renderInfoItem("Endereço comercial", data.work_address)}
            {renderInfoItem("Número", data.work_number)}
            {renderInfoItem("Complemento", data.work_complement)}
            {renderInfoItem("CEP", data.work_zip_code)}
            {renderInfoItem("Bairro", data.work_neighborhood)}
            {renderInfoItem("Cidade", data.work_city)}
            {renderInfoItem("Estado", data.work_state)}
            {renderInfoItem("Telefone comercial", data.work_phone)}
          </div>
        </CardContent>
      </Card>
      
      {/* Dados bancários */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Bancários</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInfoItem("Banco", data.bank)}
          {renderInfoItem("Agência", data.agency)}
          {renderInfoItem("Conta", data.account)}
          {renderInfoItem("Tipo de conta", data.account_type)}
        </CardContent>
      </Card>
      
      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderInfoItem("Valor de entrada", data.down_payment)}
            {renderInfoItem("Prazo de financiamento", data.installments)}
          </div>
          <div>
            {renderInfoItem("Informações adicionais", data.additional_info)}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Documentos enviados</h4>
              <ul className="list-disc pl-5">
                {data.driver_license && <li>Documento de identificação (CNH)</li>}
                {data.residence_proof && <li>Comprovante de residência</li>}
                {data.income_proof && <li>Comprovante de renda</li>}
                {!data.driver_license && !data.residence_proof && !data.income_proof && 
                  <li>Nenhum documento enviado</li>
                }
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancingDetails;
