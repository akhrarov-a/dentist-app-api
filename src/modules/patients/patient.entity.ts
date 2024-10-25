import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@users/user.entity';

@Entity('patients')
export class PatientEntity extends BaseEntity {
  @ApiProperty({ description: 'The id of the patient' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The firstname of the patient' })
  @Column()
  firstname: string;

  @ApiProperty({ description: 'The lastname of the patient' })
  @Column()
  lastname: string;

  @ApiProperty({ description: 'The phone of the patient' })
  @Column()
  phone: string;

  @ApiProperty({ description: 'The email of the patient' })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({
    description: 'The description of the patient',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.patients, { eager: false })
  user: UserEntity;

  @ApiProperty({ description: 'The owner of the patient' })
  @Column()
  userId: number;
}
