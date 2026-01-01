import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrUpdateProfileDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  age: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  bio: string;
}
