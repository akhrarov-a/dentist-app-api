import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from '@patients/patients.module';
import { typeOrmConfig } from '@config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), PatientsModule],
})
export class AppModule {}
