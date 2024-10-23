import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPatientsFilterDto } from './dto/get-patients-filter.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientEntity } from './patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
  ) {}

  async getPatients(filterDto: GetPatientsFilterDto): Promise<PatientEntity[]> {
    const { firstName, lastName, phoneNumber, email, description } = filterDto;

    const query = this.patientRepository.createQueryBuilder('patient');

    if (firstName) {
      query.andWhere('patient.firstName LIKE :firstName', {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      query.andWhere('patient.lastName LIKE :lastName', {
        lastName: `%${lastName}%`,
      });
    }

    if (phoneNumber) {
      query.andWhere('patient.phoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${phoneNumber}%`,
      });
    }

    if (email) {
      query.andWhere('patient.email LIKE :email', { email: `%${email}%` });
    }

    if (description) {
      query.andWhere('patient.description LIKE :description', {
        description: `%${description}%`,
      });
    }

    return await query.getMany();
  }

  async getPatientById(id: number): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOneBy({ id });

    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    return patient;
  }

  async createPatient(
    createPatientDto: CreatePatientDto,
  ): Promise<PatientEntity> {
    const { firstName, lastName, phoneNumber, email, description } =
      createPatientDto;

    const patient = new PatientEntity();

    patient.firstName = firstName;
    patient.lastName = lastName;
    patient.phoneNumber = phoneNumber;
    patient.email = email;
    patient.description = description;

    await patient.save();

    return patient;
  }

  async updatePatientById(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<PatientEntity> {
    const patient = await this.patientRepository.preload({
      id,
      ...updatePatientDto,
    });

    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    return await this.patientRepository.save(patient);
  }

  async deletePatient(id: number): Promise<void> {
    const result = await this.patientRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }
  }
}
