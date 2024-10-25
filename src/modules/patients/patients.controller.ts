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
import { DentistGuard } from '@core';
import { GetUser } from '@users/utils';
import { UserEntity } from '@users/user.entity';
import {
  CreatePatientDto,
  GetPatientsFilterDto,
  UpdatePatientDto,
} from './dto';
import { PatientsService } from './patients.service';
import { PatientEntity } from './patient.entity';

@Controller('patients')
@UseGuards(AuthGuard(), DentistGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  getPatients(
    @Query(ValidationPipe) filterDto: GetPatientsFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<PatientEntity[]> {
    return this.patientsService.getPatients(filterDto, user);
  }

  @Get('/:id')
  getPatientById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<PatientEntity> {
    return this.patientsService.getPatientById(id, user);
  }

  @Post()
  createPatient(
    @Body(ValidationPipe) createPatientDto: CreatePatientDto,
    @GetUser() user: UserEntity,
  ): Promise<PatientEntity> {
    return this.patientsService.createPatient(createPatientDto, user);
  }

  @Patch('/:id')
  updatePatient(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePatientDto: UpdatePatientDto,
    @GetUser() user: UserEntity,
  ): Promise<PatientEntity> {
    return this.patientsService.updatePatientById(id, updatePatientDto, user);
  }

  @Delete('/:id')
  deletePatientById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.patientsService.deletePatient(id, user);
  }
}
