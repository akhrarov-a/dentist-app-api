import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@users/utils';
import { UserEntity } from '@users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateAppointmentDto } from './dto';
import { AppointmentsService } from './appointments.service';
import { AppointmentEntity } from './appointment.entity';

@Controller('appointments')
@ApiTags('Appointments')
@UseGuards(AuthGuard())
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({
    summary: 'Request for creating an appointment',
    description: 'If you want to create an appointment, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully created',
    type: AppointmentEntity,
  })
  @Post()
  createAppointment(
    @Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: UserEntity,
  ): Promise<AppointmentEntity> {
    return this.appointmentsService.createAppointment(
      createAppointmentDto,
      user,
    );
  }
}
