import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Status } from '@core';
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

    query
      .andWhere(`appointment.user_id = :user_id`, { user_id: user.id })
      .leftJoinAndSelect(
        'appointment.appointmentServices',
        'appointmentServices',
      );

    if (service) {
      query.andWhere('appointmentServices.service_id = :service_id', {
        service_id: service,
      });
    }

    if (patient) {
      query.andWhere('appointment.patient_id = :patient_id', {
        patient_id: patient,
      });
    }

    query
      .innerJoinAndSelect(
        'appointment.patient',
        'patient',
        `CAST(patient.status AS TEXT) = '${Status.ACTIVE}'`,
      )
      .innerJoinAndSelect(
        'appointmentServices.service',
        'service',
        `CAST(service.status AS TEXT) = '${Status.ACTIVE}'`,
      )
      .orderBy('appointment.start_time', 'DESC');

    if (service) {
      query.select([
        'appointment.id',
        'appointment.start_time',
        'appointment.end_time',
        'appointmentServices.id',
        'appointmentServices.description',
        'service.id',
        'patient.id',
        'patient.firstname',
        'patient.lastname',
      ]);
    }

    if (patient) {
      query.select([
        'appointment.id',
        'appointment.start_time',
        'appointment.end_time',
        'appointmentServices.id',
        'appointmentServices.description',
        'service.id',
        'service.name',
      ]);
    }

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
    { date, type }: GetAppointmentsByDateDto,
    user: UserEntity,
  ): Promise<GetAppointmentsByDateResponseDto> {
    const targetDate = new Date(date);

    let startOfPeriod: Date;
    let endOfPeriod: Date;

    if (type === 'day') {
      startOfPeriod = new Date(targetDate);
      startOfPeriod.setHours(0, 0, 0, 0);

      endOfPeriod = new Date(targetDate);
      endOfPeriod.setHours(23, 59, 59, 999);
    } else if (type === 'week') {
      const dayOfWeek = targetDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

      startOfPeriod = new Date(targetDate);
      startOfPeriod.setDate(targetDate.getDate() + diffToMonday);
      startOfPeriod.setHours(0, 0, 0, 0);

      endOfPeriod = new Date(startOfPeriod);
      endOfPeriod.setDate(startOfPeriod.getDate() + 6);
      endOfPeriod.setHours(23, 59, 59, 999);
    }

    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query
      .andWhere(`appointment.user_id = :user_id`, { user_id: user.id })
      .andWhere('appointment.start_time >= :start_time', {
        start_time: startOfPeriod,
      })
      .andWhere('appointment.end_time <= :end_time', { end_time: endOfPeriod })
      .innerJoinAndSelect(
        'appointment.patient',
        'patient',
        `CAST(patient.status AS TEXT) = '${Status.ACTIVE}'`,
      )
      .leftJoinAndSelect(
        'appointment.appointmentServices',
        'appointmentServices',
      )
      .innerJoinAndSelect(
        'appointmentServices.service',
        'service',
        `CAST(service.status AS TEXT) = '${Status.ACTIVE}'`,
      )
      .select([
        'appointment.id',
        'appointment.start_time',
        'appointment.end_time',
        'appointment.description',
        'patient.id',
        'patient.firstname',
        'patient.lastname',
        'appointmentServices.id',
        'appointmentServices.description',
        'service.id',
        'service.name',
      ]);

    const appointments = await query.getMany();

    const groupedAppointments: GetAppointmentsByDateResponseDto['appointments'] =
      [];

    if (type === 'week') {
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfPeriod);
        currentDate.setDate(startOfPeriod.getDate() + i);

        const [day, month, year] = currentDate
          .toLocaleDateString('en-GB')
          .split('/');

        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        groupedAppointments.push({
          date: formattedDate,
          appointments: appointments
            .filter(
              (appointment) =>
                new Date(appointment.start_time).getDate() ===
                currentDate.getDate(),
            )
            .map(formatAppointmentToReturn),
        });
      }
    } else {
      const [day, month, year] = targetDate
        .toLocaleDateString('en-GB')
        .split('/');

      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      groupedAppointments.push({
        date: formattedDate,
        appointments: appointments.map(formatAppointmentToReturn),
      });
    }

    return {
      date,
      type,
      appointments: groupedAppointments,
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
    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query
      .andWhere('appointment.id = :id', { id })
      .andWhere(`appointment.user_id = :user_id`, { user_id: user.id })
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect(
        'appointment.appointmentServices',
        'appointmentServices',
      )
      .leftJoinAndSelect('appointmentServices.service', 'service')
      .select([
        'appointment.id',
        'appointment.start_time',
        'appointment.end_time',
        'appointment.description',
        'patient.id',
        'patient.firstname',
        'patient.lastname',
        'appointmentServices.id',
        'appointmentServices.description',
        'service.id',
      ]);

    const appointment = await query.getOne();

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

    await appointment.save();

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

      await this.checkForOverlappingAppointments(
        user,
        _startTime,
        _endTime,
        id,
      );

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

      appointmentService.user = user;
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
    id?: number,
  ): Promise<void> {
    const query = this.appointmentRepository.createQueryBuilder('appointment');

    query
      .where('appointment.user_id = :user_id', { user_id: user.id })
      .innerJoinAndSelect(
        'appointment.patient',
        'patient',
        `CAST(patient.status AS TEXT) = '${Status.ACTIVE}'`,
      )
      .leftJoinAndSelect(
        'appointment.appointmentServices',
        'appointmentServices',
      )
      .innerJoinAndSelect(
        'appointmentServices.service',
        'service',
        `CAST(service.status AS TEXT) = '${Status.ACTIVE}'`,
      )
      .andWhere('appointment.start_time < :end_time', { end_time: endTime })
      .andWhere('appointment.end_time > :start_time', {
        start_time: startTime,
      });

    const one = await query.getOne();

    if (!!one && one.id !== id) {
      throw new ConflictException(
        'You have already an appointment during this time',
      );
    }
  }
}
