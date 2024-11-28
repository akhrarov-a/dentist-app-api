import { formatPatientToReturn } from '@patients/utils';
import { AppointmentEntity } from '../appointment.entity';
import { AppointmentToReturnDto } from '../dto';
import { formatAppointmentServiceToReturn } from './format-appointment-service-to-return';

export const formatAppointmentToReturn = ({
  created_at,
  updated_at,
  start_time,
  end_time,
  patient,
  appointmentServices,
  ...rest
}: AppointmentEntity): AppointmentToReturnDto => ({
  ...rest,
  appointmentServices: appointmentServices.map(
    formatAppointmentServiceToReturn,
  ),
  patient: formatPatientToReturn(patient),
  createdAt: created_at,
  updatedAt: updated_at,
  startTime: start_time,
  endTime: end_time,
});
