import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
// import { Patient } from '../patients/patient.entity';
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
   * First name
   */
  @Column()
  first_name: string;

  /**
   * Last name
   */
  @Column()
  last_name: string;

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
  // @OneToMany((type) => Patient, (patient) => patient.user, { eager: true })
  // patients: Patient[];

  /**
   * Validate password
   */
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}

export { User };
