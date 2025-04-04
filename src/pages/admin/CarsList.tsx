
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase, refreshSchemaCache } from "@/integrations/supabase/client";
import { CarsFilter } from "@/components/admin/cars/CarsFilter";
import { CarsTable } from "@/components/admin/cars/CarsTable";
import { DeleteCarDialog } from "@/components/admin/cars/DeleteCarDialog";
import { CarAd } from "@/components/admin/cars/types";

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
      const { error } = await supabase
        .from('car_ads')
        .delete()
        .eq('id', id);
        
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
      
      const { error } = await supabase
        .from('car_ads')
        .delete()
        .eq('id', carToDelete);
        
      if (error) {
        throw error;
      }
      
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
      await refreshSchemaCache();
      
      const newValue = currentValue === undefined ? true : !currentValue;
      
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
        
        const { error } = await supabase
          .from('car_ads')
          .update({ is_featured: newValue })
          .eq('id', id);
        
        if (error) {
          throw new Error(error.message || "Erro desconhecido");
        }
        
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
          <CarsFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          <CarsTable 
            cars={cars}
            onApprove={handleApprove}
            onReject={handleReject}
            onToggleFeatured={handleToggleFeatured}
            onDelete={confirmDelete}
          />
        </CardContent>
      </Card>

      <DeleteCarDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default CarsList;
