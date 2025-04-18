import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipo para as solicitações de financiamento
interface FinancingRequest {
  id: string;
  created_at: string;
  status: string;
  vehicle_brand: string;
  vehicle_model: string;
  name: string;
  email: string;
  phone: string;
}

const FinancingList = () => {
  const [requests, setRequests] = useState<FinancingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<FinancingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Buscar solicitações de financiamento
  const fetchRequests = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('financing_requests')
        .select('id, created_at, status, vehicle_brand, vehicle_model, name, email, phone')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar solicitações:', error);
        
        if (error.code === '42P01') { // Código para "relação não existe"
          toast({
            title: "Tabela não encontrada",
            description: "A tabela de solicitações de financiamento ainda não foi criada no banco de dados.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        
        // Definir arrays vazios para evitar erros de renderização
        setRequests([]);
        setFilteredRequests([]);
        return;
      }
      
      setRequests(data || []);
      setFilteredRequests(data || []);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      toast({
        title: "Erro ao carregar solicitações",
        description: "Não foi possível carregar as solicitações de financiamento.",
        variant: "destructive",
      });
      
      // Definir arrays vazios para evitar erros de renderização
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar solicitações ao montar o componente
  useEffect(() => {
    fetchRequests();
  }, []);
  
  // Atualizar solicitações filtradas quando os filtros mudarem
  useEffect(() => {
    filterRequests();
  }, [searchTerm, statusFilter, requests]);
  
  // Função para filtrar solicitações
  const filterRequests = () => {
    let filtered = [...requests];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        request => 
          request.name.toLowerCase().includes(term) ||
          request.email.toLowerCase().includes(term) ||
          request.vehicle_brand.toLowerCase().includes(term) ||
          request.vehicle_model.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(filtered);
  };
  
  // Função para atualizar o status de uma solicitação
  const updateStatus = async (id: string, status: string) => {
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
      
      // Atualizar a lista
      setRequests(prev => 
        prev.map(req => 
          req.id === id ? { ...req, status } : req
        )
      );
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
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Solicitações de Financiamento</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as solicitações de financiamento de veículos.
          </p>
        </div>
        
        <Button onClick={fetchRequests} variant="outline">
          Atualizar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as solicitações por status ou termo de busca</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nome, email, marca ou modelo..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Recusado">Recusado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-lg text-muted-foreground">Carregando solicitações...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Nenhuma solicitação de financiamento encontrada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{formatDate(request.created_at)}</TableCell>
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>{request.vehicle_brand} {request.vehicle_model}</TableCell>
                    <TableCell>
                      <div>{request.email}</div>
                      <div className="text-sm text-muted-foreground">{request.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/admin/painel/financing/${request.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        
                        {request.status === 'Pendente' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => updateStatus(request.id, 'Em análise')}
                          >
                            Analisar
                          </Button>
                        )}
                        
                        {(request.status === 'Pendente' || request.status === 'Em análise') && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-800"
                              onClick={() => updateStatus(request.id, 'Aprovado')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => updateStatus(request.id, 'Recusado')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Recusar
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancingList;
