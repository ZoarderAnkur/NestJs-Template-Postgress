import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ApproveUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  EMAIL: string;

  @IsString()
  @IsNotEmpty()
  ROLE?: string;
}
