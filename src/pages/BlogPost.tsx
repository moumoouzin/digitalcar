
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlogPost as BlogPostType } from "@/types/blog";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single() as any;

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Erro ao carregar post do blog:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o artigo solicitado.",
          variant: "destructive",
        });
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, navigate, toast]);

  return (
    <div className="flex flex-col min-h-screen font-inter">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <Header />
      <Navigation />
      
      <main className="flex-grow bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')} 
            className="mb-6 hover:bg-red-50 hover:text-red-600"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar para o blog
          </Button>
          
          {loading ? (
            <div>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="flex gap-4 mb-8">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="w-full h-72 mb-8" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : post ? (
            <article>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {post.created_at && format(new Date(post.created_at), "dd 'de' MMMM, yyyy", { locale: pt })}
                  </span>
                </div>
                {post.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                )}
              </div>
              
              {post.cover_image && (
                <div className="mb-8">
                  <img 
                    src={post.cover_image} 
                    alt={post.title} 
                    className="w-full max-h-96 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              
              <div 
                className="prose prose-red max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium text-gray-700">
                O artigo solicitado não foi encontrado.
              </h2>
              <Button 
                variant="default"
                onClick={() => navigate('/blog')} 
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Voltar para o blog
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
