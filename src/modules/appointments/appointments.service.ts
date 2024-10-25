import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@users/user.entity';
import { PatientsService } from '@patients/patients.service';
import { AppointmentEntity } from './appointment.entity';
import {
  AppointmentResponseWithPatientDto,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly patientsService: PatientsService,
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  async getAppointmentById(
    id: number,
    user: UserEntity,
  ): Promise<AppointmentResponseWithPatientDto> {
    const appointment = await this.appointmentRepository.findOneBy({
      id,
      userId: user.id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return this.appointmentResponseWithPatient(appointment, user);
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
    user: UserEntity,
  ): Promise<AppointmentResponseWithPatientDto> {
    const { patientId, startTime, endTime, description } = createAppointmentDto;

    // check for patient exists
    await this.patientsService.getPatientById(patientId, user);

    // check for no another appointment in this time
    await this.checkForOverlappingAppointments(user, startTime, endTime);

    const appointment = new AppointmentEntity();

    appointment.patientId = patientId;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.description = description;
    appointment.user = user;

    await appointment.save();

    delete appointment.user;

    return this.appointmentResponseWithPatient(appointment, user);
  }

  async updateAppointmentById(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    user: UserEntity,
  ): Promise<AppointmentResponseWithPatientDto> {
    const appointment = await this.appointmentRepository.findOneBy({
      id,
      userId: user.id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    const { startTime, endTime, patientId, description } = updateAppointmentDto;

    if (description) {
      appointment.description = description;
    }

    if (patientId) {
      // check for patient exists
      await this.patientsService.getPatientById(patientId, user);

      appointment.patientId = patientId;
    }

    if (startTime || endTime) {
      const _startTime = startTime || appointment.startTime;
      const _endTime = endTime || appointment.endTime;

      // check for no another appointment in this time
      await this.checkForOverlappingAppointments(user, _startTime, _endTime);

      appointment.startTime = _startTime;
      appointment.endTime = _endTime;
    }

    return this.appointmentResponseWithPatient(
      await this.appointmentRepository.save(appointment),
      user,
    );
  }

  async deleteAppointmentById(id: number, user: UserEntity): Promise<void> {
    const result = await this.appointmentRepository.delete({
      id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
  }

  private async appointmentResponseWithPatient(
    { patientId, ...appointment }: AppointmentEntity,
    user: UserEntity,
  ): Promise<AppointmentResponseWithPatientDto> {
    const patient = await this.patientsService.getPatientById(patientId, user);

    return {
      ...appointment,
      patient,
    };
  }

  private async checkForOverlappingAppointments(
    user: UserEntity,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query
      .where('appointment.userId = :userId', { userId: user.id })
      .andWhere('appointment.startTime < :endTime', { endTime })
      .andWhere('appointment.endTime > :startTime', { startTime });

    if (!!(await query.getOne())) {
      throw new ConflictException(
        'You have already an appointment during this time',
      );
    }
  }
}
