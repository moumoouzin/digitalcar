
import React from "react";
import { Menu } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="bg-[#FF0000] text-neutral-100 py-3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="hidden md:flex justify-center w-full">
            <ul className="flex space-x-12">
              <li className="text-sm font-semibold hover:text-white/80">Veículos</li>
              <li className="text-sm font-semibold hover:text-white/80">Sobre Nós</li>
              <li className="text-sm font-medium hover:text-white/80">Financiamento</li>
              <li className="text-sm font-semibold hover:text-white/80">Contato</li>
            </ul>
          </div>
          <div className="md:hidden">
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </div>
    </nav>
  );
};
