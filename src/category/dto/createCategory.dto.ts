import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @Matches(/^[A-Za-z_\-]+$/g)
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty()
  @Matches(/^(?:[а-яА-ЯЁё\s.!?,_'\-]+|[a-zA-Z\s.!?,_'\-]+)$/g)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @Matches(/^(?:[а-яА-ЯЁё\s.!?,_'\-]+|[a-zA-Z\s.!?,_'\-]+)$/g)
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
