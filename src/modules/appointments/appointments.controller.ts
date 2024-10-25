import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@users/utils';
import { UserEntity } from '@users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { DentistGuard } from '@core';
import {
  AppointmentResponseWithPatientDto,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
@ApiTags('Appointments')
@UseGuards(AuthGuard(), DentistGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

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
}
