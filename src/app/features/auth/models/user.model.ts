import { UserRole } from './user-role.model';

export interface User {
  id: string;
  photoUrl: string | null;
  username: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  roles: UserRole[];
  password?: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
