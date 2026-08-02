import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { LoginDto } from './dto/login.dto';

@Controller('sellers/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /sellers/auth/register
  @Post('register')
  register(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: RegisterSellerDto) {
    return this.authService.register(dto);
  }

  // POST /sellers/auth/login
  @Post('login')
  login(@Body(new ValidationPipe({ whitelist: true })) dto: LoginDto) {
    return this.authService.login(dto);
  }
}
