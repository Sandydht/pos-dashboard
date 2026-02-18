import { User } from './user.model';

export interface RegisterLoginResponse {
  accessToken: string;
  user: User;
}
