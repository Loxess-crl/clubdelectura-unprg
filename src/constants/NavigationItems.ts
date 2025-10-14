import { BookAIcon, LayoutDashboard, type LucideIcon } from "lucide-react";
import { AppRoutes } from "./AppRoutes";

interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  groupLabel?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export const NavigationItems: NavItem[] = [
  /* GENERAL */
  {
    title: "Inicio",
    url: AppRoutes.ADMIN.HOME,
    icon: LayoutDashboard,
    isActive: false,
    groupLabel: "General",
  },
  {
    title: "Libros",
    url: AppRoutes.ADMIN.BOOKS,
    icon: BookAIcon,
    isActive: false,
    groupLabel: "Administración",
  },
  // {
  //   title: "Usuarios",
  //   url: AppRoutes.ADMIN.USERS,
  //   icon: Users,
  //   isActive: false,
  //   groupLabel: "Administración",
  // },
];
