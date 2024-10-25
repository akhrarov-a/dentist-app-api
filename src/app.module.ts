import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@config/typeorm.config';
import { PatientsModule } from '@patients/patients.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), PatientsModule, UsersModule],
})
export class AppModule {}
