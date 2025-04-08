
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Car, Info, FileQuestion, Phone, User, LayoutDashboard, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type MenuItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

// Menu items for the main site
const siteMenuItems: MenuItem[] = [
  { name: "Início", path: "/", icon: Home },
  { name: "Veículos", path: "/veiculos", icon: Car },
  { name: "Sobre Nós", path: "/sobre", icon: Info },
  { name: "FAQ", path: "/faq", icon: FileQuestion },
  { name: "Contato", path: "/contato", icon: Phone },
  { name: "Admin", path: "/admin/login", icon: User }
];

// Menu items for the admin panel
const adminMenuItems: MenuItem[] = [
  { name: "Dashboard", path: "/admin/painel/dashboard", icon: LayoutDashboard },
  { name: "Veículos", path: "/admin/painel/cars", icon: Car },
  { name: "Financiamentos", path: "/admin/painel/financiamentos", icon: FileText },
  { name: "Diagnóstico de Upload", path: "/admin/painel/test-upload", icon: ImageIcon },
];

const SidebarMenu = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Check if the current location is in the admin panel
  const isAdminPanel = location.pathname.includes('/admin/painel');
  
  // Use the appropriate menu items based on the current location
  const menuItems = isAdminPanel ? adminMenuItems : siteMenuItems;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname === path || 
      (path.includes('/admin/painel/') && location.pathname.startsWith(path));
  };

  return (
    <div className="flex flex-col h-full">
      {!isMobile && isAdminPanel && (
        <div className="p-4 border-b border-neutral-700">
          <p className="text-sm text-neutral-400">Navegação</p>
        </div>
      )}
      
      <div className="p-2 flex-1 overflow-y-auto">
        <ul className="space-y-1 w-full">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full",
                  isActive(item.path)
                    ? "bg-neutral-800 text-white"
                    : "hover:bg-neutral-800/50 text-neutral-300 hover:text-white"
                )}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          
          {isAdminPanel && (
            <li className="mt-6 pt-4 border-t border-neutral-700">
              <Link 
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full hover:bg-neutral-800/50 text-neutral-300 hover:text-white"
              >
                <Home size={18} />
                <span>Voltar ao Site</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
