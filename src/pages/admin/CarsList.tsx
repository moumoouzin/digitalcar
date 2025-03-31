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
  XCircleIcon 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Dados fictícios de anúncios para demonstração (serão usados apenas se não houver dados no localStorage)
const MOCK_CARS = [
  {
    id: "1",
    title: "Honda HR-V EXL 2020",
    price: "R$ 96.900",
    brand: "Honda",
    model: "HR-V",
    year: "2020",
    status: "active",
    createdAt: "2023-10-15",
    views: 152,
    contacts: 8,
    images: ["https://cdn.builder.io/api/v1/image/assets/TEMP/1326335909abdf93418d99a8b827cffe82d9d0ac"],
  },
  {
    id: "2",
    title: "Fiat Strada Freedom 2020",
    price: "R$ 79.900",
    brand: "Fiat",
    model: "Strada",
    year: "2020",
    status: "active",
    createdAt: "2023-10-10",
    views: 98,
    contacts: 4,
    images: ["https://cdn.builder.io/api/v1/image/assets/TEMP/6268af9d2847f1916069fb0ecd9b13d06c7e57d0"],
  },
  {
    id: "3",
    title: "Jeep Renegade 1.8 2019",
    price: "R$ 69.900",
    brand: "Jeep",
    model: "Renegade",
    year: "2019",
    status: "active",
    createdAt: "2023-10-05",
    views: 201,
    contacts: 12,
    images: ["https://cdn.builder.io/api/v1/image/assets/TEMP/b20c7304f7e42390cf4d6e6cba09b0967971384b"],
  },
  {
    id: "4",
    title: "Toyota Corolla XEI 2022",
    price: "R$ 112.900",
    brand: "Toyota",
    model: "Corolla",
    year: "2022",
    status: "pending",
    createdAt: "2023-10-20",
    views: 0,
    contacts: 0,
    images: [],
  },
  {
    id: "5",
    title: "Volkswagen Polo Highline 2021",
    price: "R$ 86.500",
    brand: "Volkswagen",
    model: "Polo",
    year: "2021",
    status: "pending",
    createdAt: "2023-10-19",
    views: 0,
    contacts: 0,
    images: [],
  },
];

const CarsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cars, setCars] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending">("all");

  // Carregar anúncios do localStorage quando o componente for montado
  useEffect(() => {
    // Tenta carregar os anúncios do localStorage
    const savedCars = localStorage.getItem("carsList");
    
    if (savedCars) {
      // Se existirem anúncios salvos, carrega-os
      setCars(JSON.parse(savedCars));
    } else {
      // Se não houver anúncios salvos, usa os dados de exemplo
      setCars(MOCK_CARS);
      // Opcionalmente, salva os dados de exemplo no localStorage para uso futuro
      localStorage.setItem("carsList", JSON.stringify(MOCK_CARS));
    }
  }, []);

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
  const handleApprove = (id: string) => {
    const updatedCars = cars.map(car => 
      car.id === id ? { ...car, status: "active" } : car
    );
    
    // Atualiza o estado
    setCars(updatedCars);
    
    // Atualiza o localStorage
    localStorage.setItem("carsList", JSON.stringify(updatedCars));
    
    toast({
      title: "Anúncio aprovado",
      description: "O anúncio agora está ativo no site.",
      variant: "default",
    });
  };
  
  // Função para rejeitar um anúncio pendente
  const handleReject = (id: string) => {
    const updatedCars = cars.filter(car => car.id !== id);
    
    // Atualiza o estado
    setCars(updatedCars);
    
    // Atualiza o localStorage
    localStorage.setItem("carsList", JSON.stringify(updatedCars));
    
    toast({
      title: "Anúncio rejeitado",
      description: "O anúncio foi removido da lista.",
      variant: "destructive",
    });
  };

  // Função para excluir um anúncio
  const handleDelete = (id: string) => {
    const updatedCars = cars.filter(car => car.id !== id);
    
    // Atualiza o estado
    setCars(updatedCars);
    
    // Atualiza o localStorage
    localStorage.setItem("carsList", JSON.stringify(updatedCars));
    
    toast({
      title: "Anúncio excluído",
      description: "O anúncio foi removido permanentemente.",
      variant: "destructive",
    });
  };

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
                    <TableCell className="hidden md:table-cell">{car.createdAt}</TableCell>
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