import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'input username or email',
    example: 'user@gmail.com or user',
  })
  usernameOrEmail: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;
}
