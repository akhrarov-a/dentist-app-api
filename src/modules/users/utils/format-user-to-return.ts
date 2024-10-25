import { UserEntity } from '../user.entity';
import { UserToReturn } from '../types';

export const formatUserToReturn = ({
  id,
  email,
  firstname,
  lastname,
  description,
  phone,
  role,
  createdAt,
  updatedAt,
}: UserEntity): UserToReturn => ({
  id,
  email,
  firstname,
  lastname,
  description,
  phone,
  role,
  createdAt,
  updatedAt,
});
