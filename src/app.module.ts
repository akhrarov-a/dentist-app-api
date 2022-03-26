import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@core';
import { AuthModule } from '@auth';
import { UserModule } from '@user';
import { PatientModule } from '@patient';

/**
 * App Module
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UserModule,
    PatientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
