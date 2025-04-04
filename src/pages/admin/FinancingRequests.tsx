import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';

// Componentes refatorados
import { RequestsTable } from '@/components/admin/financing/RequestsTable';
import { RequestDetailsDialog } from '@/components/admin/financing/RequestDetailsDialog';
import { DeleteRequestDialog } from '@/components/admin/financing/DeleteRequestDialog';
import { FinancingRequest } from '@/components/admin/financing/types';

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
      console.log('Deletando pedido de financiamento com ID:', requestToDelete);
      
      // Excluir o pedido
      const { error } = await supabase
        .from('financing_requests')
        .delete()
        .eq('id', requestToDelete);
      
      if (error) {
        console.error('Erro na operação de exclusão do Supabase:', error);
        throw error;
      }
      
      // Verificar se o registro ainda existe
      const { data: checkData } = await supabase
        .from('financing_requests')
        .select('id')
        .eq('id', requestToDelete)
        .single();
      
      if (checkData) {
        console.error('O registro ainda existe após a tentativa de exclusão');
        throw new Error('Não foi possível excluir o registro completamente');
      }
      
      console.log('Exclusão bem-sucedida e verificada');
      
      // Remover do estado local
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
      
      // Recarregar dados para garantir sincronização
      await fetchFinancingRequests();
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

  function viewDetails(request: FinancingRequest) {
    setSelectedRequest(request);
    setDetailsOpen(true);
  }

  async function updateRequestStatus(request: FinancingRequest, newStatus: string) {
    try {
      const { error } = await supabase
        .from('financing_requests')
        .update({ status: newStatus })
        .eq('id', request.id);
        
      if (error) throw error;
      
      // Atualizar o estado local
      setSelectedRequest({
        ...request,
        status: newStatus
      });
      
      // Atualizar a lista de pedidos
      setRequests(requests.map(req => 
        req.id === request.id 
          ? { ...req, status: newStatus } 
          : req
      ));
      
      toast({
        title: "Status atualizado",
        description: `O pedido foi marcado como ${newStatus} com sucesso`,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Não foi possível atualizar o status do pedido",
        variant: "destructive"
      });
      
      // Recarregar dados para garantir sincronização
      await fetchFinancingRequests();
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pedidos de Financiamento</h1>
        <Button onClick={fetchFinancingRequests} variant="outline" disabled={loading}>
          {loading ? <Spinner /> : "Atualizar"}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <RequestsTable
            requests={requests}
            loading={loading}
            onDelete={confirmDelete}
            onViewDetails={viewDetails}
            formatDate={formatDate}
          />
        </CardContent>
      </Card>

      {/* Diálogo de detalhes */}
      <RequestDetailsDialog
        request={selectedRequest}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        formatDate={formatDate}
        onStatusUpdate={updateRequestStatus}
      />

      {/* Diálogo de confirmação de exclusão */}
      <DeleteRequestDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
}
