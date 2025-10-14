import type { User, UserRole } from "@/interfaces/user.interface";

/**
 * Roles permitidos en la aplicación
 */
export const ROLES = {
  ADMIN: "admin" as UserRole,
  MODERATOR: "moderator" as UserRole,
  USER: "user" as UserRole,
};

/**
 * Grupos de roles para verificaciones comunes
 */
export const ROLE_GROUPS = {
  ADMIN_ROLES: [ROLES.ADMIN, ROLES.MODERATOR] as UserRole[],
  ALL_ROLES: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER] as UserRole[],
};

/**
 * Verifica si un usuario tiene un rol específico
 */
export function hasRole(user: User | undefined, role: UserRole): boolean {
  if (!user || !user.roles) return false;
  return Object.values(user.roles).includes(role);
}

/**
 * Verifica si un usuario tiene alguno de los roles especificados
 */
export function hasAnyRole(user: User | undefined, roles: UserRole[]): boolean {
  if (!user || !user.roles) return false;
  const userRoleValues = Object.values(user.roles);
  return roles.some((role) => userRoleValues.includes(role));
}

/**
 * Verifica si un usuario tiene todos los roles especificados
 */
export function hasAllRoles(
  user: User | undefined,
  roles: UserRole[]
): boolean {
  if (!user || !user.roles) return false;
  const userRoleValues = Object.values(user.roles);
  return roles.every((role) => userRoleValues.includes(role));
}

/**
 * Verifica si un usuario es administrador
 */
export function isAdmin(user: User | undefined): boolean {
  return hasRole(user, ROLES.ADMIN);
}

/**
 * Verifica si un usuario es moderador o administrador
 */
export function isModerator(user: User | undefined): boolean {
  return hasAnyRole(user, ROLE_GROUPS.ADMIN_ROLES);
}

/**
 * Obtiene todos los roles de un usuario
 */
export function getUserRoles(user: User | undefined): UserRole[] {
  if (!user || !user.roles) return [];
  return Object.values(user.roles);
}

/**
 * Obtiene el primer rol del usuario (útil para compatibilidad)
 */
export function getPrimaryRole(user: User | undefined): UserRole {
  const roles = getUserRoles(user);
  return roles[0] || ROLES.USER;
}
