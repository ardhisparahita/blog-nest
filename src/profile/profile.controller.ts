import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ProfileService } from './profile.service';
import { CreateOrUpdateProfileDto } from './dto/createOrUpdate-profile.dto';
import { UserId } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  async updateOrCreate(
    @UserId() userId: string,
    @Body() createOrUpdateProfileDto: CreateOrUpdateProfileDto,
  ): Promise<{ message: string }> {
    return await this.profileService.updateOrCreate(
      userId,
      createOrUpdateProfileDto,
    );
  }

  @Get()
  async findOne(@UserId() userId: string): Promise<User | null> {
    return this.profileService.findOne(userId);
  }
}
