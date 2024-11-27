import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { PatientsModule } from '@patients/patients.module';
import { ServicesModule } from '@services/services.module';
import { AppointmentServiceEntity } from '@appointments/appointment-service.entity';
import { AppointmentEntity } from './appointment.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentEntity, AppointmentServiceEntity]),
    AuthModule,
    PatientsModule,
    ServicesModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
