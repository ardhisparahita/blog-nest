import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrUpdateProfileDto {
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  bio: string;
}
