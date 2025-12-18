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
    private profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateOrCreate(
    userid: string,
    createOrUpdateProfileDto: CreateOrUpdateProfileDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userid },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.profile) {
      Object.assign(user.profile, createOrUpdateProfileDto);
      await this.profileRepository.save(user.profile);
      return {
        message: 'update profile success',
      };
    } else {
      const newProfile = this.profileRepository.create(
        createOrUpdateProfileDto,
      );
      newProfile.user = user;

      await this.profileRepository.save(newProfile);
      return {
        message: 'create profile success',
      };
    }
  }
  async findOne(id: string): Promise<User | null> {
    const userProfile = await this.userRepository.findOne({
      where: { id },
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
    return userProfile;
  }
}
