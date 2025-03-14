import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@core';
import { AuthModule } from '@auth/auth.module';
import { PatientsModule } from '@patients/patients.module';
import { UsersModule } from '@users/users.module';
import { AppointmentsModule } from '@appointments/appointments.module';
import { ServicesModule } from '@services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    PatientsModule,
    UsersModule,
    AuthModule,
    AppointmentsModule,
    ServicesModule,
  ],
})
export class AppModule {}
