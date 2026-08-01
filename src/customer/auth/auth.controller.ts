import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginDto } from './dto/login.dto';

@Controller('customers/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /customers/auth/register
  @Post('register')
  register(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: RegisterCustomerDto) {
    return this.authService.register(dto);
  }

  // POST /customers/auth/login
  @Post('login')
  login(@Body(new ValidationPipe({ whitelist: true })) dto: LoginDto) {
    return this.authService.login(dto);
  }
}
