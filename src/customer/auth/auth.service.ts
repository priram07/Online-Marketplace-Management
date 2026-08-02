import {
  Injectable,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Customer } from '../entities/customer.entity';

import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterCustomerDto) {
    const existing = await this.customerRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const customer = this.customerRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
    });
    const saved = await this.customerRepo.save(customer);

   

    await this.mailService.sendWelcomeEmail(saved.email, saved.fullName);

    const { password, ...safe } = saved;
    return { message: 'Registration successful', customer: safe };
  }

  async login(dto: LoginDto) {
    const customer = await this.customerRepo.findOne({ where: { email: dto.email } });
    if (!customer) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(dto.password, customer.password);
    if (!isMatch) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: customer.id, email: customer.email, role: customer.role };
    const accessToken = this.jwtService.sign(payload);

    return { message: 'Login successful', accessToken };
  }
}
