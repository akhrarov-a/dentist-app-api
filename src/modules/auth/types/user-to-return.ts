import { UserRole } from '@user';

/**
 * User to return
 */
class UserToReturn {
  /**
   * Id
   */
  id: number;

  /**
   * Username
   */
  username: string;

  /**
   * Firstname
   */
  firstname: string;

  /**
   * Lastname
   */
  lastname: string;

  /**
   * Phone number
   */
  phoneNumber: string;

  /**
   * Email
   */
  email: string;

  /**
   * Role
   */
  role: UserRole;
}

export { UserToReturn };
