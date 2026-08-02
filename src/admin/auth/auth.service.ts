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
import { Admin } from '../entities/admin.entity';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterAdminDto) {
    const existing = await this.adminRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Admin email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepo.create({ ...dto, password: hashedPassword });
    const saved = await this.adminRepo.save(admin);

    await this.mailService.sendAdminWelcomeEmail(saved.email, saved.fullName);

    const { password, ...safe } = saved;
    return { message: 'Admin registered successfully', admin: safe };
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (!admin)
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );

    const isMatch = await bcrypt.compare(dto.password, admin.password);
    if (!isMatch)
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    const accessToken = this.jwtService.sign(payload);
    return { message: 'Login successful', accessToken };
  }
}
