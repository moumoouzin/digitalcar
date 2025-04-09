
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blog";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        // Use type assertion to work around TypeScript limitations
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false }) as any;

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Erro ao carregar posts do blog:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os artigos do blog.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [toast]);

  // Função para truncar texto mantendo palavras inteiras
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    const truncated = text.substr(0, text.lastIndexOf(' ', maxLength));
    return truncated + '...';
  };

  return (
    <div className="flex flex-col min-h-screen font-inter">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <Header />
      <Navigation />
      
      <main className="flex-grow bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blog Digital Car</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Fique por dentro das novidades do mundo automotivo, dicas de manutenção e cuidados com seu veículo
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
                  {post.cover_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.cover_image} 
                        alt={post.title} 
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        {post.created_at && format(new Date(post.created_at), "dd 'de' MMMM, yyyy", { locale: pt })}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-700">
                      {truncateText(post.summary || post.content, 120)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link 
                      to={`/blog/${post.id}`} 
                      className="text-red-600 font-medium hover:text-red-700 flex items-center gap-1"
                    >
                      Ler mais 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum artigo disponível</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Os artigos do blog estão sendo preparados e em breve estarão disponíveis. Volte em alguns dias!
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
