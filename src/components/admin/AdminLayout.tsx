import React, { useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
      <header className="bg-neutral-800 text-white py-4 px-6">
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
        {/* Sidebar */}
        <aside className="bg-neutral-900 text-white w-64 p-6 space-y-6">
          <nav>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/admin/painel/dashboard" 
                  className="block py-2 px-4 hover:bg-neutral-800 rounded transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/painel/car/create" 
                  className="block py-2 px-4 hover:bg-neutral-800 rounded transition-colors"
                >
                  Criar Anúncio
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/painel/cars" 
                  className="block py-2 px-4 hover:bg-neutral-800 rounded transition-colors"
                >
                  Gerenciar Anúncios
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 