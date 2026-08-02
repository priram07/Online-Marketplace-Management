import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../../entities/seller.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'seller-jwt') {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepo: Repository<Seller>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SELLER_JWT_SECRET || 'seller_super_secret',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const seller = await this.sellerRepo.findOne({ where: { id: payload.sub } });
    if (!seller || !seller.isActive) {
      throw new UnauthorizedException('Invalid token or inactive account');
    }
    const { password, ...safeSeller } = seller;
    return safeSeller; // attached to req.user
  }
}
