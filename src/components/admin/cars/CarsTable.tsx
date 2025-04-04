
import React from "react";
import { CarAd } from "./types";
import { CarActions } from "./CarActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CarsTableProps {
  cars: CarAd[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onToggleFeatured: (id: string, currentValue: boolean) => Promise<void>;
  onDelete: (id: string) => void;
}

export function CarsTable({ cars, onApprove, onReject, onToggleFeatured, onDelete }: CarsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Veículo</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead className="hidden md:table-cell">Visualizações</TableHead>
            <TableHead className="hidden md:table-cell">Contatos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {car.images && car.images.length > 0 && (
                    <img 
                      src={car.images[0]} 
                      alt={car.title} 
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{car.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {car.brand} {car.model} ({car.year})
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{`R$ ${car.price.toLocaleString('pt-BR')}`}</TableCell>
              <TableCell>
                {car.status === "active" ? (
                  <Badge variant="default" className="bg-green-500">Ativo</Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-500 border-amber-500">Pendente</Badge>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">{new Date(car.created_at).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell className="hidden md:table-cell">{car.views || 0}</TableCell>
              <TableCell className="hidden md:table-cell">{car.contacts || 0}</TableCell>
              <TableCell className="text-right">
                <CarActions 
                  car={car} 
                  onApprove={onApprove}
                  onReject={onReject}
                  onToggleFeatured={onToggleFeatured}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
          {cars.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhum anúncio encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
