import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async getPatients(filterDto: GetPatientsFilterDto): Promise<PatientEntity[]> {
    const query = this.patientRepository.createQueryBuilder('patient');

    Object.entries(filterDto).forEach(([key, value]) => {
      if (!value) return;

      query.andWhere(`patient.${key} LIKE :${key}`, {
        [key]: `%${value}%`,
      });
    });

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
    const { firstname, lastname, phone, email, description } = createPatientDto;

    const patient = new PatientEntity();

    patient.firstname = firstname;
    patient.lastname = lastname;
    patient.phone = phone;
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
