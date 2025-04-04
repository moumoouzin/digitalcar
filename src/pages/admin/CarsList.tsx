
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle, 
  XCircle,
  Loader2,
  Car,
  Edit,
  Eye,
  MessageSquare,
  MoreVertical,
  Trash,
  X,
  FileText,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase, refreshSchemaCache } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { statusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CarCardSkeleton } from "@/components/cars/CarCardSkeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type CarAd = Database['public']['Tables']['car_ads']['Row'] & {
  car_images?: Array<{
    image_url: string;
    is_primary: boolean | null;
  }>;
  car_features?: Array<{
    feature_id: string;
  }>;
  images?: string[];
  features?: string[];
};

const CarsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cars, setCars] = useState<CarAd[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("car_ads")
        .select(`
          *,
          car_images (*),
          car_features (*)
        `)
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedCars = data.map((car) => {
        const primaryImage = car.car_images?.find((img) => img.is_primary)?.image_url;
        const firstImage = car.car_images?.length > 0 ? car.car_images[0].image_url : null;
        
        return {
          ...car,
          price: car.price,
          features: car.car_features?.map((f) => f.feature_id) || [],
          images: [primaryImage || firstImage].filter(Boolean) as string[]
        };
      });
      
      setCars(formattedCars);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching cars:", error);
      toast({
        title: "Erro ao carregar anúncios",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/painel/car/edit/${id}`);
  };

  const handleView = (id: string) => {
    window.open(`/veiculo/${id}`, "_blank");
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('car_ads')
        .update({ status: 'active' })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setCars(cars.map(car => 
        car.id === id ? { ...car, status: "active" } : car
      ));
      
      toast({
        title: "Anúncio aprovado",
        description: "O anúncio agora está ativo no site.",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Erro ao aprovar anúncio:', error);
      toast({
        title: "Erro ao aprovar anúncio",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      const { error, data } = await supabase
        .from('car_ads')
        .delete()
        .eq('id', id)
        .select();
        
      if (error) {
        throw error;
      }
      
      setCars(cars.filter(car => car.id !== id));
      
      toast({
        title: "Anúncio rejeitado",
        description: "O anúncio foi removido da lista.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error('Erro ao rejeitar anúncio:', error);
      toast({
        title: "Erro ao rejeitar anúncio",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    setCarToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!carToDelete) return;
    
    try {
      setDeleteLoading(true);
      console.log('Deleting car with ID:', carToDelete);
      
      const { error, data } = await supabase
        .from('car_ads')
        .delete()
        .eq('id', carToDelete)
        .select();
        
      console.log('Delete operation response:', { error, data });
      
      if (error) {
        console.error('Error from Supabase delete operation:', error);
        throw error;
      }
      
      console.log('Delete successful, removing from state');
      
      // Atualizar a lista removendo o item excluído
      setCars(prev => prev.filter(car => car.id !== carToDelete));
      
      toast({
        title: "Anúncio excluído",
        description: "O anúncio foi removido permanentemente.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error('Erro ao excluir anúncio:', error);
      toast({
        title: "Erro ao excluir anúncio",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCarToDelete(null);
      setDeleteLoading(false);
    }
  };

  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      console.log('Tentando atualizar anúncio:', id, 'Valor atual:', currentValue);
      
      // Primeiro, tenta atualizar o cache de esquema
      await refreshSchemaCache();
      
      // Utiliza uma abordagem mais direta
      const newValue = currentValue === undefined ? true : !currentValue;
      
      // Tenta atualizar o campo diretamente usando um método mais básico
      try {
        const response = await fetch(`https://jqrwvfmbocfpspomwddq.supabase.co/rest/v1/car_ads?id=eq.${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxcnd2Zm1ib2NmcHNwb213ZGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2MTUxNDUsImV4cCI6MjAxOTE5MTE0NX0.GZKKvOj7wKvwZ0QbKbzZIAUQUzioswXJOZE7r6bU3Ug',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ 
            is_featured: newValue 
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Erro no servidor: ${response.status}`);
        }
        
        // Deu certo! Atualiza o estado
        setCars(
          cars.map((car) =>
            car.id === id ? { ...car, is_featured: newValue } : car
          )
        );
        
        toast({
          title: !currentValue 
            ? "Anúncio marcado como destaque" 
            : "Anúncio removido dos destaques",
          description: !currentValue
            ? "O anúncio agora aparecerá na seção de destaques na página inicial"
            : "O anúncio não aparecerá mais na seção de destaques",
          variant: "default",
        });
        
      } catch (fetchError) {
        console.error("Erro na requisição direta:", fetchError);
        
        // Tenta com o método normal do Supabase como fallback
        const { error } = await supabase
          .from('car_ads')
          .update({ is_featured: newValue })
          .eq('id', id);
        
        if (error) {
          console.error("Erro do Supabase:", error);
          throw new Error(error.message || "Erro desconhecido");
        }
        
        // Se chegou até aqui, foi bem-sucedido com o método fallback
        setCars(
          cars.map((car) =>
            car.id === id ? { ...car, is_featured: newValue } : car
          )
        );
        
        toast({
          title: !currentValue 
            ? "Anúncio marcado como destaque" 
            : "Anúncio removido dos destaques",
          description: !currentValue
            ? "O anúncio agora aparecerá na seção de destaques na página inicial"
            : "O anúncio não aparecerá mais na seção de destaques",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Erro ao atualizar destaque:", error);
      toast({
        title: "Erro ao atualizar destaque",
        description: error.message || "Ocorreu um erro ao tentar atualizar o destaque. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando anúncios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Anúncios</h1>
          <p className="text-muted-foreground mt-1">
            Visualize, edite e gerencie seus anúncios de veículos.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/admin/painel/car/create")}
          className="shrink-0"
        >
          Criar Novo Anúncio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anúncios</CardTitle>
          <CardDescription>
            Total de {cars.length} anúncios encontrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Buscar anúncios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                onClick={() => setFilterStatus("active")}
                size="sm"
              >
                Ativos
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
                size="sm"
              >
                Pendentes
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="hidden md:table-cell">Visualizações</TableHead>
                  <TableHead className="hidden md:table-cell">Contatos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {car.images && car.images.length > 0 && (
                          <img 
                            src={car.images[0]} 
                            alt={car.title} 
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{car.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {car.brand} {car.model} ({car.year})
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{`R$ ${car.price.toLocaleString('pt-BR')}`}</TableCell>
                    <TableCell>
                      {car.status === "active" ? (
                        <Badge variant="default" className="bg-green-500">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-500 border-amber-500">Pendente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(car.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="hidden md:table-cell">{car.views || 0}</TableCell>
                    <TableCell className="hidden md:table-cell">{car.contacts || 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {car.status === "active" && (
                            <DropdownMenuItem onClick={() => handleView(car.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Visualizar</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleEdit(car.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          {car.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(car.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Aprovar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(car.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Rejeitar</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleToggleFeatured(car.id, car.is_featured)}>
                            {car.is_featured ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Remover dos destaques</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Marcar como destaque</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => confirmDelete(car.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {cars.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum anúncio encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AlertDialog para confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Anúncio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este anúncio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setCarToDelete(null);
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
};

export default CarsList;
