
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Financing from "./pages/Financing";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

// Páginas de Admin
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import CreateCar from "./pages/admin/CreateCar";
import EditCar from "./pages/admin/EditCar";
import CarsList from "./pages/admin/CarsList";
import FinancingRequests from "./pages/admin/FinancingRequests";
import FinancingDetail from "./pages/admin/FinancingDetail";
import AdminLayout from "./components/admin/AdminLayout";
import BlogList from "./pages/admin/BlogList";
import CreateBlogPost from "./pages/admin/CreateBlogPost";
import EditBlogPost from "./pages/admin/EditBlogPost";

// Tratamento de erros
import ErrorBoundary from "./components/ErrorBoundary";
import { Suspense } from "react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/veiculos" element={<Vehicles />} />
          <Route path="/veiculo/:id" element={<VehicleDetail />} />
          <Route path="/financiamento" element={<Financing />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          
          {/* Rotas administrativas */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/painel" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="car/create" element={<CreateCar />} />
            <Route path="car/edit/:id" element={<EditCar />} />
            <Route path="cars" element={<CarsList />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/create" element={<CreateBlogPost />} />
            <Route path="blog/edit/:id" element={<EditBlogPost />} />
            <Route 
              path="financiamentos" 
              element={
                <Suspense fallback={<div>Carregando...</div>}>
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar a página de financiamentos. Verifique se o banco de dados está configurado corretamente.</div>}>
                    <FinancingRequests />
                  </ErrorBoundary>
                </Suspense>
              } 
            />
            <Route 
              path="financiamento/:id" 
              element={
                <Suspense fallback={<div>Carregando...</div>}>
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar os detalhes do financiamento.</div>}>
                    <FinancingDetail />
                  </ErrorBoundary>
                </Suspense>
              } 
            />
          </Route>
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
