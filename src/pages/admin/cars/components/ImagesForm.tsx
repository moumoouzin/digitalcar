
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useImageHandling } from "../utils/imageUtils";
import { useToast } from "@/components/ui/use-toast";
import { CarImage } from "../types";

type ImagesFormProps = {
  existingImages: CarImage[];
  setExistingImages: (images: CarImage[]) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export const ImagesForm: React.FC<ImagesFormProps> = ({
  existingImages,
  setExistingImages,
  onPrevious,
  onSubmit,
  isSubmitting,
}) => {
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const { removeExistingImage } = useImageHandling();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + uploadedImages.length + existingImages.length > 10) {
        toast({
          title: "Limite de imagens excedido",
          description: "Você pode ter no máximo 10 imagens por anúncio.",
          variant: "destructive",
        });
        return;
      }

      const newImages = [...uploadedImages, ...files];
      setUploadedImages(newImages);

      const newImagePreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    const newImagePreviews = [...imagePreviewUrls];

    URL.revokeObjectURL(newImagePreviews[index]);

    newImages.splice(index, 1);
    newImagePreviews.splice(index, 1);

    setUploadedImages(newImages);
    setImagePreviewUrls(newImagePreviews);
  };

  const removeImage2 = async (imageId: string, index: number) => {
    const success = await removeExistingImage(imageId);
    if (success) {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="photos">Fotos do Veículo</Label>
          
          {existingImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Imagens existentes ({existingImages.length}):</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {existingImages.map((img, index) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt={`Imagem ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      onClick={() => removeImage2(img.id, index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Clique para adicionar mais fotos</span> ou arraste e solte
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG ou JPEG (máx. 10 imagens no total)
                </p>
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadedImages.length + existingImages.length >= 10}
              />
            </label>
          </div>

          {imagePreviewUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Novas imagens ({imagePreviewUrls.length}):</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Nova imagem ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      onClick={() => removeImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Atenção:</strong> Revise todas as informações antes de atualizar o anúncio.
          Após a atualização, as alterações serão imediatamente visíveis no site.
        </p>
      </div>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
        >
          Voltar
        </Button>
        <Button 
          type="submit" 
          onClick={onSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Atualizando..." : "Atualizar Anúncio"}
        </Button>
      </div>
    </div>
  );
};
