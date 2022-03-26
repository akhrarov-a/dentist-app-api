import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from '@core';
import { User } from '@user';
import { AddPatientDto, GetPatientsFilterDto, UpdatePatientDto } from './dto';
import { Patient } from './patient.entity';

/**
 * Patient Service
 */
@Injectable()
class PatientService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
  ) {}

  /**
   * Get patients
   */
  async getPatients(
    filterDto: GetPatientsFilterDto,
    user: User,
  ): Promise<{ total: number; perPage?: number; patients: Patient[] }> {
    const { search, page, perPage } = filterDto;

    const query = this.patientRepository.createQueryBuilder('patient');

    await query.where('patient.user_id = :user', { user: user.id });

    if (search) {
      await query.andWhere(
        '(patient.firstname LIKE :search OR patient.lastname LIKE :search OR patient.description LIKE :search OR patient.phone_number LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const { total, data } = await paginate({ query, page, perPage });

    const response: { total: number; perPage?: number; patients: Patient[] } = {
      total,
      patients: data,
    };

    if (page && perPage) {
      response.perPage = perPage;
    }

    return response;
  }

  /**
   * Get patient by id
   */
  async getPatientById(
    id: number,
    user: number,
  ): Promise<{ patient: Patient }> {
    const patient = await this.patientRepository.findOne({
      where: { id, user_id: user },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return { patient };
  }

  /**
   * Add patient
   */
  async addPatient(
    addPatientDto: AddPatientDto,
    user: User,
  ): Promise<{ patient: Patient }> {
    const { firstname, lastname, description, phoneNumber, email } =
      addPatientDto;

    const existsPhoneNumber = await this.patientRepository.findOne({
      where: { phone_number: phoneNumber, user_id: user.id },
    });
    if (existsPhoneNumber) {
      throw new ConflictException(
        'Patient with this phone number already exists',
      );
    }

    const existsEmail = await this.patientRepository.findOne({
      where: { email, user_id: user.id },
    });
    if (existsEmail) {
      throw new ConflictException('Patient with this email already exists');
    }

    const patient = new Patient();

    patient.firstname = firstname;
    patient.lastname = lastname;
    patient.description = description;
    patient.phone_number = phoneNumber;
    patient.email = email;
    patient.user = user;
    patient.user_id = user.id;

    await patient.save();

    delete patient.user;

    return { patient };
  }

  /**
   * Update patient by id
   */
  async updatePatientById(
    id: number,
    body: UpdatePatientDto,
    user: number,
  ): Promise<{ patient: Patient }> {
    const { patient } = await this.getPatientById(id, user);

    Object.keys(body).map((key) => {
      switch (true) {
        case key === 'phoneNumber':
          patient.phone_number = body.phoneNumber;

          break;
        default:
          patient[key] = body[key];
      }
    });

    await patient.save();

    return { patient };
  }

  /**
   * Delete patient by id
   */
  async deletePatientById(id: number, user: number): Promise<void> {
    const result = await this.patientRepository.delete({ id, user_id: user });

    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }
}

export { PatientService };
