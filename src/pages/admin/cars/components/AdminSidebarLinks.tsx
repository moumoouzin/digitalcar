
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  FileText,
  Settings,
  CalendarClock,
  Users,
  ImageIcon
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  current?: boolean;
}

const SidebarLink = ({ to, icon, text, current }: SidebarLinkProps) => (
  <Link
    to={to}
    className={`flex items-center py-2 px-4 rounded-md transition-colors ${
      current
        ? "bg-primary text-primary-foreground"
        : "hover:bg-muted"
    }`}
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </Link>
);

const AdminSidebarLinks = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="space-y-1 py-2">
      <SidebarLink
        to="/admin/painel"
        icon={<LayoutDashboard size={18} />}
        text="Dashboard"
        current={pathname === "/admin/painel"}
      />
      <SidebarLink
        to="/admin/painel/cars"
        icon={<Car size={18} />}
        text="Veículos"
        current={pathname === "/admin/painel/cars"}
      />
      <SidebarLink
        to="/admin/painel/financing"
        icon={<FileText size={18} />}
        text="Financiamentos"
        current={pathname === "/admin/painel/financing"}
      />
      <SidebarLink
        to="/admin/painel/diagnostico-upload"
        icon={<ImageIcon size={18} />}
        text="Diagnóstico Upload"
        current={pathname === "/admin/painel/diagnostico-upload"}
      />
      <SidebarLink
        to="/admin/painel/users"
        icon={<Users size={18} />}
        text="Usuários"
        current={pathname === "/admin/painel/users"}
      />
      <SidebarLink
        to="/admin/painel/schedule"
        icon={<CalendarClock size={18} />}
        text="Agendamentos"
        current={pathname === "/admin/painel/schedule"}
      />
      <SidebarLink
        to="/admin/painel/settings"
        icon={<Settings size={18} />}
        text="Configurações"
        current={pathname === "/admin/painel/settings"}
      />
    </div>
  );
};

export default AdminSidebarLinks;
