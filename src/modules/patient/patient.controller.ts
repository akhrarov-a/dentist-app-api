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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Patient Controller
 */
@ApiTags('parents')
@Controller('patients')
@UseGuards(AuthGuard('jwt'), DentistGuard)
class PatientController {
  constructor(private patientsService: PatientService) {}

  /**
   * Get patients
   */
  @ApiOperation({
    summary: 'Request for getting patients with pagination and search',
    description:
      'If you want to get patients with pagination and search, use this route',
  })
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
  @ApiOperation({
    summary: 'Request for getting patient by id',
    description: 'If you want to get patient by id, use this route',
  })
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
  @ApiOperation({
    summary: 'Request for adding patient',
    description: 'If you want to add patient, use this route',
  })
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
  @ApiOperation({
    summary: 'Request for updating patient info by id',
    description: 'If you want to update patient info by id, use this route',
  })
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
  @ApiOperation({
    summary: 'Request for deleting patient by id',
    description: 'If you want to delete patient by id, use this route',
  })
  @Delete('/:id')
  deletePatientById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.patientsService.deletePatientById(id, user.id);
  }
}

export { PatientController };
