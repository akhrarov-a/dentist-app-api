import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Patient } from '@patient';
import { UserRole } from './types';

/**
 * User
 */
@Entity()
@Unique(['username', 'phone_number', 'email'])
class User extends BaseEntity {
  /**
   * Id
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Username
   */
  @Column()
  username: string;

  /**
   * Password
   */
  @Column()
  password: string;

  /**
   * Firstname
   */
  @Column()
  firstname: string;

  /**
   * Lastname
   */
  @Column()
  lastname: string;

  /**
   * Phone number
   */
  @Column()
  phone_number: string;

  /**
   * Salt
   */
  @Column()
  salt: string;

  /**
   * Email
   */
  @Column({ nullable: true })
  email: string;

  /**
   * Role
   */
  @Column()
  role: UserRole;

  /**
   * Patients
   */
  @OneToMany(() => Patient, (patient) => patient.user, { eager: true })
  patients: Patient[];

  /**
   * Validate password
   */
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}

export { User };
