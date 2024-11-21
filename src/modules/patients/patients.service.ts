import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '@users/user.entity';
import { paginate, Status } from '@core';
import {
  CreatePatientDto,
  DeleteByIdsDto,
  FindPatientsByFirstnameOrLastnameDto,
  GetPatientsFilterDto,
  GetPatientsResponseDto,
  UpdatePatientByIdDto,
} from './dto';
import { PatientEntity } from './patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
  ) {}

  async getPatients(
    { page, perPage, ...filterDto }: GetPatientsFilterDto,
    user: UserEntity,
  ): Promise<GetPatientsResponseDto> {
    const query = this.patientRepository.createQueryBuilder('patient');

    query.andWhere(`patient.userId = :userId`, { userId: user.id });
    query.andWhere(`patient.status = :status`, { status: Status.ACTIVE });

    Object.entries(filterDto).forEach(([key, value]) => {
      if (!value) return;

      query.andWhere(`patient.${key} LIKE :${key}`, {
        [key]: `%${value}%`,
      });
    });

    const { totalAmount, totalPages, data } = await paginate<PatientEntity>({
      query,
      page,
      perPage,
    });

    const response: GetPatientsResponseDto = {
      data,
      totalAmount,
      totalPages,
    };

    if (page && perPage) {
      response.page = +page;
      response.perPage = +perPage;
    }

    return response;
  }

  async getPatientById(id: number, user: UserEntity): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOneBy({
      id,
      userId: user.id,
      status: Status.ACTIVE,
    });

    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    return patient;
  }

  async createPatient(
    createPatientDto: CreatePatientDto,
    user: UserEntity,
  ): Promise<Pick<PatientEntity, 'id'>> {
    const { firstname, lastname, phone, email, description } = createPatientDto;

    const patient = new PatientEntity();

    patient.firstname = firstname;
    patient.lastname = lastname;
    patient.phone = phone;
    patient.email = email;
    patient.description = description;
    patient.user = user;
    patient.status = Status.ACTIVE;

    await patient.save();

    return { id: patient.id };
  }

  async updatePatientById(
    id: number,
    updatePatientByIdDto: UpdatePatientByIdDto,
    user: UserEntity,
  ): Promise<void> {
    const patient = await this.getPatientById(id, user);

    Object.keys(updatePatientByIdDto).map((key) => {
      patient[key] = updatePatientByIdDto[key];
    });

    await this.patientRepository.save(patient);
  }

  async deletePatientById(id: number, user: UserEntity): Promise<void> {
    const patient = await this.getPatientById(id, user);

    await this.patientRepository.save({ ...patient, status: Status.DELETED });
  }

  async deletePatientsByIds(
    deleteByIdsDto: DeleteByIdsDto,
    user: UserEntity,
  ): Promise<void> {
    const patients = await this.patientRepository.findBy({
      id: In(deleteByIdsDto.ids),
      userId: user.id,
      status: Status.ACTIVE,
    });

    if (!patients.length) {
      throw new NotFoundException(
        `Patients with ids ${deleteByIdsDto.ids.join(', ')} not found`,
      );
    }

    patients.forEach((patient) => {
      patient.status = Status.DELETED;
    });

    await this.patientRepository.save(patients);
  }

  async findPatientsByFirstNameOrLastName(
    findPatientsByFirstnameOrLastnameDto: FindPatientsByFirstnameOrLastnameDto,
    user: UserEntity,
  ): Promise<PatientEntity[]> {
    const query = this.patientRepository.createQueryBuilder('patient');

    query.andWhere(`patient.userId = :userId`, { userId: user.id });
    query.andWhere(`patient.status = :status`, { status: Status.ACTIVE });

    query.andWhere(`patient.firstname LIKE :search`, {
      search: `%${findPatientsByFirstnameOrLastnameDto.search}%`,
    });

    query.orWhere(`patient.lastname LIKE :search`, {
      search: `%${findPatientsByFirstnameOrLastnameDto.search}%`,
    });

    return (await query.getMany()).slice(0, 20);
  }
}
