import { UserRole } from './user-role.enum';

export class UserToReturn {
  id: number;
  firstname: string;
  lastname: string;
  description: string;
  phone: string;
  email: string;
  role: UserRole;
}
