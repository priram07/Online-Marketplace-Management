import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Seller } from '../entities/seller.entity';
import { Store } from '../entities/store.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seller, Store]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SELLER_JWT_SECRET || 'seller_super_secret',
      signOptions: { expiresIn: '1d' },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule], // so other seller sub-modules can reuse JwtAuthGuard
})
export class SellerAuthModule {}
