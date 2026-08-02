import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginAdminDto {
  @IsEmail()
  @Transform(({ value }) => (value as string)?.toLowerCase().trim())
  email!: string;

  @IsNotEmpty()
  password!: string;
}
