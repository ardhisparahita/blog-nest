import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('profiles')
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
    type: 'uuid',
  })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
