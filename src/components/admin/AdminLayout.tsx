
import React, { useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SidebarMenu from "../layout/SidebarMenu";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar autenticação ao carregar o componente
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    if (!isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta área.",
        variant: "destructive",
      });
      navigate("/admin/login");
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Logout realizado",
      description: "Você saiu da área administrativa.",
      variant: "default",
    });
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-neutral-800 text-white py-4 px-6 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/45acc7c153d418d558d10f359259f48c4341a6d5"
              alt="Digital Car Logo"
              className="h-12 logo-shadow"
            />
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:text-red-300">
            Sair
          </Button>
        </div>
      </header>

      {/* Sidebar e conteúdo principal */}
      <div className="flex flex-1">
        {/* SidebarMenu para navegação rápida */}
        <SidebarMenu />

        {/* Conteúdo principal - ajustado para considerar o menu lateral */}
        <main className="flex-1 p-6 bg-gray-100 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
