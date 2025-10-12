import { AppSidebar } from "@/components/admin/app-sidebar";
import Header from "@/components/admin/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { LocalStorageKeys } from "@/data/constants";
import { getItemsFromLocalStorage } from "@/hooks/localStorageService";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath: string;
}) {
  const allowRoles = ["admin", "moderator"];
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);
  const role = getItemsFromLocalStorage<string>(LocalStorageKeys.role);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && role) {
      if (!role || !allowRoles.includes(role)) {
        window.location.href = "/";
      } else {
        setLoading(false);
      }
    }
  }, [user, role]);

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
