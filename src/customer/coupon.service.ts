import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { Customer } from './entities/customer.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async create(dto: CreateCouponDto) {
    const existing = await this.couponRepo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Coupon code already exists');
    const coupon = this.couponRepo.create(dto);
    return this.couponRepo.save(coupon);
  }

  // ---- Relationship 3 routes: Many-to-Many (Customer <-> Coupon) ----

  // a. Redeem/attach a coupon to a customer
  async redeem(customerId: number, couponId: number) {
    const customer = await this.customerRepo.findOne({
      where: { id: customerId },
      relations: { coupons: true },
    });
    if (!customer) throw new NotFoundException(`Customer #${customerId} not found`);

    const coupon = await this.couponRepo.findOne({ where: { id: couponId } });
    if (!coupon) throw new NotFoundException(`Coupon #${couponId} not found`);
    if (!coupon.isActive) throw new BadRequestException('Coupon is no longer active');

    const alreadyRedeemed = customer.coupons?.some((c) => c.id === coupon.id);
    if (alreadyRedeemed) throw new ConflictException('Coupon already redeemed by this customer');

    customer.coupons = [...(customer.coupons || []), coupon];
    await this.customerRepo.save(customer);
    return { message: `Coupon ${coupon.code} redeemed successfully`, coupon };
  }

  // b. List a customer's redeemed coupons
  async findAllForCustomer(customerId: number) {
    const customer = await this.customerRepo.findOne({
      where: { id: customerId },
      relations: { coupons: true },
    });
    if (!customer) throw new NotFoundException(`Customer #${customerId} not found`);
    return customer.coupons;
  }

  // c. Revoke a coupon from a customer
  async revoke(customerId: number, couponId: number) {
    const customer = await this.customerRepo.findOne({
      where: { id: customerId },
      relations: { coupons: true },
    });
    if (!customer) throw new NotFoundException(`Customer #${customerId} not found`);

    customer.coupons = (customer.coupons || []).filter((c) => c.id !== couponId);
    await this.customerRepo.save(customer);
    return { message: `Coupon #${couponId} revoked from customer #${customerId}` };
  }
}