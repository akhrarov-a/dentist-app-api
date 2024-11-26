import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceEntity } from './service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity]), AuthModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
