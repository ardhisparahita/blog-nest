import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../enum/role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[A-Z]/, {
    message: 'Password must be minimum 1 Capital',
  })
  @Matches(/[0-9]/, {
    message: 'Password must be minimum 1 Number',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
