
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { RichTextEditor } from "@/components/RichTextEditor";

// Validation schema
const formSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres").max(255),
  summary: z.string().max(500, "O resumo deve ter no máximo 500 caracteres").optional(),
  content: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres"),
  author: z.string().min(2, "O nome do autor deve ter pelo menos 2 caracteres").max(100),
  cover_image: z.any().optional(),
});

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      
      // Create URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setUploadError(null);

    try {
      let coverImageUrl = null;

      // Upload the image if provided
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${uuidv4()}-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        console.log('Iniciando upload da imagem para:', filePath);
        
        // Upload to the 'blog-images' bucket
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro ao fazer upload da imagem:', uploadError);
          setUploadError(`Erro ao fazer upload da imagem: ${uploadError.message}`);
          throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
        }

        console.log('Imagem enviada com sucesso:', fileData);

        // Get public URL for the image
        const { data: publicUrlData } = await supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        if (publicUrlData) {
          coverImageUrl = publicUrlData.publicUrl;
          console.log('URL pública da imagem:', coverImageUrl);
        }
      }

      console.log('Criando post do blog com dados:', {
        title: values.title,
        summary: values.summary || null,
        content: values.content,
        author: values.author || null,
        cover_image: coverImageUrl,
      });

      // Create post in database
      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title: values.title,
          summary: values.summary || null,
          content: values.content,
          author: values.author || null,
          cover_image: coverImageUrl,
        })
        .select();

      if (insertError) {
        console.error('Erro ao inserir post:', insertError);
        throw new Error(`Erro ao inserir post: ${insertError.message}`);
      }

      console.log('Post criado com sucesso:', data);

      toast({
        title: "Sucesso",
        description: "Post do blog criado com sucesso!",
      });

      navigate('/admin/painel/blog');
    } catch (error: any) {
      console.error('Erro ao criar post:', error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao criar o post. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/painel/blog")}
        >
          Voltar
        </Button>
        <h1 className="text-2xl font-bold mt-4">Criar Novo Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Post</CardTitle>
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
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Digite o conteúdo completo do post"
                        height="min-h-[400px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Use as ferramentas de formatação para enriquecer o conteúdo
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
                    <FormLabel>Imagem de Capa (opcional)</FormLabel>
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
                    {uploadError && (
                      <p className="text-sm font-medium text-destructive">{uploadError}</p>
                    )}
                    {previewImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Pré-visualização:</p>
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
                    "Publicar Post"
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

export default CreateBlogPost;
