export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  avatar?: Avatar;
  googlePhotoUrl?: string;
}

interface Avatar {
  color: string;
  extras: string;
  outfit: string;
}
