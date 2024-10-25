import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@config';
import { AuthModule } from '@auth/auth.module';
import { PatientsModule } from '@patients/patients.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    PatientsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
