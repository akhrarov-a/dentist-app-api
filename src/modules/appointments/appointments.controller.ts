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
import { GetUser } from '@users/utils';
import { UserEntity } from '@users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { DentistGuard } from '@core';
import {
  AppointmentToReturnDto,
  CreateAppointmentDto,
  CreateAppointmentResponseDto,
  GetAppointmentsByDateDto,
  GetAppointmentsByDateResponseDto,
  GetAppointmentsDto,
  GetAppointmentsResponseDto,
  UpdateAppointmentDto,
} from './dto';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
@ApiTags('Appointments')
@UseGuards(AuthGuard(), DentistGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({
    summary: 'Request for getting appointments by patient id or service id',
    description:
      'If you want to get appointments by patient id or service id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: GetAppointmentsResponseDto,
  })
  @Get()
  getAppointmentsByPatient(
    @Query(ValidationPipe)
    getAppointmentsByPatientDto: GetAppointmentsDto,
    @GetUser() user: UserEntity,
  ): Promise<GetAppointmentsResponseDto> {
    return this.appointmentsService.getAppointments(
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
  @Get('/by/date')
  getAppointmentsByDate(
    @Query(ValidationPipe) getAppointmentsByDateDto: GetAppointmentsByDateDto,
    @GetUser() user: UserEntity,
  ): Promise<GetAppointmentsByDateResponseDto> {
    return this.appointmentsService.getAppointmentsByDate(
      getAppointmentsByDateDto,
      user,
    );
  }

  @ApiOperation({
    summary: 'Request for getting an appointment by id',
    description: 'If you want to get an appointment by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: AppointmentToReturnDto,
  })
  @Get('/:id')
  getAppointmentById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<AppointmentToReturnDto> {
    return this.appointmentsService.getFormattedAppointmentById(id, user);
  }

  @ApiOperation({
    summary: 'Request for creating an appointment',
    description: 'If you want to create an appointment, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully created',
    type: CreateAppointmentResponseDto,
  })
  @Post()
  createAppointment(
    @Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: UserEntity,
  ): Promise<CreateAppointmentResponseDto> {
    return this.appointmentsService.createAppointment(
      createAppointmentDto,
      user,
    );
  }

  @ApiOperation({
    summary: 'Request for updating an appointment by id',
    description: 'If you want to update an appointment by id, use this request',
  })
  @ApiOkResponse({ description: 'Successfully updated' })
  @Patch('/:id')
  updateAppointmentById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateAppointmentDto: UpdateAppointmentDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
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
