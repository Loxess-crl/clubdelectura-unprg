import { database } from "@/firebase/client";
import type { User, UserRole } from "@/interfaces/user.interface";
import { get, ref, set, update } from "firebase/database";

export async function getUserById(userId: string): Promise<User | undefined> {
  const booksRef = ref(database, `users/${userId}`);

  const snapshot = await get(booksRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return undefined;
  }
}

export async function addUser(newUser: User) {
  const userRef = ref(database, `users/${newUser.id}`);
  await set(userRef, newUser);
}

export async function updateUser(userId: string, updatedUser: User) {
  const userRef = ref(database, `users/${userId}`);
  await update(userRef, updatedUser);
}

/**
 * Obtiene los roles de un usuario desde Firebase
 * @param uid - ID del usuario
 * @returns Un objeto con los roles del usuario o null si no tiene roles
 */
export const getUserRoles = async (
  uid: string
): Promise<Record<string, UserRole> | null> => {
  const roleRef = ref(database, `roles/${uid}`);
  const snapshot = await get(roleRef);

  if (snapshot.exists()) {
    return snapshot.val();
  }

  return null;
};

/**
 * @deprecated Usar getUserRoles en su lugar
 */
export const getUserRole = async (uid: string): Promise<string | null> => {
  const roleRef = ref(database, `roles/${uid}`);
  const snapshot = await get(roleRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return typeof data === "string" ? data : data.role;
  }

  return null;
};

/**
 * Obtiene el usuario completo con sus roles desde Firebase
 * @param userId - ID del usuario
 * @returns Usuario con roles incluidos o undefined
 */
export async function getUserWithRoles(
  userId: string
): Promise<User | undefined> {
  const user = await getUserById(userId);

  if (user) {
    const roles = await getUserRoles(userId);
    if (roles) {
      user.roles = roles;
    }
    return user;
  }

  return undefined;
}

/**
 * Verifica si un usuario tiene un rol específico
 * @param user - Usuario a verificar
 * @param role - Rol a buscar
 * @returns true si el usuario tiene el rol
 */
export function userHasRole(user: User, role: UserRole): boolean {
  if (!user.roles) return false;
  return Object.values(user.roles).includes(role);
}

/**
 * Verifica si un usuario tiene alguno de los roles especificados
 * @param user - Usuario a verificar
 * @param roles - Array de roles a buscar
 * @returns true si el usuario tiene al menos uno de los roles
 */
export function userHasAnyRole(user: User, roles: UserRole[]): boolean {
  if (!user.roles) return false;
  const userRoleValues = Object.values(user.roles);
  return roles.some((role) => userRoleValues.includes(role));
}
