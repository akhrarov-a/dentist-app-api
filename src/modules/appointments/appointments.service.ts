import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@users/user.entity';
import { AppointmentEntity } from './appointment.entity';
import { CreateAppointmentDto } from './dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
    user: UserEntity,
  ): Promise<AppointmentEntity> {
    const { patientId, startTime, endTime, description } = createAppointmentDto;

    const appointment = new AppointmentEntity();

    appointment.patientId = patientId;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.description = description;
    appointment.user = user;

    await appointment.save();

    delete appointment.user;

    return appointment;
  }
}
