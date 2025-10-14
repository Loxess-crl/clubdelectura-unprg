/**
 * Script de utilidad para gestionar roles de usuarios en Firebase
 *
 * IMPORTANTE: Este archivo es solo para referencia.
 * Los roles deben ser gestionados desde Firebase Console o mediante
 * Cloud Functions por seguridad.
 */

import { ref, set, get, remove } from "firebase/database";
import { database } from "@/firebase/client";
import type { UserRole } from "@/interfaces/user.interface";

/**
 * Asigna un rol a un usuario
 * @param userId - ID del usuario
 * @param role - Rol a asignar
 * @returns Promise
 */
export async function assignRoleToUser(
  userId: string,
  role: UserRole
): Promise<void> {
  const roleId = Date.now().toString(); // Usar timestamp como ID único
  const roleRef = ref(database, `roles/${userId}/${roleId}`);
  await set(roleRef, role);
}

/**
 * Asigna múltiples roles a un usuario
 * @param userId - ID del usuario
 * @param roles - Array de roles a asignar
 */
export async function assignMultipleRoles(
  userId: string,
  roles: UserRole[]
): Promise<void> {
  const rolesData: Record<string, UserRole> = {};

  roles.forEach((role, index) => {
    const roleId = `${Date.now()}_${index}`;
    rolesData[roleId] = role;
  });

  const rolesRef = ref(database, `roles/${userId}`);
  await set(rolesRef, rolesData);
}

/**
 * Elimina todos los roles de un usuario
 * @param userId - ID del usuario
 */
export async function removeAllUserRoles(userId: string): Promise<void> {
  const rolesRef = ref(database, `roles/${userId}`);
  await remove(rolesRef);
}

/**
 * Actualiza un rol específico de un usuario
 * @param userId - ID del usuario
 * @param roleId - ID del rol a actualizar
 * @param newRole - Nuevo rol
 */
export async function updateUserRole(
  userId: string,
  roleId: string,
  newRole: UserRole
): Promise<void> {
  const roleRef = ref(database, `roles/${userId}/${roleId}`);
  await set(roleRef, newRole);
}

/**
 * Lista todos los usuarios con roles de admin
 */
export async function listAdminUsers(): Promise<Record<string, any>> {
  const rolesRef = ref(database, `roles`);
  const snapshot = await get(rolesRef);

  if (!snapshot.exists()) {
    return {};
  }

  const allRoles = snapshot.val();
  const admins: Record<string, any> = {};

  Object.entries(allRoles).forEach(([userId, roles]) => {
    const userRoles = roles as Record<string, UserRole>;
    const hasAdmin = Object.values(userRoles).includes("admin");

    if (hasAdmin) {
      admins[userId] = userRoles;
    }
  });

  return admins;
}

// ============================================
// EJEMPLOS DE USO
// ============================================

/**
 * Ejemplo: Hacer a un usuario administrador
 */
export async function makeUserAdmin(userId: string) {
  await assignRoleToUser(userId, "admin");
  console.log(`Usuario ${userId} ahora es admin`);
}

/**
 * Ejemplo: Hacer a un usuario moderador
 */
export async function makeUserModerator(userId: string) {
  await assignRoleToUser(userId, "moderator");
  console.log(`Usuario ${userId} ahora es moderador`);
}

/**
 * Ejemplo: Dar múltiples roles a un usuario
 */
export async function makeUserAdminAndModerator(userId: string) {
  await assignMultipleRoles(userId, ["admin", "moderator"]);
  console.log(`Usuario ${userId} ahora es admin y moderador`);
}

// ============================================
// CÓMO USAR EN FIREBASE CONSOLE
// ============================================

/*
Para agregar roles manualmente en Firebase Console:

1. Ve a Firebase Console > Realtime Database
2. Navega a la estructura de tu base de datos
3. Crea o edita el nodo "roles"
4. Agrega la siguiente estructura:

roles/
  └── {userId}/ (ej: "z5KMYyA...")
      └── {roleId}/ (ej: "role_1234567890")
          └── "admin"

Ejemplo JSON:
{
  "roles": {
    "z5KMYyA...": {
      "role_1234567890": "admin",
      "role_1234567891": "moderator"
    },
    "anotherUserId": {
      "role_1234567892": "moderator"
    }
  }
}

NOTA: El roleId puede ser cualquier string único. Se recomienda usar timestamps.
*/

// ============================================
// REGLAS DE SEGURIDAD RECOMENDADAS
// ============================================

/*
Para Firebase Realtime Database, agrega estas reglas de seguridad:

{
  "rules": {
    "roles": {
      ".read": "auth != null",
      "$userId": {
        ".write": "root.child('roles').child(auth.uid).val() === 'admin'"
      }
    }
  }
}

Esto permite que:
- Cualquier usuario autenticado pueda LEER roles
- Solo usuarios con rol 'admin' puedan ESCRIBIR roles
*/
