
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth") === "true";
    if (isAuthenticated) {
      navigate("/admin/painel");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de login - em produção, substitua por uma chamada à API
    setTimeout(() => {
      // Credenciais válidas: admin/admin123 ou abc/123
      if ((username === "admin" && password === "admin123") || 
          (username === "abc" && password === "123")) {
        // Armazenar token/estado de login no localStorage ou em um estado global
        localStorage.setItem("adminAuth", "true");
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo.",
          variant: "default",
        });
        navigate("/admin/painel");
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <img
            src="/lovable-uploads/8246faea-92bd-45cb-8249-a7115f1d1687.png"
            alt="Digital Car Logo"
            className="h-28 mx-auto mb-4 transition-all hover:scale-105"
          />
        </div>
        
        <Card className="shadow-lg border-t-4 border-t-red-600">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Área Administrativa</CardTitle>
            <CardDescription className="text-center">
              Faça login para acessar o painel de gerenciamento de anúncios
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">
                  Use as credenciais: <strong>abc / 123</strong> ou <strong>admin / admin123</strong>
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-[#FF0000] hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <a href="/" className="text-red-600 hover:text-red-800 transition-colors">
            &larr; Voltar para o site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
