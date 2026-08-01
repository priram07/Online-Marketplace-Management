import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerProfile } from './entities/customer-profile.entity';
import { Order } from './entities/order.entity';
import { Coupon } from './entities/coupon.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CustomerAuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerProfile, Order, Coupon]),
    CustomerAuthModule, // dedicated auth sub-module (register/login/JWT strategy/guard)
    MailModule,
  ],
  controllers: [CustomerController, OrderController, CouponController],
  providers: [CustomerService, OrderService, CouponService],
  exports: [CustomerService],
})
export class CustomerModule {}
