import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ProfileService } from './profile.service';
import { CreateOrUpdateProfileDto } from './dto/createOrUpdate-profile.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/auth/entities/user.entity';
import type { UserPayload } from 'src/auth/interface/authenticated-request.interface';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async upsert(
    @User() user: UserPayload,
    @Body() dto: CreateOrUpdateProfileDto,
  ): Promise<{ message: string }> {
    return this.profileService.upsertProfile(user.id, dto);
  }

  @Get()
  async getProfile(@User() user: UserPayload): Promise<UserEntity> {
    return this.profileService.getProfileOrThrow(user.id);
  }
}
