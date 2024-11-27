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
  status,
  created_at,
  updated_at,
}: UserEntity): UserToReturn => ({
  id,
  email,
  firstname,
  lastname,
  description,
  phone,
  role,
  status,
  createdAt: created_at,
  updatedAt: updated_at,
});
