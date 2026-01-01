import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindOneParamsDto {
  @ApiProperty({ description: 'Id Article' })
  @IsUUID()
  id: string;
}
