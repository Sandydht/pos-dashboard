import { UserRole } from './user-role.model';

export interface User {
  id: string;
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
