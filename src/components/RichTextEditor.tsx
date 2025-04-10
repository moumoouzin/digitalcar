
import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, 
         AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon,
         ListOrdered, List } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Comece a escrever aqui...",
  className,
  height = "min-h-[250px]",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
        linkOnPaste: true,
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Montar o editor apenas no cliente para evitar erros de SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sincronizar o conteúdo do editor com o valor da prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!isMounted) {
    return <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} />;
  }

  const addLink = () => {
    if (!linkUrl) return;
    
    editor?.chain().focus().extendMarkRange('link')
      .setLink({ href: linkUrl })
      .run();
    
    setLinkUrl("");
  };

  const addImage = () => {
    if (!imageUrl) return;
    
    editor?.chain().focus()
      .setImage({ src: imageUrl })
      .run();
    
    setImageUrl("");
  };

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="bg-muted/50 p-2 border-b flex flex-wrap gap-1 items-center">
        <Toggle
          size="sm"
          pressed={editor?.isActive('bold')}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
          aria-label="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor?.isActive('italic')}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          aria-label="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor?.isActive('underline')}
          onPressedChange={() => editor?.chain().focus().toggleMark('underline').run()}
          aria-label="Sublinhado"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Toggle
          size="sm"
          pressed={editor?.isActive('heading', { level: 1 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor?.isActive('heading', { level: 2 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor?.isActive('heading', { level: 3 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Toggle
          size="sm"
          pressed={editor?.isActive({ textAlign: 'left' })}
          onPressedChange={() => editor?.commands.setTextAlign('left')}
          aria-label="Alinhar à esquerda"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor?.isActive({ textAlign: 'center' })}
          onPressedChange={() => editor?.commands.setTextAlign('center')}
          aria-label="Centralizar"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor?.isActive({ textAlign: 'right' })}
          onPressedChange={() => editor?.commands.setTextAlign('right')}
          aria-label="Alinhar à direita"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Toggle
          size="sm"
          pressed={editor?.isActive('bulletList')}
          onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
          aria-label="Lista não ordenada"
        >
          <List className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor?.isActive('orderedList')}
          onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
          aria-label="Lista ordenada"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        
        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0" aria-label="Adicionar link">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Adicionar link</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://exemplo.com" 
                  value={linkUrl} 
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <Button size="sm" onClick={addLink}>Adicionar</Button>
              </div>
              {editor?.isActive('link') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editor.chain().focus().unsetLink().run()}
                >
                  Remover link
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0" aria-label="Adicionar imagem">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Adicionar imagem</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="URL da imagem" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button size="sm" onClick={addImage}>Adicionar</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <EditorContent 
        editor={editor} 
        className={cn("prose prose-sm max-w-none p-4", height)}
      />
    </div>
  );
}
