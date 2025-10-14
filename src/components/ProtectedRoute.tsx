import { getItemsFromLocalStorage } from "@/hooks/localStorageService";
import { LocalStorageKeys } from "@/data/constants";
import type { User, UserRole } from "@/interfaces/user.interface";
import { hasAnyRole } from "@/utils/roleUtils";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente para proteger rutas según roles
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  fallback,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);

  useEffect(() => {
    if (!user) {
      setIsAuthorized(false);
      if (redirectTo) {
        window.location.href = redirectTo;
      }
      return;
    }

    const hasPermission = hasAnyRole(user, allowedRoles);
    setIsAuthorized(hasPermission);

    if (!hasPermission && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [user, allowedRoles, redirectTo]);

  if (isAuthorized === null) {
    return <div>Cargando...</div>;
  }

  if (!isAuthorized) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
