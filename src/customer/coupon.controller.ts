import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ParsePositiveIntPipe } from './pipes/parse-positive-int.pipe';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // Create a coupon that customers can later redeem
  @UseGuards(JwtAuthGuard)
  @Post('coupons')
  create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

  // ---- Relationship 3 routes: Many-to-Many Customer <-> Coupon (3 CRUD routes) ----

  // a. POST /customers/:id/coupons/:couponId  -> redeem/attach
  @UseGuards(JwtAuthGuard)
  @Post('customers/:id/coupons/:couponId')
  redeem(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Param('couponId', ParsePositiveIntPipe) couponId: number,
  ) {
    return this.couponService.redeem(id, couponId);
  }

  // b. GET /customers/:id/coupons  -> list redeemed coupons
  @UseGuards(JwtAuthGuard)
  @Get('customers/:id/coupons')
  findAllForCustomer(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.couponService.findAllForCustomer(id);
  }

  // c. DELETE /customers/:id/coupons/:couponId -> revoke
  @UseGuards(JwtAuthGuard)
  @Delete('customers/:id/coupons/:couponId')
  revoke(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Param('couponId', ParsePositiveIntPipe) couponId: number,
  ) {
    return this.couponService.revoke(id, couponId);
  }
}
