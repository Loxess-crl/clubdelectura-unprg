import { database } from "@/firebase/client";
import type { User } from "@/interfaces/user.interface";
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

export const getUserRole = async (uid: string): Promise<string | null> => {
  const roleRef = ref(database, `roles/${uid}`);
  const snapshot = await get(roleRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return typeof data === "string" ? data : data.role;
  }

  return null;
};
