
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  PencilIcon, 
  TrashIcon, 
  MoreVerticalIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  Loader2Icon 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CarsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cars, setCars] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending">("all");
  const [isLoading, setIsLoading] = useState(true);

  // Carregar anúncios do Supabase quando o componente for montado
  useEffect(() => {
    fetchCars();
  }, []);

  // Função para buscar os carros do Supabase
  const fetchCars = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('car_ads')
        .select(`
          *,
          car_images (image_url, is_primary),
          car_features (feature_id)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }

      // Formatar dados para o formato esperado pela UI
      const formattedCars = data.map(car => {
        // Encontrar a imagem primária
        const primaryImage = car.car_images?.find((img: any) => img.is_primary)?.image_url;
        // Ou usar a primeira imagem se não houver primária
        const firstImage = car.car_images?.length > 0 ? car.car_images[0].image_url : null;
        
        return {
          ...car,
          price: `R$ ${car.price.toLocaleString('pt-BR')}`,
          features: car.car_features?.map((f: any) => f.feature_id) || [],
          images: [primaryImage || firstImage].filter(Boolean)
        };
      });
      
      setCars(formattedCars);
    } catch (error: any) {
      console.error('Erro ao carregar anúncios:', error);
      toast({
        title: "Erro ao carregar anúncios",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para filtrar os anúncios
  const filteredCars = cars.filter((car) => {
    const matchesSearch = 
      car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || car.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Função para editar um anúncio
  const handleEdit = (id: string) => {
    navigate(`/admin/painel/car/edit/${id}`);
  };

  // Função para visualizar um anúncio
  const handleView = (id: string) => {
    // Na implementação real, você pode abrir em uma nova aba ou mostrar um modal
    window.open(`/car/${id}`, "_blank");
  };

  // Função para aprovar um anúncio pendente
  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('car_ads')
        .update({ status: 'active' })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar o estado local
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
  
  // Função para rejeitar um anúncio pendente
  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('car_ads')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar o estado local
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

  // Função para excluir um anúncio
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('car_ads')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar o estado local
      setCars(cars.filter(car => car.id !== id));
      
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
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2Icon className="h-10 w-10 animate-spin text-primary mb-4" />
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
            Total de {filteredCars.length} anúncios encontrados.
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
                {filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {car.images.length > 0 && (
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
                    <TableCell>{car.price}</TableCell>
                    <TableCell>
                      {car.status === "active" ? (
                        <Badge variant="default" className="bg-green-500">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-500 border-amber-500">Pendente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(car.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="hidden md:table-cell">{car.views}</TableCell>
                    <TableCell className="hidden md:table-cell">{car.contacts}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {car.status === "active" && (
                            <DropdownMenuItem onClick={() => handleView(car.id)}>
                              <EyeIcon className="mr-2 h-4 w-4" />
                              <span>Visualizar</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleEdit(car.id)}>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          {car.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(car.id)}>
                                <CheckCircleIcon className="mr-2 h-4 w-4" />
                                <span>Aprovar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(car.id)}>
                                <XCircleIcon className="mr-2 h-4 w-4" />
                                <span>Rejeitar</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(car.id)}
                            className="text-red-600"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCars.length === 0 && (
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
    </div>
  );
};

export default CarsList;
