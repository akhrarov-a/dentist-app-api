import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@core';
import { UserEntity } from '@users/user.entity';
import { AppointmentServiceEntity } from '@appointments/appointment-service.entity';

@Entity('services')
export class ServiceEntity extends BaseEntity {
  @ApiProperty({ description: 'The id of the service' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the service' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @ApiProperty({ description: 'Created date and time of the service' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Updated date and time of the service' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(
    () => AppointmentServiceEntity,
    (appointmentService) => appointmentService.service,
    { onDelete: 'CASCADE' },
  )
  appointmentServices: AppointmentServiceEntity[];
}
