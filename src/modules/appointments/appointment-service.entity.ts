import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@users/user.entity';
import { ServiceEntity } from '@services/service.entity';
import { AppointmentEntity } from './appointment.entity';

@Entity('appointment_services')
export class AppointmentServiceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.appointment_services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => AppointmentEntity,
    (appointment) => appointment.appointmentServices,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'appointment_id' })
  appointment: AppointmentEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.appointmentServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @Column({ type: 'text', nullable: true })
  description: string;
}
