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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('patients')
@ApiTags('Patients')
@UseGuards(AuthGuard(), DentistGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiOperation({
    summary: 'Request for getting patients',
    description: 'If you want to get patients, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: [PatientEntity],
  })
  @Get()
  getPatients(
    @Query(ValidationPipe) filterDto: GetPatientsFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<PatientEntity[]> {
    return this.patientsService.getPatients(filterDto, user);
  }

  @ApiOperation({
    summary: 'Request for getting a patient by id',
    description: 'If you want to get a patient by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: PatientEntity,
  })
  @Get('/:id')
  getPatientById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<PatientEntity> {
    return this.patientsService.getPatientById(id, user);
  }

  @ApiOperation({
    summary: 'Request for creating a patient',
    description: 'If you want to create a patient, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully created',
    type: PatientEntity,
  })
  @Post()
  createPatient(
    @Body(ValidationPipe) createPatientDto: CreatePatientDto,
    @GetUser() user: UserEntity,
  ): Promise<PatientEntity> {
    return this.patientsService.createPatient(createPatientDto, user);
  }

  @ApiOperation({
    summary: 'Request for updating a patient by id',
    description: 'If you want to update a patient by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully updated',
    type: PatientEntity,
  })
  @Patch('/:id')
  updatePatient(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePatientDto: UpdatePatientDto,
    @GetUser() user: UserEntity,
  ): Promise<PatientEntity> {
    return this.patientsService.updatePatientById(id, updatePatientDto, user);
  }

  @ApiOperation({
    summary: 'Request for deleting a patient by id',
    description: 'If you want to delete a patient by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully deleted',
  })
  @Delete('/:id')
  deletePatientById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.patientsService.deletePatient(id, user);
  }
}
