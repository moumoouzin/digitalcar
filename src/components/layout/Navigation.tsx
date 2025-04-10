
import React, { useState } from "react";
import { Menu, X, Home, Car, MessageSquare, FileText, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleWhatsAppContact = (e) => {
    e.preventDefault();
    window.open("https://wa.me/5561981974187", "_blank");
  };

  return (
    <nav className="bg-[#FF0000] text-neutral-100 py-2 sm:py-3 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center">
          {/* Mobile brand name */}
          <div className="md:hidden text-white font-semibold text-base">
            Digital Car
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center w-full">
            <ul className="flex space-x-6 lg:space-x-12">
              <li className="text-base md:text-lg font-semibold hover:text-white/80 transition-colors">
                <Link to="/" className="flex items-center gap-1">
                  <Home size={18} className="hidden lg:inline" />
                  Início
                </Link>
              </li>
              <li className="text-base md:text-lg font-semibold hover:text-white/80 transition-colors">
                <Link to="/veiculos" className="flex items-center gap-1">
                  <Car size={18} className="hidden lg:inline" />
                  Veículos
                </Link>
              </li>
              <li className="text-base md:text-lg font-semibold hover:text-white/80 transition-colors">
                <Link to="/blog" className="flex items-center gap-1">
                  <FileText size={18} className="hidden lg:inline" />
                  Blog
                </Link>
              </li>
              <li className="text-base md:text-lg font-semibold hover:text-white/80 transition-colors">
                <Link to="/financiamento" className="flex items-center gap-1">
                  <MessageSquare size={18} className="hidden lg:inline" />
                  Financiamento
                </Link>
              </li>
              <li className="text-base md:text-lg font-semibold hover:text-white/80 transition-colors">
                <a href="#" onClick={handleWhatsAppContact} className="flex items-center gap-1">
                  <MessageSquare size={18} className="hidden lg:inline" />
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Menu Mobile Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden focus:outline-none p-2"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown - Otimizado para toque e melhor legibilidade */}
        {isMenuOpen && (
          <div className="md:hidden pt-3 pb-2 mt-2 border-t border-white/20 animate-fade-in">
            <ul className="grid grid-cols-1 gap-y-1">
              <li className="text-sm font-semibold">
                <Link to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-3 px-3 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
                >
                  <Home size={18} />
                  Início
                </Link>
              </li>
              <li className="text-sm font-semibold">
                <Link to="/veiculos" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-3 px-3 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
                >
                  <Car size={18} />
                  Veículos
                </Link>
              </li>
              <li className="text-sm font-semibold">
                <Link to="/blog" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-3 px-3 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
                >
                  <FileText size={18} />
                  Blog
                </Link>
              </li>
              <li className="text-sm font-semibold">
                <Link to="/financiamento" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-3 px-3 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
                >
                  <MessageSquare size={18} />
                  Financiamento
                </Link>
              </li>
              <li className="text-sm font-semibold">
                <a href="#" 
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    handleWhatsAppContact(e);
                  }}
                  className="flex items-center gap-2 py-3 px-3 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
                >
                  <MessageSquare size={18} />
                  Contato
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};
