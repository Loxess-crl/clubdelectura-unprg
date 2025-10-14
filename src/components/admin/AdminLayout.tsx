import { AppSidebar } from "@/components/admin/app-sidebar";
import Header from "@/components/admin/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { LocalStorageKeys } from "@/data/constants";
import {
  currentUserHasAnyRole,
  getItemsFromLocalStorage,
} from "@/hooks/localStorageService";
import type { User } from "@/interfaces/user.interface";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath: string;
}) {
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // Si no hay usuario, redirigir al inicio
      window.location.href = "/";
      return;
    }

    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasPermission = currentUserHasAnyRole(["admin", "moderator"]);

    if (!hasPermission) {
      window.location.href = "/";
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <p>Cargando...</p>;
  }
  return (
    <>
      <SidebarProvider>
        <AppSidebar pathname={currentPath} />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
