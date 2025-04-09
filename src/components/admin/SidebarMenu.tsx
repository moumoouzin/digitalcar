
import {
  BookOpen,
  CarFront,
  CreditCard,
  FileText,
  Home,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export const SidebarMenu = () => {
  const location = useLocation();
  
  // Check active route
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Sidebar links
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/painel/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Veículos",
      path: "/admin/painel/cars",
      icon: <CarFront className="h-5 w-5" />,
    },
    {
      name: "Blog",
      path: "/admin/painel/blog",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Financiamentos",
      path: "/admin/painel/financiamentos",
      icon: <CreditCard className="h-5 w-5" />,
    },
  ];

  return (
    <ul className="flex flex-col gap-1 px-3">
      {menuItems.map((item) => (
        <li key={item.path}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
