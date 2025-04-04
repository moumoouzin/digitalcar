
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarAd } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  MoreVertical,
  Trash,
} from "lucide-react";

interface CarActionsProps {
  car: CarAd;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onToggleFeatured: (id: string, currentValue: boolean) => Promise<void>;
  onDelete: (id: string) => void;
}

export function CarActions({ car, onApprove, onReject, onToggleFeatured, onDelete }: CarActionsProps) {
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate(`/admin/painel/car/edit/${id}`);
  };

  const handleView = (id: string) => {
    window.open(`/veiculo/${id}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {car.status === "active" && (
          <DropdownMenuItem onClick={() => handleView(car.id)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>Visualizar</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleEdit(car.id)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>
        {car.status === "pending" && (
          <>
            <DropdownMenuItem onClick={() => onApprove(car.id)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Aprovar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReject(car.id)}>
              <XCircle className="mr-2 h-4 w-4" />
              <span>Rejeitar</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={() => onToggleFeatured(car.id, car.is_featured)}>
          {car.is_featured ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Remover dos destaques</span>
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Marcar como destaque</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(car.id)}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Excluir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
