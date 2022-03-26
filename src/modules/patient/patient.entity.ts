import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@user';

/**
 * Patient
 */
@Entity()
class Patient extends BaseEntity {
  /**
   * Id
   */
  @PrimaryGeneratedColumn()
  id: number;

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
   * Email
   */
  @Column({ nullable: true })
  email: string;

  /**
   * Description
   */
  @Column()
  description: string;

  /**
   * User
   */
  @ManyToOne(() => User, (user) => user.patients, { eager: false })
  user: User;

  /**
   * User id
   */
  @Column()
  user_id: number;
}

export { Patient };
