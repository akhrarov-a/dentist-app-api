import { ServiceEntity } from '../service.entity';
import { ServiceToReturnDto } from '../dto';

export const formatServiceToReturn = ({
  created_at,
  updated_at,
  ...rest
}: ServiceEntity): ServiceToReturnDto => ({
  ...rest,
  createdAt: created_at,
  updatedAt: updated_at,
});
