
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const AdminDashboard = () => {
  // Dados simulados para o dashboard
  const stats = {
    totalCars: 15,
    activeCars: 12,
    pendingCars: 3,
    totalViews: 857,
    totalContacts: 42
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
          <Link to="/vehicles" className="flex items-center gap-2">
            <Eye size={16} />
            Ver site
          </Link>
        </Button>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse as principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/admin/painel/cars/create" 
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
