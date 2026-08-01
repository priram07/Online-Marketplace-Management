import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'customer-jwt') {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'customer_super_secret',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const customer = await this.customerRepo.findOne({ where: { id: payload.sub } });
    if (!customer || !customer.isActive) {
      throw new UnauthorizedException('Invalid token or inactive account');
    }
    const { password, ...safeCustomer } = customer;
    return safeCustomer; // attached to req.user
  }
}
