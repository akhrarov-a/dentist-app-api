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
  ValidationPipe,
} from '@nestjs/common';
import { GetPatientsFilterDto } from './dto/get-patients-filter.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsService } from './patients.service';
import { PatientEntity } from './patient.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  getPatients(
    @Query(ValidationPipe) filterDto: GetPatientsFilterDto,
  ): Promise<PatientEntity[]> {
    return this.patientsService.getPatients(filterDto);
  }

  @Get('/:id')
  getPatientById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PatientEntity> {
    return this.patientsService.getPatientById(id);
  }

  @Post()
  createPatient(
    @Body(ValidationPipe) createPatientDto: CreatePatientDto,
  ): Promise<PatientEntity> {
    return this.patientsService.createPatient(createPatientDto);
  }

  @Patch('/:id')
  updatePatient(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePatientDto: UpdatePatientDto,
  ): Promise<PatientEntity> {
    return this.patientsService.updatePatientById(id, updatePatientDto);
  }

  @Delete('/:id')
  deletePatientById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.patientsService.deletePatient(id);
  }
}
