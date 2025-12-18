import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  age: number;

  @Column({
    type: 'text',
  })
  bio: string;

  @Column({
    type: 'varchar',
    length: 36,
  })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
