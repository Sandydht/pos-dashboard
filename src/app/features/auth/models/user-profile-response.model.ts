import { UserRole } from './user-role.model';

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
