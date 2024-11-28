import { PatientToReturnDto } from '../dto';
import { PatientEntity } from '../patient.entity';

export const formatPatientToReturn = ({
  created_at,
  updated_at,
  ...rest
}: PatientEntity): PatientToReturnDto => ({
  ...rest,
  createdAt: created_at,
  updatedAt: updated_at,
});
