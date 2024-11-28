import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from '@core';
import { UserEntity } from '@users/user.entity';
import { PatientsService } from '@patients/patients.service';
import { ServicesService } from '@services/services.service';
import { formatAppointmentToReturn } from './utils';
import {
  AppointmentToReturnDto,
  CreateAppointmentDto,
  CreateAppointmentResponseDto,
  GetAppointmentsByDateDto,
  GetAppointmentsByDateResponseDto,
  GetAppointmentsDto,
  GetAppointmentsResponseDto,
  ServiceDto,
  UpdateAppointmentDto,
} from './dto';
import { AppointmentEntity } from './appointment.entity';
import { AppointmentServiceEntity } from './appointment-service.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(PatientsService) private readonly patientsService: PatientsService,
    @Inject(ServicesService) private readonly servicesService: ServicesService,
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(AppointmentServiceEntity)
    private readonly appointmentServiceRepository: Repository<AppointmentServiceEntity>,
  ) {}

  async getAppointments(
    { patient, service, page, perPage }: GetAppointmentsDto,
    user: UserEntity,
  ): Promise<GetAppointmentsResponseDto> {
    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query.andWhere(`appointment.user_id = :user_id`, { user_id: user.id });

    if (service) {
      query.andWhere('appointment.service_id = :service_id', {
        service_id: service,
      });
    }

    if (patient) {
      query.andWhere('appointment.patient_id = :patient_id', {
        patient_id: patient,
      });
    }

    query
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect(
        'appointment.appointmentServices',
        'appointmentServices',
      )
      .leftJoinAndSelect('appointmentServices.service', 'service');

    const { totalAmount, totalPages, data } = await paginate<AppointmentEntity>(
      {
        query,
        page,
        perPage,
      },
    );

    const response: GetAppointmentsResponseDto = {
      data: data.map(formatAppointmentToReturn),
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
    { date }: GetAppointmentsByDateDto,
    user: UserEntity,
  ): Promise<GetAppointmentsByDateResponseDto> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query
      .andWhere(`appointment.user_id = :user_id`, { user_id: user.id })
      .andWhere('appointment.startTime >= :startOfDay', { startOfDay })
      .andWhere('appointment.endTime <= :endOfDay', { endOfDay })
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect(
        'appointment.appointmentServices',
        'appointmentServices',
      )
      .leftJoinAndSelect('appointmentServices.service', 'service');

    const appointments = await query.getMany();

    return {
      date,
      appointments: appointments.map(formatAppointmentToReturn),
    };
  }

  async getFormattedAppointmentById(
    id: number,
    user: UserEntity,
  ): Promise<AppointmentToReturnDto> {
    return formatAppointmentToReturn(await this.getAppointmentById(id, user));
  }

  async getAppointmentById(
    id: number,
    user: UserEntity,
  ): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id,
        user: { id: user.id },
      },
      relations: [
        'patient',
        'appointmentServices',
        'appointmentServices.service',
      ],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return appointment;
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
    user: UserEntity,
  ): Promise<CreateAppointmentResponseDto> {
    const { patientId, services, startTime, endTime, description } =
      createAppointmentDto;

    const patient = await this.patientsService.getPatientById(patientId, user);

    await this.checkForOverlappingAppointments(user, startTime, endTime);

    const appointment = new AppointmentEntity();

    appointment.start_time = startTime;
    appointment.end_time = endTime;
    appointment.description = description;
    appointment.user = user;
    appointment.patient = patient;

    await this.createAndSaveAppointmentServiceRelations(
      services,
      appointment,
      user,
    );

    await appointment.save();

    return { id: appointment.id };
  }

  async updateAppointmentById(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    user: UserEntity,
  ): Promise<void> {
    const appointment = await this.appointmentRepository.findOneBy({
      id,
      user: { id: user.id },
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
      const patient = await this.patientsService.getPatientById(
        patientId,
        user,
      );

      appointment.patient = patient;
    }

    if (startTime || endTime) {
      const _startTime = startTime || appointment.start_time;
      const _endTime = endTime || appointment.end_time;

      // check for no another appointment in this time
      await this.checkForOverlappingAppointments(user, _startTime, _endTime);

      appointment.start_time = _startTime;
      appointment.end_time = _endTime;
    }

    if (!!services?.length) {
      await this.appointmentServiceRepository.delete({
        appointment,
      });

      await this.createAndSaveAppointmentServiceRelations(
        services,
        appointment,
        user,
      );
    }

    await this.appointmentRepository.save(appointment);
  }

  async deleteAppointmentById(id: number, user: UserEntity): Promise<void> {
    const result = await this.appointmentRepository.delete({
      id,
      user: { id: user.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
  }

  private async createAndSaveAppointmentServiceRelations(
    services: ServiceDto[],
    appointment: AppointmentEntity,
    user: UserEntity,
  ): Promise<void> {
    const serviceEntities = await this.servicesService.getServicesByIds(
      services.map((serviceItem) => serviceItem.id),
      user,
    );

    const appointmentServiceRelations = services.map((serviceItem) => {
      const service = serviceEntities.find(
        (service) => service.id === serviceItem.id,
      );

      const appointmentService = new AppointmentServiceEntity();

      appointmentService.appointment = appointment;
      appointmentService.service = service;
      appointmentService.description = serviceItem.description;

      return appointmentService;
    });

    appointment.appointmentServices = appointmentServiceRelations;

    await this.appointmentServiceRepository.save(appointmentServiceRelations);
  }

  private async checkForOverlappingAppointments(
    user: UserEntity,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query
      .where('appointment.user_id = :user_id', { user_id: user.id })
      .andWhere('appointment.startTime < :endTime', { endTime })
      .andWhere('appointment.endTime > :startTime', { startTime });

    if (!!(await query.getOne())) {
      throw new ConflictException(
        'You have already an appointment during this time',
      );
    }
  }
}
