/**
 * Hook personalizado para gestionar roles de usuario
 *
 * Uso:
 * const { user, isAdmin, isModerator, hasRole, roles } = useUserRole();
 */

import { useEffect, useState } from "react";
import { getItemsFromLocalStorage } from "@/hooks/localStorageService";
import { LocalStorageKeys } from "@/data/constants";
import type { User, UserRole } from "@/interfaces/user.interface";
import {
  isAdmin as checkIsAdmin,
  isModerator as checkIsModerator,
  hasRole as checkHasRole,
  hasAnyRole as checkHasAnyRole,
  getUserRoles,
} from "@/utils/roleUtils";

interface UseUserRoleReturn {
  user: User | undefined;
  isAdmin: boolean;
  isModerator: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  roles: UserRole[];
  isLoading: boolean;
}

export function useUserRole(): UseUserRoleReturn {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario del localStorage
    const storedUser = getItemsFromLocalStorage<User>(LocalStorageKeys.user);
    setUser(storedUser);
    setIsLoading(false);

    // Escuchar cambios en localStorage (por si se actualiza en otra pestaña)
    const handleStorageChange = () => {
      const updatedUser = getItemsFromLocalStorage<User>(LocalStorageKeys.user);
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    user,
    isAdmin: checkIsAdmin(user),
    isModerator: checkIsModerator(user),
    hasRole: (role: UserRole) => checkHasRole(user, role),
    hasAnyRole: (roles: UserRole[]) => checkHasAnyRole(user, roles),
    roles: getUserRoles(user),
    isLoading,
  };
}

// Ejemplo de uso en un componente:
/*
import { useUserRole } from '@/hooks/useUserRole';
import { ROLES } from '@/utils/roleUtils';

export default function MyComponent() {
  const { user, isAdmin, isModerator, hasRole, roles } = useUserRole();

  if (!user) {
    return <p>No has iniciado sesión</p>;
  }

  return (
    <div>
      <h1>Bienvenido, {user.displayName}</h1>
      
      {isAdmin && (
        <button>Panel de Administración</button>
      )}
      
      {isModerator && (
        <button>Moderación</button>
      )}

      {hasRole(ROLES.USER) && (
        <p>Eres un usuario regular</p>
      )}

      <p>Tus roles: {roles.join(', ')}</p>
    </div>
  );
}
*/
