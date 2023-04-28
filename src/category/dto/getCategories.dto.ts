import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCategoriesDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsIn(['true', 'false', '0', '1'])
  @IsOptional()
  active?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page?: number;
}
