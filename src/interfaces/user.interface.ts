export type UserRole = "admin" | "moderator" | "user";

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  avatar?: Avatar;
  googlePhotoUrl?: string;
  roles?: Record<string, UserRole>; // { "roleId": "admin" }
}

interface Avatar {
  color: string;
  extras: string;
  outfit: string;
}
