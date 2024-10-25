import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@core';
import { AuthModule } from '@auth/auth.module';
import { PatientsModule } from '@patients/patients.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    PatientsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
