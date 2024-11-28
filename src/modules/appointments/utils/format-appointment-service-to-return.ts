import { AppointmentServiceEntity } from '../appointment-service.entity';
import { AppointmentServiceToReturnDto } from '../dto';
import { formatAppointmentToReturn } from './format-appointment-to-return';
import { formatServiceToReturn } from '@services/utils';

export const formatAppointmentServiceToReturn = ({
  id,
  appointment,
  service,
  description,
}: AppointmentServiceEntity): AppointmentServiceToReturnDto => {
  const appointServiceToReturnDto: AppointmentServiceToReturnDto = {
    id,
    service: formatServiceToReturn(service),
    description,
  } as AppointmentServiceToReturnDto;

  if (appointment) {
    appointServiceToReturnDto.appointment =
      formatAppointmentToReturn(appointment);
  }

  if (service) {
    appointServiceToReturnDto.service = formatServiceToReturn(service);
  }

  return appointServiceToReturnDto;
};
