
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    activeCars: 0,
    pendingCars: 0,
    totalViews: 0,
    totalContacts: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch total cars
      const { data: totalCarsData, error: totalCarsError } = await supabase
        .from('car_ads')
        .select('count', { count: 'exact' });
        
      if (totalCarsError) throw totalCarsError;
      
      // Fetch active cars
      const { data: activeCarsData, error: activeCarsError } = await supabase
        .from('car_ads')
        .select('count', { count: 'exact' })
        .eq('status', 'active');
        
      if (activeCarsError) throw activeCarsError;
      
      // Fetch pending cars
      const { data: pendingCarsData, error: pendingCarsError } = await supabase
        .from('car_ads')
        .select('count', { count: 'exact' })
        .eq('status', 'pending');
        
      if (pendingCarsError) throw pendingCarsError;
      
      // Fetch total views and contacts
      const { data: metricsData, error: metricsError } = await supabase
        .from('car_ads')
        .select('views, contacts');
        
      if (metricsError) throw metricsError;
      
      // Calculate total views and contacts from all car ads
      const totalViews = metricsData.reduce((sum, car) => sum + (car.views || 0), 0);
      const totalContacts = metricsData.reduce((sum, car) => sum + (car.contacts || 0), 0);
      
      setStats({
        totalCars: totalCarsData[0]?.count || 0,
        activeCars: activeCarsData[0]?.count || 0,
        pendingCars: pendingCarsData[0]?.count || 0,
        totalViews,
        totalContacts
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao painel de controle da Digital Car.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/veiculos" className="flex items-center gap-2">
            <Eye size={16} />
            Ver site
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Anúncios</CardTitle>
              <CardDescription>Todos os veículos cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCars}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Anúncios Ativos</CardTitle>
              <CardDescription>Veículos sendo mostrados no site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeCars}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Anúncios Pendentes</CardTitle>
              <CardDescription>Aguardando aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingCars}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <CardDescription>Total de visualizações nos anúncios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalViews}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Contatos</CardTitle>
              <CardDescription>Cliques no botão de WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalContacts}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse as principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/admin/painel/car/create" 
            className="p-4 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition flex items-center justify-center"
          >
            Criar Novo Anúncio
          </Link>
          <Link 
            to="/admin/painel/cars" 
            className="p-4 bg-neutral-100 border border-neutral-200 rounded hover:bg-neutral-200 transition flex items-center justify-center"
          >
            Gerenciar Anúncios
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
