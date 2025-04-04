
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CarsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: "all" | "active" | "pending";
  setFilterStatus: (value: "all" | "active" | "pending") => void;
}

export function CarsFilter({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }: CarsFilterProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="relative w-full md:w-64">
        <Input
          placeholder="Buscar anúncios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-3"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
          size="sm"
        >
          Todos
        </Button>
        <Button
          variant={filterStatus === "active" ? "default" : "outline"}
          onClick={() => setFilterStatus("active")}
          size="sm"
        >
          Ativos
        </Button>
        <Button
          variant={filterStatus === "pending" ? "default" : "outline"}
          onClick={() => setFilterStatus("pending")}
          size="sm"
        >
          Pendentes
        </Button>
      </div>
    </div>
  );
}
