import { IsEmail, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  EMAIL: string;
}
