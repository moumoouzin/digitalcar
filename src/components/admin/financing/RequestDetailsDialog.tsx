
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { FinancingRequest } from './types';
import { StatusBadge } from './RequestsTable';

interface RequestDetailsDialogProps {
  request: FinancingRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatDate: (dateString: string) => string;
  onStatusUpdate: (request: FinancingRequest, newStatus: string) => Promise<void>;
}

export function RequestDetailsDialog({ 
  request, 
  open, 
  onOpenChange, 
  formatDate,
  onStatusUpdate
}: RequestDetailsDialogProps) {
  const { toast } = useToast();
  
  if (!request) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await onStatusUpdate(request, newStatus);
      toast({
        title: "Status atualizado",
        description: getStatusUpdateMessage(newStatus),
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusUpdateMessage = (status: string) => {
    switch (status) {
      case 'approved': return "O pedido foi aprovado com sucesso";
      case 'reviewing': return "O pedido foi marcado como em análise";
      case 'denied': return "O pedido foi negado";
      default: return "Status atualizado com sucesso";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido de Financiamento</DialogTitle>
          <DialogDescription>
            Pedido realizado em {formatDate(request.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Marca:</span>
                <span>{request.vehicle_brand || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Modelo:</span>
                <span>{request.vehicle_model || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ano:</span>
                <span>{request.vehicle_year || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valor:</span>
                <span>R$ {request.vehicle_value || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Entrada:</span>
                <span>R$ {request.down_payment || "—"}</span>
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
                <span>{request.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span>{request.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Telefone:</span>
                <span>{request.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">CPF:</span>
                <span>{request.cpf || "—"}</span>
              </div>
            </CardContent>
          </Card>

          {(request.occupation || request.workplace_type || request.gross_income) && (
            <Card>
              <CardHeader>
                <CardTitle>Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ocupação:</span>
                  <span>{request.occupation || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipo de Trabalho:</span>
                  <span>{request.workplace_type || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Renda Bruta:</span>
                  <span>R$ {request.gross_income || "—"}</span>
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
                <StatusBadge status={request.status} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleStatusUpdate('approved')}
                >
                  Aprovar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStatusUpdate('reviewing')}
                >
                  Em análise
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleStatusUpdate('denied')}
                >
                  Negar
                </Button>
              </div>
              <div className="mt-4 flex justify-between">
                <Link to={`/admin/painel/financiamento/${request.id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText size={16} />
                    Ver página completa
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
