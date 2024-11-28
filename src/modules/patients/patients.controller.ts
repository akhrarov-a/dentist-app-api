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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DentistGuard } from '@core';
import { GetUser } from '@users/utils';
import { UserEntity } from '@users/user.entity';
import {
  CreatePatientDto,
  CreatePatientResponseDto,
  DeleteByIdsDto,
  FindPatientsByFirstnameOrLastnameDto,
  GetPatientsFilterDto,
  GetPatientsResponseDto,
  PatientToReturnDto,
  UpdatePatientByIdDto,
} from './dto';
import { PatientsService } from './patients.service';

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
    type: GetPatientsResponseDto,
  })
  @Get()
  getPatients(
    @Query(ValidationPipe) filterDto: GetPatientsFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<GetPatientsResponseDto> {
    return this.patientsService.getPatients(filterDto, user);
  }

  @ApiOperation({
    summary: 'Request for getting a patient by id',
    description: 'If you want to get a patient by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: PatientToReturnDto,
  })
  @Get('/:id')
  getPatientById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<PatientToReturnDto> {
    return this.patientsService.getFormattedPatientById(id, user);
  }

  @ApiOperation({
    summary: 'Request for creating a patient',
    description: 'If you want to create a patient, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully created',
    type: CreatePatientResponseDto,
  })
  @Post()
  createPatient(
    @Body(ValidationPipe) createPatientDto: CreatePatientDto,
    @GetUser() user: UserEntity,
  ): Promise<CreatePatientResponseDto> {
    return this.patientsService.createPatient(createPatientDto, user);
  }

  @ApiOperation({
    summary: 'Request for updating a patient by id',
    description: 'If you want to update a patient by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully updated',
  })
  @Patch('/:id')
  updatePatientById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePatientByIdDto: UpdatePatientByIdDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.patientsService.updatePatientById(
      id,
      updatePatientByIdDto,
      user,
    );
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
    return this.patientsService.deletePatientById(id, user);
  }

  @ApiOperation({
    summary: 'Request for deleting patients by ids',
    description: 'If you want to delete patients by ids, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully deleted',
  })
  @Delete('/by/ids')
  deletePatientsByIds(
    @Body(ValidationPipe) deleteByIdsDto: DeleteByIdsDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.patientsService.deletePatientsByIds(deleteByIdsDto, user);
  }

  @ApiOperation({
    summary: 'Request for finding patients by firstname or lastname',
    description:
      'If you want to find patients by firstname or lastname, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: [PatientToReturnDto],
  })
  @Get('/by/firstname-or-lastname')
  findPatientsByFirstnameOrLastname(
    @Query(ValidationPipe)
    findPatientsByFirstnameOrLastnameDto: FindPatientsByFirstnameOrLastnameDto,
    @GetUser() user: UserEntity,
  ): Promise<PatientToReturnDto[]> {
    return this.patientsService.findPatientsByFirstNameOrLastName(
      findPatientsByFirstnameOrLastnameDto,
      user,
    );
  }
}
