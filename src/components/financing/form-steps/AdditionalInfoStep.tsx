
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface AdditionalInfoStepProps {
  form: UseFormReturn<any>;
}

export const AdditionalInfoStep = ({ form }: AdditionalInfoStepProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Informações Adicionais (opcional)</h2>
      
      <FormField
        control={form.control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Outras informações que julgar relevantes:</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informe aqui qualquer outra informação que você julgue relevante para a análise do seu financiamento..." 
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
