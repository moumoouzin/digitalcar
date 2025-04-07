
import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarFormValues, carBrands, generateYears } from "../types";

type BasicInfoFormProps = {
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  customBrand: string;
  setCustomBrand: (brand: string) => void;
  customModel: string;
  setCustomModel: (model: string) => void;
  customYear: string;
  setCustomYear: (year: string) => void;
  isCustomBrand: boolean;
  setIsCustomBrand: (isCustom: boolean) => void;
  isCustomModel: boolean;
  setIsCustomModel: (isCustom: boolean) => void;
  isCustomYear: boolean;
  setIsCustomYear: (isCustom: boolean) => void;
  onNext: () => void;
};

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  selectedBrand,
  setSelectedBrand,
  customBrand,
  setCustomBrand,
  customModel,
  setCustomModel,
  customYear,
  setCustomYear,
  isCustomBrand,
  setIsCustomBrand,
  isCustomModel,
  setIsCustomModel,
  isCustomYear,
  setIsCustomYear,
  onNext,
}) => {
  const { register, formState, setValue, getValues } = useFormContext<CarFormValues>();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Anúncio</Label>
        <Input
          id="title"
          placeholder="Ex: Honda Civic EXL 2020 Completo"
          {...register("title")}
        />
        {formState.errors.title && (
          <p className="text-sm text-red-500">{formState.errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          {!isCustomBrand ? (
            <>
              <Select
                value={selectedBrand}
                onValueChange={(value) => {
                  if (value === "outro") {
                    setIsCustomBrand(true);
                    setSelectedBrand("");
                    setValue("model", "");
                  } else {
                    setSelectedBrand(value);
                    setValue("model", "");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {carBrands.map((brand) => (
                    <SelectItem key={brand.name} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite a marca"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCustomBrand(false);
                    setCustomBrand("");
                  }}
                  size="sm"
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          {!isCustomModel ? (
            <>
              <Select
                value={getValues("model")}
                onValueChange={(value) => {
                  if (value === "outro") {
                    setIsCustomModel(true);
                    setValue("model", "");
                  } else {
                    setValue("model", value);
                  }
                }}
                disabled={!selectedBrand && !isCustomBrand}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  {selectedBrand &&
                    carBrands
                      .find((brand) => brand.name === selectedBrand)
                      ?.models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Digite o modelo"
                value={customModel}
                onChange={(e) => {
                  setCustomModel(e.target.value);
                  setValue("model", e.target.value);
                }}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsCustomModel(false);
                  setCustomModel("");
                }}
                size="sm"
              >
                Voltar
              </Button>
            </div>
          )}
          {formState.errors.model && (
            <p className="text-sm text-red-500">{formState.errors.model.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Ano</Label>
          {!isCustomYear ? (
            <>
              <Select 
                value={getValues("year")}
                onValueChange={(value) => {
                  if (value === "outro") {
                    setIsCustomYear(true);
                    setValue("year", "");
                  } else {
                    setValue("year", value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {generateYears().map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Digite o ano"
                value={customYear}
                onChange={(e) => {
                  setCustomYear(e.target.value);
                  setValue("year", e.target.value);
                }}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsCustomYear(false);
                  setCustomYear("");
                }}
                size="sm"
              >
                Voltar
              </Button>
            </div>
          )}
          {formState.errors.year && (
            <p className="text-sm text-red-500">{formState.errors.year.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            placeholder="Ex: 75000"
            {...register("price")}
          />
          {formState.errors.price && (
            <p className="text-sm text-red-500">{formState.errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Veículo</Label>
        <Textarea
          id="description"
          placeholder="Descreva o veículo com detalhes. Informe condições, diferenciais e outros aspectos relevantes."
          rows={6}
          {...register("description")}
        />
        {formState.errors.description && (
          <p className="text-sm text-red-500">{formState.errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">Número de WhatsApp para Contato</Label>
        <Input
          id="whatsapp"
          placeholder="Ex: 61981974187"
          {...register("whatsapp")}
        />
        <p className="text-xs text-muted-foreground">
          Insira apenas números, incluindo DDD, sem espaços ou caracteres especiais.
        </p>
        {formState.errors.whatsapp && (
          <p className="text-sm text-red-500">{formState.errors.whatsapp.message}</p>
        )}
      </div>
      
      <div className="flex justify-end">
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
