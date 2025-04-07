
import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CarFormValues, carFeatures } from "../types";

type DetailsFormProps = {
  customTransmission: string;
  setCustomTransmission: (transmission: string) => void;
  isCustomTransmission: boolean;
  setIsCustomTransmission: (isCustom: boolean) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (features: string[]) => void;
  isFeatured: boolean;
  setIsFeatured: (isFeatured: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export const DetailsForm: React.FC<DetailsFormProps> = ({
  customTransmission,
  setCustomTransmission,
  isCustomTransmission,
  setIsCustomTransmission,
  selectedFeatures,
  setSelectedFeatures,
  isFeatured,
  setIsFeatured,
  onPrevious,
  onNext,
}) => {
  const { register, formState, setValue, getValues } = useFormContext<CarFormValues>();

  const toggleFeature = (featureId: string) => {
    // Instead of using a callback function, create a new array directly
    const updatedFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter((id) => id !== featureId)
      : [...selectedFeatures, featureId];
    
    setSelectedFeatures(updatedFeatures);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Cor</Label>
          <Input
            id="color"
            placeholder="Ex: Preto"
            {...register("color")}
          />
          {formState.errors.color && (
            <p className="text-sm text-red-500">{formState.errors.color.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Câmbio</Label>
          {!isCustomTransmission ? (
            <>
              <Select 
                value={getValues("transmission")}
                onValueChange={(value) => {
                  if (value === "outro") {
                    setIsCustomTransmission(true);
                    setValue("transmission", "");
                  } else {
                    setValue("transmission", value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o câmbio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automático</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                  <SelectItem value="semi-automatic">Semi-automático</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Digite o tipo de câmbio"
                value={customTransmission}
                onChange={(e) => {
                  setCustomTransmission(e.target.value);
                  setValue("transmission", e.target.value);
                }}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsCustomTransmission(false);
                  setCustomTransmission("");
                }}
                size="sm"
              >
                Voltar
              </Button>
            </div>
          )}
          {formState.errors.transmission && (
            <p className="text-sm text-red-500">
              {formState.errors.transmission.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Quilometragem</Label>
          <Input
            id="mileage"
            placeholder="Ex: 45000"
            {...register("mileage")}
          />
          {formState.errors.mileage && (
            <p className="text-sm text-red-500">{formState.errors.mileage.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Características e Opcionais</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {carFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={feature.id}
                checked={selectedFeatures.includes(feature.id)}
                onCheckedChange={() => toggleFeature(feature.id)}
              />
              <label
                htmlFor={feature.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={isFeatured}
            onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Exibir como destaque na página inicial
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Marque esta opção para exibir este veículo na seção de destaques da página inicial.
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
          type="button" 
          onClick={onNext}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};
