import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @Matches(/^[A-Za-z_\-]+$/g)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @Matches(/^(?:[A-Za-z\s?!,\-.']|[а-яА-Я\s?!,\-.'Ёё])+$/g)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @Matches(/^(?:[A-Za-z\s?!,\-.']|[а-яА-Я\s?!,\-.'Ёё])+$/g)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
