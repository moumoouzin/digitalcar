
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Car, Info, FileQuestion, Phone, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer";

type MenuItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

const menuItems: MenuItem[] = [
  { name: "Início", path: "/", icon: Home },
  { name: "Veículos", path: "/veiculos", icon: Car },
  { name: "Sobre Nós", path: "/", icon: Info },
  { name: "FAQ", path: "/", icon: FileQuestion },
  { name: "Contato", path: "/", icon: Phone },
  { name: "Admin", path: "/admin/login", icon: User }
];

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
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
      <div className="p-4 flex-1">
        {renderMenuItems()}
      </div>
    </div>
  );

  // Mobile drawer
  const MobileDrawer = () => (
    <div className="md:hidden">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            aria-label="Abrir menu"
          >
            <Menu />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/45acc7c153d418d558d10f359259f48c4341a6d5"
                  alt="Digital Car Logo"
                  className="h-8 logo-shadow"
                />
                <h1 className="text-lg font-bold">Digital Car</h1>
              </div>
              <DrawerClose />
            </div>
            {renderMenuItems()}
          </div>
        </DrawerContent>
      </Drawer>
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
