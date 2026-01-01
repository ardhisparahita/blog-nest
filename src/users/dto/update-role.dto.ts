import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/auth/enum/role.enum';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(Role)
  @ApiProperty({ enum: Role })
  role: Role;
}
