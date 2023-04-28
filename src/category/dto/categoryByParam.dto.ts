import { Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryByParamDto {
  @ApiProperty({
    type: String,
    description: 'slug or id',
    example: '256/raw-materials',
  })
  @Matches(/^(?:[0-9]+|[a-zA-Z\-_]+)$/g)
  param: string;
}
