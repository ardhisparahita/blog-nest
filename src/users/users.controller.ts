import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { FindOneParamsDto } from 'src/common/dto/find-one-params.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Id User' })
  @ApiBody({ type: UpdateRoleDto })
  async updateRole(
    @Param() params: FindOneParamsDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string }> {
    return this.usersService.updateRole(params.id, updateRoleDto);
  }
}
