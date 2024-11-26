import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '@core';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@users/user.entity';

@Entity('services')
export class ServiceEntity extends BaseEntity {
  @ApiProperty({ description: 'The id of the service' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the service' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The status of the service',
    required: false,
    enum: [Status.ACTIVE, Status.DISABLED],
  })
  @Column()
  status: Status;

  @ApiProperty({ description: 'Created date and time of the service' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date and time of the service' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.services, { eager: false })
  user: UserEntity;

  @ApiProperty({ description: 'The owner of the service' })
  @Column()
  userId: number;
}
