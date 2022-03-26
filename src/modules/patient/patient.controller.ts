import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, User } from '@user';
import { DentistGuard } from '@core';
import { AddPatientDto, GetPatientsFilterDto, UpdatePatientDto } from './dto';
import { Patient } from './patient.entity';
import { PatientService } from './patient.service';

/**
 * Patient Controller
 */
@Controller('patients')
@UseGuards(AuthGuard('jwt'), DentistGuard)
class PatientController {
  constructor(private patientsService: PatientService) {}

  /**
   * Get patients
   */
  @Get()
  getPatients(
    @Query(ValidationPipe) filterDto: GetPatientsFilterDto,
    @GetUser() user: User,
  ): Promise<{ total: number; perPage?: number; patients: Patient[] }> {
    return this.patientsService.getPatients(filterDto, user);
  }

  /**
   * Get patient by id
   */
  @Get('/:id')
  getPatientById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<{ patient: Patient }> {
    return this.patientsService.getPatientById(id, user.id);
  }

  /**
   * Add patient
   */
  @Post()
  addPatient(
    @Body(ValidationPipe) addPatientDto: AddPatientDto,
    @GetUser() user: User,
  ): Promise<{ patient: Patient }> {
    return this.patientsService.addPatient(addPatientDto, user);
  }

  /**
   * Update patient by id
   */
  @Patch('/:id')
  updatePatientById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) body: UpdatePatientDto,
    @GetUser() user: User,
  ): Promise<{ patient: Patient }> {
    return this.patientsService.updatePatientById(id, body, user.id);
  }

  /**
   * Delete patient by id
   */
  @Delete('/:id')
  deletePatientById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.patientsService.deletePatientById(id, user.id);
  }
}

export { PatientController };
