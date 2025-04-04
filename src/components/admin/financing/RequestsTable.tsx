
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { FinancingRequest } from './types';

interface RequestsTableProps {
  requests: FinancingRequest[];
  loading: boolean;
  onDelete: (id: string) => void;
  onViewDetails: (request: FinancingRequest) => void;
  formatDate: (dateString: string) => string;
}

export function RequestsTable({ 
  requests, 
  loading, 
  onDelete, 
  onViewDetails,
  formatDate 
}: RequestsTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-500 mb-4">Nenhum pedido de financiamento encontrado</p>
        <p className="text-sm text-gray-400">Os pedidos aparecerão aqui quando os clientes preencherem o formulário de financiamento.</p>
      </div>
    );
  }

  return (
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
              <StatusBadge status={request.status} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onViewDetails(request)}
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
                  onClick={() => onDelete(request.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function StatusBadge({ status }: { status?: string }) {
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
