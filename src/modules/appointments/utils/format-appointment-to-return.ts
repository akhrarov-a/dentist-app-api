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
}: AppointmentEntity): AppointmentToReturnDto => {
  const appointmentToReturnDto: AppointmentToReturnDto = {
    ...rest,
    createdAt: created_at,
    updatedAt: updated_at,
    startTime: start_time,
    endTime: end_time,
  } as unknown as AppointmentToReturnDto;

  if (appointmentServices?.length) {
    appointmentToReturnDto.appointmentServices = appointmentServices.map(
      formatAppointmentServiceToReturn,
    );
  }

  if (patient) {
    appointmentToReturnDto.patient = formatPatientToReturn(patient);
  }

  return appointmentToReturnDto;
};
