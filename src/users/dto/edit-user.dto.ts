import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsNotEmpty()
  EMAIL: string;

  @IsString()
  @IsOptional()
  NAME?: string;

  @IsString()
  @IsOptional()
  PHONE_NUMBER?: string;

  @IsString()
  @IsOptional()
  LOCATION?: string;

  @IsString()
  @IsOptional()
  ROLE?: string;
}
