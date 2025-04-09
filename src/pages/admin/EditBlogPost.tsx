
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { BlogPost } from "@/types/blog";

// Esquema de validação
const formSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres").max(255),
  summary: z.string().max(500, "O resumo deve ter no máximo 500 caracteres").optional(),
  content: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres"),
  author: z.string().min(2, "O nome do autor deve ter pelo menos 2 caracteres").max(100),
  cover_image: z.any().optional(),
});

const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentCoverImage, setCurrentCoverImage] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      author: "",
      cover_image: undefined,
    },
  });

  // Buscar dados do post
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Use type assertion to work around TypeScript limitations
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single() as any;

        if (error) throw error;

        // Preencher formulário com dados existentes
        form.reset({
          title: data.title,
          summary: data.summary || "",
          content: data.content,
          author: data.author || "",
        });

        if (data.cover_image) {
          setCurrentCoverImage(data.cover_image);
          setPreviewImage(data.cover_image);
        }
      } catch (error) {
        console.error('Erro ao carregar post:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do post",
          variant: "destructive",
        });
        navigate('/admin/painel/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPostData();
    }
  }, [id, navigate, toast, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Criar URL para pré-visualização
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      let coverImageUrl = currentCoverImage;

      // Fazer upload da nova imagem, se fornecida
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        // Upload para o bucket 'blog-images'
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // Obter URL pública da nova imagem
        const { data: publicUrlData } = await supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        if (publicUrlData) {
          coverImageUrl = publicUrlData.publicUrl;
        }
      }

      // Atualizar post no banco de dados (usando type assertion para contornar limitações do TypeScript)
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: values.title,
          summary: values.summary,
          content: values.content,
          author: values.author,
          cover_image: coverImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id) as any;

      if (updateError) throw updateError;

      toast({
        title: "Sucesso",
        description: "Post atualizado com sucesso!",
      });

      navigate('/admin/painel/blog');
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o post. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/painel/blog")}
        >
          Voltar
        </Button>
        <h1 className="text-2xl font-bold mt-4">Editar Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar Informações do Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do post" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumo (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite um breve resumo do post"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Um resumo conciso que aparecerá na listagem do blog
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite o conteúdo completo do post"
                        className="min-h-[300px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Use quebras de linha para separar parágrafos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do autor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cover_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem de Capa</FormLabel>
                    <FormControl>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                          id="picture"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    </FormControl>
                    {previewImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Imagem atual:</p>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/painel/blog")}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2" size="sm" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlogPost;
