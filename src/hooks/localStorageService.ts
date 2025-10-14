import { LocalStorageKeys } from "@/data/constants";
import type { User, UserRole } from "@/interfaces/user.interface";

export const setLocalStorageItem = (key: LocalStorageKeys, value: any) => {
  const keyString = JSON.stringify(key);
  const valueString = JSON.stringify(value);

  const keyEncoded = btoa(keyString);
  const valueEncoded = btoa(valueString);

  localStorage.setItem(keyEncoded, valueEncoded);
};

export const getItemsFromLocalStorage = <T>(
  key: LocalStorageKeys
): T | undefined => {
  const keyString = JSON.stringify(key);
  const keyEncoded = btoa(keyString);

  const value = localStorage.getItem(keyEncoded);

  if (value) {
    const valueDecoded = atob(value);
    return JSON.parse(valueDecoded);
  }
};

export const clearTotalLocalStorage = () => {
  localStorage.clear();
};

/**
 * @deprecated Usar userHasRole o userHasAnyRole desde useUser.ts
 */
export const isUserAdmin = (): boolean => {
  const role = getItemsFromLocalStorage<string>(LocalStorageKeys.role);
  return role === "admin";
};

/**
 * Verifica si el usuario actual tiene un rol específico
 */
export const currentUserHasRole = (role: UserRole): boolean => {
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);
  if (!user || !user.roles) return false;
  return Object.values(user.roles).includes(role);
};

/**
 * Verifica si el usuario actual tiene alguno de los roles especificados
 */
export const currentUserHasAnyRole = (roles: UserRole[]): boolean => {
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);
  if (!user || !user.roles) return false;
  const userRoleValues = Object.values(user.roles);
  return roles.some((role) => userRoleValues.includes(role));
};

/**
 * Obtiene todos los roles del usuario actual
 */
export const getCurrentUserRoles = (): UserRole[] => {
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);
  if (!user || !user.roles) return [];
  return Object.values(user.roles);
};
