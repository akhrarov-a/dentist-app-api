import { User } from '../user.entity';
import { UserToReturn } from '../types';

/**
 * Format user
 */
const formatUser = ({
  id,
  email,
  username,
  first_name,
  last_name,
  phone_number,
  role,
}: User): UserToReturn => ({
  id,
  email,
  username,
  firstname: first_name,
  lastname: last_name,
  phoneNumber: phone_number,
  role,
});

export { formatUser };
