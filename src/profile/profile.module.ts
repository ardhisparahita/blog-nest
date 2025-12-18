import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([User, Profile])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
