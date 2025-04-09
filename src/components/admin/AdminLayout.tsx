
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SidebarMenu from "../layout/SidebarMenu";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDatabaseAlert, setShowDatabaseAlert] = useState(false);
  const isMobile = useIsMobile();

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

  // Verificar se a tabela financing_requests existe
  useEffect(() => {
    const checkFinancingTable = async () => {
      try {
        const { data, error } = await supabase
          .from('financing_requests')
          .select('id')
          .limit(1);
        
        if (error && error.code === '42P01') {
          setShowDatabaseAlert(true);
        }
      } catch (error) {
        console.error('Erro ao verificar tabela:', error);
        setShowDatabaseAlert(true);
      }
    };
    
    checkFinancingTable();
  }, []);

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
      <header className="bg-neutral-800 text-white py-3 px-4 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[250px]">
                  <div className="flex flex-col h-full bg-neutral-800 text-white">
                    <div className="p-4 border-b border-neutral-700 flex items-center gap-2">
                      <Link to="/">
                        <img
                          src="/lovable-uploads/ae1de0d6-f893-4937-9b58-24500a96ea8b.png"
                          alt="Digital Car Logo"
                          className="h-10"
                        />
                      </Link>
                    </div>
                    <SidebarMenu />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            <Link to="/">
              <img
                src="/lovable-uploads/ae1de0d6-f893-4937-9b58-24500a96ea8b.png"
                alt="Digital Car Logo"
                className="h-10 sm:h-14 cursor-pointer hover:scale-105 transition-transform"
              />
            </Link>
            <h1 className="text-lg font-bold hidden sm:block">Painel Administrativo</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:text-red-300">
            Sair
          </Button>
        </div>
      </header>

      {/* Sidebar e conteúdo principal */}
      <div className="flex flex-1">
        {/* SidebarMenu para navegação - Visível apenas em telas maiores */}
        <div className="hidden md:block">
          <div className="h-screen w-64 fixed left-0 bg-neutral-900 text-white shadow-lg">
            <SidebarMenu />
          </div>
        </div>

        {/* Conteúdo principal - ajustado para considerar o menu lateral */}
        <main className="flex-1 p-3 sm:p-6 bg-gray-100 md:ml-64">
          {showDatabaseAlert && (
            <Alert variant="destructive" className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Problema com o banco de dados</AlertTitle>
              <AlertDescription>
                A tabela de solicitações de financiamento ainda não foi criada no banco de dados do Supabase.
                Por favor, execute o script SQL <code>create_financing_table.sql</code> no console do Supabase.
              </AlertDescription>
            </Alert>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
