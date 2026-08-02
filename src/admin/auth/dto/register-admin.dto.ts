import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterAdminDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (value as string)?.trim())
  fullName!: string;

  @IsEmail()
  @Transform(({ value }) => (value as string)?.toLowerCase().trim())
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
