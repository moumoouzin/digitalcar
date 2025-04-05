
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Car, Info, FileQuestion, Phone, User, Menu, LayoutDashboard, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";

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
];

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const renderMenuItems = () => (
    <ul className="space-y-2 w-full">
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
            onClick={() => setIsOpen(false)}
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </Link>
        </li>
      ))}
      
      {isAdminPanel && (
        <li>
          <div className="text-xs uppercase text-neutral-500 font-semibold mt-6 mb-2 px-3">
            Navegação
          </div>
          <Link 
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full hover:bg-neutral-800/50 text-neutral-300 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <Home size={18} />
            <span>Voltar ao Site</span>
          </Link>
        </li>
      )}
    </ul>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex flex-col w-64 bg-neutral-900 text-white h-screen fixed left-0 shadow-lg">
      <div className="flex items-center gap-3 p-4 border-b border-neutral-800">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/45acc7c153d418d558d10f359259f48c4341a6d5"
          alt="Digital Car Logo"
          className="h-8 logo-shadow"
        />
        <h1 className="text-lg font-bold">Digital Car</h1>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {renderMenuItems()}
      </div>
    </div>
  );

  // Mobile sidebar usando Sheet ao invés de Drawer para melhor experiência móvel
  const MobileDrawer = () => (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[85%] max-w-[300px] p-0 bg-neutral-900 text-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/45acc7c153d418d558d10f359259f48c4341a6d5"
                  alt="Digital Car Logo"
                  className="h-8 logo-shadow"
                />
                <h1 className="text-lg font-bold">Digital Car</h1>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <X size={18} />
                </Button>
              </SheetClose>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {renderMenuItems()}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu />
      </Button>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileDrawer />
    </>
  );
};

export default SidebarMenu;
