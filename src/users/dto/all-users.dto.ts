import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class AllUsersDto {
  @IsString()
  @IsOptional()
  SORT_VALUE?: string;

  @IsNumber()
  @IsOptional()
  SORT_BY?: string;

  @IsOptional()
  @IsString()
  filter?: string;

  @IsBoolean()
  @IsOptional()
  STATUS?: boolean;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ROLE?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  LOCATION?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  USERS?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  CREATED_BY?: string[];
}
