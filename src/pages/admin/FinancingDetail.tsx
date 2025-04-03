
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Printer, Download, ChevronLeft, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Interface completa para solicitação de financiamento
interface FinancingRequest {
  id: string;
  created_at: string;
  status?: string;
  
  // Veículo
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_value?: string;
  vehicle_color?: string;
  down_payment?: string;
  installments?: string;
  
  // Dados pessoais
  name?: string;
  rg?: string;
  cpf?: string;
  birth_date?: string;
  mother_name?: string;
  father_name?: string;
  nationality?: string;
  marital_status?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  address_complement?: string;
  zip_code?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  residence_type?: string;
  
  // Dados profissionais
  company?: string;
  cnpj?: string;
  role?: string;
  income?: string;
  work_address?: string;
  work_number?: string;
  work_complement?: string;
  work_zip_code?: string;
  work_neighborhood?: string;
  work_city?: string;
  work_state?: string;
  work_phone?: string;
  time_at_work?: string;
  
  // Dados bancários
  bank?: string;
  agency?: string;
  account?: string;
  account_type?: string;
  
  // Documentos
  residence_proof_url?: string;
  income_proof_url?: string;
  driver_license_url?: string;
  
  additional_info?: string;
}

export default function FinancingDetail() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<FinancingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchFinancingRequest();
  }, [id]);
  
  const fetchFinancingRequest = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financing_requests')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setRequest(data);
    } catch (error: any) {
      console.error('Erro ao buscar solicitação de financiamento:', error);
      setError(error.message || 'Erro ao carregar os dados');
      toast({
        title: 'Erro ao carregar solicitação',
        description: error.message || 'Não foi possível carregar os detalhes do financiamento',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'denied':
        return <Badge className="bg-red-500">Negado</Badge>;
      case 'reviewing':
        return <Badge className="bg-yellow-500">Em análise</Badge>;
      default:
        return <Badge className="bg-blue-500">Novo</Badge>;
    }
  };
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Financiamento-${request?.name || 'Cliente'}-${request?.vehicle_brand || ''}-${request?.vehicle_model || ''}`,
    onAfterPrint: () => toast({
      title: 'Impressão',
      description: 'Documento enviado para impressão',
    }),
  });
  
  const handleDownloadPDF = async () => {
    try {
      if (!printRef.current) return;
      
      toast({
        title: 'Gerando PDF',
        description: 'Aguarde enquanto geramos o arquivo...',
      });
      
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm (210 x 297)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 210; // A4 width
      const pageHeight = 297; // A4 height
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add subsequent pages if content is too long
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`Financiamento-${request?.name || 'Cliente'}-${request?.vehicle_brand || ''}-${request?.vehicle_model || ''}.pdf`);
      
      toast({
        title: 'PDF Gerado',
        description: 'O arquivo PDF foi baixado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: 'Erro ao gerar PDF',
        description: error.message || 'Não foi possível gerar o arquivo PDF',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error || !request) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            {error || 'Solicitação não encontrada'}
          </h2>
          <p className="mb-6">Não foi possível carregar os detalhes da solicitação de financiamento.</p>
          <Button onClick={() => navigate('/admin/painel/financiamentos')}>
            Voltar para a lista
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/painel/financiamentos')}
          >
            <ChevronLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detalhes do Financiamento</h1>
            <p className="text-gray-500">Solicitado em {formatDate(request.created_at)}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>Imprimir</span>
          </Button>
          
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={handleDownloadPDF}
          >
            <Download size={16} />
            <span>Baixar PDF</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-sm print:shadow-none" ref={printRef}>
        <div className="flex justify-between border-b border-gray-200 pb-6 mb-6 print:flex-col">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Solicitação de Financiamento</h2>
            </div>
            <p className="text-gray-500">
              ID: {request.id}
            </p>
            <p className="text-gray-500">
              Data: {formatDate(request.created_at)}
            </p>
          </div>
          
          <div className="flex flex-col items-end print:items-start print:mt-4">
            <div className="mb-2">Status: {getStatusBadge(request.status)}</div>
            {request.name && <p className="font-semibold">{request.name}</p>}
            {request.email && <p className="text-gray-600">{request.email}</p>}
            {request.phone && <p className="text-gray-600">{request.phone}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Marca</p>
                <p className="font-medium">{request.vehicle_brand || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Modelo</p>
                <p className="font-medium">{request.vehicle_model || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ano</p>
                <p className="font-medium">{request.vehicle_year || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cor</p>
                <p className="font-medium">{request.vehicle_color || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor do Veículo</p>
                <p className="font-medium">R$ {request.vehicle_value || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entrada</p>
                <p className="font-medium">R$ {request.down_payment || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Parcelas</p>
                <p className="font-medium">{request.installments || "—"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome Completo</p>
                <p className="font-medium">{request.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="font-medium">{request.cpf || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RG</p>
                <p className="font-medium">{request.rg || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Nascimento</p>
                <p className="font-medium">{request.birth_date || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado Civil</p>
                <p className="font-medium">{request.marital_status || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nacionalidade</p>
                <p className="font-medium">{request.nationality || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nome da Mãe</p>
                <p className="font-medium">{request.mother_name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nome do Pai</p>
                <p className="font-medium">{request.father_name || "—"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Logradouro</p>
                <p className="font-medium">{request.address || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Complemento</p>
                <p className="font-medium">{request.address_complement || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bairro</p>
                <p className="font-medium">{request.neighborhood || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CEP</p>
                <p className="font-medium">{request.zip_code || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cidade</p>
                <p className="font-medium">{request.city || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium">{request.state || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Residência</p>
                <p className="font-medium">{request.residence_type || "—"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dados Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Empresa</p>
                <p className="font-medium">{request.company || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CNPJ</p>
                <p className="font-medium">{request.cnpj || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cargo</p>
                <p className="font-medium">{request.role || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Renda</p>
                <p className="font-medium">R$ {request.income || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tempo de Trabalho</p>
                <p className="font-medium">{request.time_at_work || "—"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Endereço de Trabalho</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Endereço</p>
                <p className="font-medium">{request.work_address || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Número</p>
                <p className="font-medium">{request.work_number || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Complemento</p>
                <p className="font-medium">{request.work_complement || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bairro</p>
                <p className="font-medium">{request.work_neighborhood || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CEP</p>
                <p className="font-medium">{request.work_zip_code || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cidade</p>
                <p className="font-medium">{request.work_city || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium">{request.work_state || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">{request.work_phone || "—"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dados Bancários</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Banco</p>
                <p className="font-medium">{request.bank || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Agência</p>
                <p className="font-medium">{request.agency || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Conta</p>
                <p className="font-medium">{request.account || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Conta</p>
                <p className="font-medium">{request.account_type || "—"}</p>
              </div>
            </CardContent>
          </Card>
          
          {request.additional_info && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{request.additional_info}</p>
              </CardContent>
            </Card>
          )}
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <FileText className="w-8 h-8 mb-2 text-gray-700" />
                <h3 className="font-medium mb-2">Comprovante de Residência</h3>
                {request.residence_proof_url ? (
                  <a 
                    href={request.residence_proof_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    Visualizar
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Não enviado</p>
                )}
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <FileText className="w-8 h-8 mb-2 text-gray-700" />
                <h3 className="font-medium mb-2">Comprovante de Renda</h3>
                {request.income_proof_url ? (
                  <a 
                    href={request.income_proof_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    Visualizar
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Não enviado</p>
                )}
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <FileText className="w-8 h-8 mb-2 text-gray-700" />
                <h3 className="font-medium mb-2">CNH</h3>
                {request.driver_license_url ? (
                  <a 
                    href={request.driver_license_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    Visualizar
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Não enviado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
