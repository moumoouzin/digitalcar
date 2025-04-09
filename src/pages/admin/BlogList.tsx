
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { MoreVertical, Edit, Trash, Search, FileText, Plus } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blog";

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false }) as any;

        if (error) throw error;
        setPosts(data || []);
        setFilteredPosts(data || []);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os posts do blog",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  // Filter posts based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  // Truncate text for display
  const truncateText = (text: string | undefined, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postToDelete.id) as any;

      if (error) throw error;

      setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete.id));
      setFilteredPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete.id));
      
      toast({
        title: "Sucesso",
        description: "Post excluído com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o post",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gerenciar Blog</h1>
        <Button onClick={() => navigate("/admin/painel/blog/create")}>
          <Plus className="mr-2 h-4 w-4" /> Novo Post
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Pesquisar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Nenhum post encontrado</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? "Tente mudar os termos da pesquisa" : "Comece criando seu primeiro post"}
            </p>
            {!searchTerm && (
              <Button 
                className="mt-4" 
                onClick={() => navigate("/admin/painel/blog/create")}
              >
                <Plus className="mr-2 h-4 w-4" /> Criar Post
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Prévia</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {post.title}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {truncateText(post.content)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(post.created_at), "dd/MM/yyyy", { locale: pt })}
                    </TableCell>
                    <TableCell>{post.author || "—"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/blog/${post.id}`} target="_blank">
                              Ver post
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/painel/blog/edit/${post.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-700" 
                            onSelect={(e) => {
                              e.preventDefault();
                              setPostToDelete(post);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Confirmation dialog for deletion */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir post</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir o post "{postToDelete?.title}"? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePost}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner className="mr-2" size="sm" /> : null}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogList;
