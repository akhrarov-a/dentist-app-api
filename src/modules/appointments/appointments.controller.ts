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
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@users/utils';
import { UserEntity } from '@users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { DentistGuard } from '@core';
import {
  AppointmentResponseWithPatientDto,
  CreateAppointmentDto,
  GetAppointmentsByDateResponseDto,
  GetAppointmentsByPatientDto,
  GetAppointmentsByPatientResponseDto,
  UpdateAppointmentDto,
} from './dto';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
@ApiTags('Appointments')
@UseGuards(AuthGuard(), DentistGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({
    summary: 'Request for getting appointments by patient id',
    description:
      'If you want to get appointments by patient id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: GetAppointmentsByPatientResponseDto,
  })
  @ApiQuery({
    name: 'patient',
    required: true,
  })
  @Get('/by/patient')
  getAppointmentsByPatient(
    @Query(ValidationPipe)
    getAppointmentsByPatientDto: GetAppointmentsByPatientDto,
    @GetUser() user: UserEntity,
  ): Promise<GetAppointmentsByPatientResponseDto> {
    return this.appointmentsService.getAppointmentsByPatient(
      getAppointmentsByPatientDto,
      user,
    );
  }

  @ApiOperation({
    summary: 'Request for getting appointments by date',
    description: 'If you want to get appointments by date, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: GetAppointmentsByDateResponseDto,
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description:
      'Date for which to retrieve appointments in "YYYY-MM-DD" format.',
  })
  @Get('/by/date')
  getAppointmentsByDate(
    @Query('date') date: string,
    @GetUser() user: UserEntity,
  ): Promise<GetAppointmentsByDateResponseDto> {
    return this.appointmentsService.getAppointmentsByDate(date, user);
  }

  @ApiOperation({
    summary: 'Request for getting an appointment by id',
    description: 'If you want to get an appointment by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: AppointmentResponseWithPatientDto,
  })
  @Get('/:id')
  getAppointmentById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<AppointmentResponseWithPatientDto> {
    return this.appointmentsService.getAppointmentById(id, user);
  }

  @ApiOperation({
    summary: 'Request for creating an appointment',
    description: 'If you want to create an appointment, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully created',
    type: AppointmentResponseWithPatientDto,
  })
  @Post()
  createAppointment(
    @Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: UserEntity,
  ): Promise<AppointmentResponseWithPatientDto> {
    return this.appointmentsService.createAppointment(
      createAppointmentDto,
      user,
    );
  }

  @ApiOperation({
    summary: 'Request for updating an appointment by id',
    description: 'If you want to update an appointment by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully updated',
    type: AppointmentResponseWithPatientDto,
  })
  @Patch('/:id')
  updateAppointmentById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateAppointmentDto: UpdateAppointmentDto,
    @GetUser() user: UserEntity,
  ): Promise<AppointmentResponseWithPatientDto> {
    return this.appointmentsService.updateAppointmentById(
      id,
      updateAppointmentDto,
      user,
    );
  }

  @ApiOperation({
    summary: 'Request for deleting an appointment by id',
    description: 'If you want to delete an appointment by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully deleted',
  })
  @Delete('/:id')
  deleteAppointmentById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.appointmentsService.deleteAppointmentById(id, user);
  }
}
