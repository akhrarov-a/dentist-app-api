import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from '@core';
import { UserEntity } from '@users/user.entity';
import { PatientsService } from '@patients/patients.service';
import { ServicesService } from '@services/services.service';
import { AppointmentEntity } from './appointment.entity';
import {
  AppointmentResponseWithPatientAndServiceDto,
  CreateAppointmentDto,
  GetAppointmentsByDateResponseDto,
  GetAppointmentsByPatientDto,
  GetAppointmentsByPatientResponseDto,
  GetAppointmentsByServiceDto,
  GetAppointmentsByServiceResponseDto,
  UpdateAppointmentDto,
} from './dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly servicesService: ServicesService,
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  async getAppointmentsByPatient(
    { patient, page, perPage }: GetAppointmentsByPatientDto,
    user: UserEntity,
  ): Promise<GetAppointmentsByPatientResponseDto> {
    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query.andWhere('appointment.userId = :userId', { userId: user.id });

    query.andWhere('appointment.patientId >= :patientId', {
      patientId: patient,
    });

    const { totalAmount, totalPages, data } = await paginate<AppointmentEntity>(
      {
        query,
        page,
        perPage,
      },
    );

    const appointmentsWithPatient = await Promise.all(
      data.map((appointment) =>
        this.appointmentResponseWithPatientAndService(appointment, user),
      ),
    );

    const response: GetAppointmentsByPatientResponseDto = {
      data: appointmentsWithPatient,
      totalAmount,
      totalPages,
    };

    if (page && perPage) {
      response.page = +page;
      response.perPage = +perPage;
    }

    return response;
  }

  async getAppointmentsByService(
    { service, page, perPage }: GetAppointmentsByServiceDto,
    user: UserEntity,
  ): Promise<GetAppointmentsByServiceResponseDto> {
    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query.andWhere('appointment.userId = :userId', { userId: user.id });

    query.andWhere('appointment.serviceId >= :serviceId', {
      serviceId: service,
    });

    const { totalAmount, totalPages, data } = await paginate<AppointmentEntity>(
      {
        query,
        page,
        perPage,
      },
    );

    const appointmentsWithPatientAndService = await Promise.all(
      data.map((appointment) =>
        this.appointmentResponseWithPatientAndService(appointment, user),
      ),
    );

    const response: GetAppointmentsByServiceResponseDto = {
      data: appointmentsWithPatientAndService,
      totalAmount,
      totalPages,
    };

    if (page && perPage) {
      response.page = +page;
      response.perPage = +perPage;
    }

    return response;
  }

  async getAppointmentsByDate(
    date: string,
    user: UserEntity,
  ): Promise<GetAppointmentsByDateResponseDto> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query.andWhere('appointment.userId = :userId', { userId: user.id });

    query
      .andWhere('appointment.startTime >= :startOfDay', { startOfDay })
      .andWhere('appointment.endTime <= :endOfDay', { endOfDay });

    const appointments = await query.getMany();

    const appointmentsWithPatient = await Promise.all(
      appointments.map((appointment) =>
        this.appointmentResponseWithPatientAndService(appointment, user),
      ),
    );

    return {
      date,
      appointments: appointmentsWithPatient,
    };
  }

  async getAppointmentById(
    id: number,
    user: UserEntity,
  ): Promise<AppointmentResponseWithPatientAndServiceDto> {
    const appointment = await this.appointmentRepository.findOneBy({
      id,
      userId: user.id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return this.appointmentResponseWithPatientAndService(appointment, user);
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
    user: UserEntity,
  ): Promise<AppointmentResponseWithPatientAndServiceDto> {
    const { patientId, services, startTime, endTime, description } =
      createAppointmentDto;

    // check for patient exists
    await this.patientsService.getPatientById(patientId, user);

    // check for no another appointment in this time
    await this.checkForOverlappingAppointments(user, startTime, endTime);

    const appointment = new AppointmentEntity();

    appointment.patientId = patientId;
    appointment.services = services;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.description = description;
    appointment.user = user;

    await appointment.save();

    delete appointment.user;

    return this.appointmentResponseWithPatientAndService(appointment, user);
  }

  async updateAppointmentById(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    user: UserEntity,
  ): Promise<AppointmentResponseWithPatientAndServiceDto> {
    const appointment = await this.appointmentRepository.findOneBy({
      id,
      userId: user.id,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    const { startTime, endTime, patientId, services, description } =
      updateAppointmentDto;

    if (description) {
      appointment.description = description;
    }

    if (patientId) {
      // check for patient exists
      await this.patientsService.getPatientById(patientId, user);

      appointment.patientId = patientId;
    }

    if (!!services?.length) {
      // check for services exist
      await Promise.all(
        services.map((serviceDto) =>
          this.servicesService.getServiceById(serviceDto.id, user),
        ),
      );

      appointment.services = services;
    }

    if (startTime || endTime) {
      const _startTime = startTime || appointment.startTime;
      const _endTime = endTime || appointment.endTime;

      // check for no another appointment in this time
      await this.checkForOverlappingAppointments(user, _startTime, _endTime);

      appointment.startTime = _startTime;
      appointment.endTime = _endTime;
    }

    return this.appointmentResponseWithPatientAndService(
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

  private async appointmentResponseWithPatientAndService(
    { patientId, services, ...appointment }: AppointmentEntity,
    user: UserEntity,
  ): Promise<AppointmentResponseWithPatientAndServiceDto> {
    const patient = await this.patientsService.getPatientById(patientId, user);
    const results = await Promise.all(
      services.map((serviceDto) =>
        this.servicesService.getServiceById(serviceDto.id, user),
      ),
    );

    return {
      ...appointment,
      patient,
      services: results,
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
