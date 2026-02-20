import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateOrUpdateProfileDto } from './dto/createOrUpdate-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async upsertProfile(
    userId: string,
    dto: CreateOrUpdateProfileDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.profile) {
      Object.assign(user.profile, dto);
      await this.profileRepository.save(user.profile);
      return { message: 'update profile success' };
    } else {
      const profile = this.profileRepository.create(dto);
      profile.user = user;
      await this.profileRepository.save(profile);
      return { message: 'create profile success' };
    }
  }

  async getProfileOrThrow(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
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

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
