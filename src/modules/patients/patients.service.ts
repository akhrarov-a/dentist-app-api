import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@users/user.entity';
import {
  CreatePatientDto,
  GetPatientsFilterDto,
  UpdatePatientDto,
} from './dto';
import { PatientEntity } from './patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
  ) {}

  async getPatients(
    filterDto: GetPatientsFilterDto,
    user: UserEntity,
  ): Promise<PatientEntity[]> {
    const query = this.patientRepository.createQueryBuilder('patient');

    query.andWhere(`patient.userId = :userId`, { userId: user.id });

    Object.entries(filterDto).forEach(([key, value]) => {
      if (!value) return;

      query.andWhere(`patient.${key} LIKE :${key}`, {
        [key]: `%${value}%`,
      });
    });

    return await query.getMany();
  }

  async getPatientById(id: number, user: UserEntity): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOneBy({
      id,
      userId: user.id,
    });

    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    return patient;
  }

  async createPatient(
    createPatientDto: CreatePatientDto,
    user: UserEntity,
  ): Promise<PatientEntity> {
    const { firstname, lastname, phone, email, description } = createPatientDto;

    const patient = new PatientEntity();

    patient.firstname = firstname;
    patient.lastname = lastname;
    patient.phone = phone;
    patient.email = email;
    patient.description = description;
    patient.user = user;

    await patient.save();

    delete patient.user;

    return patient;
  }

  async updatePatientById(
    id: number,
    updatePatientDto: UpdatePatientDto,
    user: UserEntity,
  ): Promise<PatientEntity> {
    const patient = await this.getPatientById(id, user);

    Object.keys(updatePatientDto).map((key) => {
      patient[key] = updatePatientDto[key];
    });

    return await this.patientRepository.save(patient);
  }

  async deletePatient(id: number, user: UserEntity): Promise<void> {
    const result = await this.patientRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }
  }
}
