import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admins/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /admins/auth/register
  @Post('register')
  register(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: RegisterAdminDto) {
    return this.authService.register(dto);
  }

  // POST /admins/auth/login
  @Post('login')
  login(@Body(new ValidationPipe({ whitelist: true })) dto: LoginAdminDto) {
    return this.authService.login(dto);
  }
}
