import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const user = await this.userRepository.find({
      relations: ['profile'],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: {
          age: true,
          bio: true,
        },
      },
    });
    return user;
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async update(
    user: User,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string }> {
    Object.assign(user, updateRoleDto);
    await this.userRepository.save(user);

    return {
      message: 'update success',
    };
  }
}
