import { AppointmentServiceEntity } from '../appointment-service.entity';
import { AppointmentServiceToReturnDto } from '../dto';
import { formatAppointmentToReturn } from './format-appointment-to-return';
import { formatServiceToReturn } from '@services/utils';

export const formatAppointmentServiceToReturn = ({
  id,
  appointment,
  service,
  description,
}: AppointmentServiceEntity): AppointmentServiceToReturnDto => ({
  id,
  appointment: formatAppointmentToReturn(appointment),
  service: formatServiceToReturn(service),
  description,
});
