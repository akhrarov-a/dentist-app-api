import { User } from '../user.entity';
import { UserToReturn } from '../types';

/**
 * Format user
 */
const formatUser = ({
  id,
  email,
  username,
  firstname,
  lastname,
  phone_number,
  role,
}: User): UserToReturn => ({
  id,
  email,
  username,
  firstname,
  lastname,
  phoneNumber: phone_number,
  role,
});

export { formatUser };
