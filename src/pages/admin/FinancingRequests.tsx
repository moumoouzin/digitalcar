
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Trash2, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Interface que reflete a estrutura na tabela do Supabase
interface FinancingRequest {
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

export default function FinancingRequests() {
  const [requests, setRequests] = useState<FinancingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FinancingRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFinancingRequests();
  }, []);

  async function fetchFinancingRequests() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financing_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Financing requests fetched:', data);
      setRequests(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar pedidos de financiamento:', error);
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message || "Não foi possível carregar os pedidos de financiamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  function confirmDelete(id: string) {
    setRequestToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!requestToDelete) return;
    
    try {
      setDeleteLoading(true);
      console.log('Deleting financing request with ID:', requestToDelete);
      
      // Usar await para garantir que a operação seja concluída antes de prosseguir
      const { error, data } = await supabase
        .from('financing_requests')
        .delete()
        .eq('id', requestToDelete)
        .select();
      
      console.log('Delete operation response:', { error, data });
        
      if (error) {
        console.error('Error from Supabase delete operation:', error);
        throw error;
      }
      
      console.log('Delete successful, removing from state');
      
      // Atualizar a lista removendo o item excluído
      setRequests(prev => prev.filter(req => req.id !== requestToDelete));
      
      toast({
        title: "Pedido excluído",
        description: "O pedido de financiamento foi excluído com sucesso",
      });
      
    } catch (error: any) {
      console.error('Erro ao excluir pedido:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o pedido",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
      setDeleteLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusBadge(status?: string) {
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
  }

  function viewDetails(request: FinancingRequest) {
    setSelectedRequest(request);
    setDetailsOpen(true);
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pedidos de Financiamento</h1>
        <Button onClick={fetchFinancingRequests} variant="outline" disabled={loading}>
          {loading ? <Spinner /> : "Atualizar"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-lg text-gray-500 mb-4">Nenhum pedido de financiamento encontrado</p>
            <p className="text-sm text-gray-400">Os pedidos aparecerão aqui quando os clientes preencherem o formulário de financiamento.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {formatDate(request.created_at)}
                    </TableCell>
                    <TableCell>
                      {request.name || "—"}
                    </TableCell>
                    <TableCell>
                      {request.vehicle_brand && request.vehicle_model 
                        ? `${request.vehicle_brand} ${request.vehicle_model}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {request.vehicle_value 
                        ? `R$ ${request.vehicle_value}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => viewDetails(request)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Link to={`/admin/painel/financiamento/${request.id}`}>
                          <Button variant="ghost" size="icon">
                            <FileText size={16} />
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => confirmDelete(request.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de detalhes */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido de Financiamento</DialogTitle>
            <DialogDescription>
              Pedido realizado em {selectedRequest && formatDate(selectedRequest.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Veículo</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Marca:</span>
                    <span>{selectedRequest.vehicle_brand || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modelo:</span>
                    <span>{selectedRequest.vehicle_model || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ano:</span>
                    <span>{selectedRequest.vehicle_year || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valor:</span>
                    <span>R$ {selectedRequest.vehicle_value || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Entrada:</span>
                    <span>R$ {selectedRequest.down_payment || "—"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nome:</span>
                    <span>{selectedRequest.name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span>{selectedRequest.email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Telefone:</span>
                    <span>{selectedRequest.phone || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CPF:</span>
                    <span>{selectedRequest.cpf || "—"}</span>
                  </div>
                </CardContent>
              </Card>

              {(selectedRequest.occupation || selectedRequest.workplace_type || selectedRequest.gross_income) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Profissionais</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ocupação:</span>
                      <span>{selectedRequest.occupation || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipo de Trabalho:</span>
                      <span>{selectedRequest.workplace_type || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Renda Bruta:</span>
                      <span>R$ {selectedRequest.gross_income || "—"}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Status do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <span>Status atual:</span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline"
                      onClick={async () => {
                        try {
                          const { error } = await supabase
                            .from('financing_requests')
                            .update({ status: 'approved' })
                            .eq('id', selectedRequest.id);
                            
                          if (error) throw error;
                          
                          // Atualizar o estado local
                          setSelectedRequest({
                            ...selectedRequest,
                            status: 'approved'
                          });
                          
                          // Atualizar a lista de pedidos
                          setRequests(requests.map(req => 
                            req.id === selectedRequest.id 
                              ? { ...req, status: 'approved' } 
                              : req
                          ));
                          
                          toast({
                            title: "Status atualizado",
                            description: "O pedido foi aprovado com sucesso",
                          });
                        } catch (error: any) {
                          toast({
                            title: "Erro ao atualizar status",
                            description: error.message,
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Aprovar
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={async () => {
                        try {
                          const { error } = await supabase
                            .from('financing_requests')
                            .update({ status: 'reviewing' })
                            .eq('id', selectedRequest.id);
                            
                          if (error) throw error;
                          
                          // Atualizar o estado local
                          setSelectedRequest({
                            ...selectedRequest,
                            status: 'reviewing'
                          });
                          
                          // Atualizar a lista de pedidos
                          setRequests(requests.map(req => 
                            req.id === selectedRequest.id 
                              ? { ...req, status: 'reviewing' } 
                              : req
                          ));
                          
                          toast({
                            title: "Status atualizado",
                            description: "O pedido foi marcado como em análise",
                          });
                        } catch (error: any) {
                          toast({
                            title: "Erro ao atualizar status",
                            description: error.message,
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Em análise
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={async () => {
                        try {
                          const { error } = await supabase
                            .from('financing_requests')
                            .update({ status: 'denied' })
                            .eq('id', selectedRequest.id);
                            
                          if (error) throw error;
                          
                          // Atualizar o estado local
                          setSelectedRequest({
                            ...selectedRequest,
                            status: 'denied'
                          });
                          
                          // Atualizar a lista de pedidos
                          setRequests(requests.map(req => 
                            req.id === selectedRequest.id 
                              ? { ...req, status: 'denied' } 
                              : req
                          ));
                          
                          toast({
                            title: "Status atualizado",
                            description: "O pedido foi negado",
                          });
                        } catch (error: any) {
                          toast({
                            title: "Erro ao atualizar status",
                            description: error.message,
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Negar
                    </Button>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Link to={`/admin/painel/financiamento/${selectedRequest.id}`}>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileText size={16} />
                        Ver página completa
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir este pedido de financiamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setRequestToDelete(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleteLoading}
            >
              {deleteLoading ? <Spinner size="sm" /> : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
