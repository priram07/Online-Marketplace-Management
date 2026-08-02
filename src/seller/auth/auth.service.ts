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
import { Seller } from '../entities/seller.entity';
import { Store } from '../entities/store.entity';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepo: Repository<Seller>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterSellerDto) {
    const existing = await this.sellerRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const seller = this.sellerRepo.create({
      businessName: dto.businessName,
      email: dto.email,
      password: hashedPassword,
    });
    const saved = await this.sellerRepo.save(seller);

    // create related One-to-One store if extra fields were given
    if (dto.storeName) {
      const store = this.storeRepo.create({
        storeName: dto.storeName,
        description: dto.description,
        seller: saved,
      });
      await this.storeRepo.save(store);
    }

    await this.mailService.sendWelcomeEmail(saved.email, saved.businessName);

    const { password, ...safe } = saved;
    return { message: 'Registration successful', seller: safe };
  }

  async login(dto: LoginDto) {
    const seller = await this.sellerRepo.findOne({ where: { email: dto.email } });
    if (!seller) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(dto.password, seller.password);
    if (!isMatch) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: seller.id, email: seller.email, role: seller.role };
    const accessToken = this.jwtService.sign(payload);

    return { message: 'Login successful', accessToken };
  }
}
