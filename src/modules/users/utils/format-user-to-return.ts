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
  layoutTitle,
  language,
  holidays,
  weekends,
}: UserEntity): UserToReturn => ({
  id,
  email,
  firstname,
  lastname,
  description,
  phone,
  role,
  status,
  layoutTitle,
  language,
  holidays,
  weekends,
  createdAt: created_at,
  updatedAt: updated_at,
});
