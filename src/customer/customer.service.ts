import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerProfile } from './entities/customer-profile.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(CustomerProfile)
    private readonly profileRepo: Repository<CustomerProfile>,
  ) {}

  // ---------- CRUD ----------
  findAll() {
    return this.customerRepo.find({ relations: { profile: true } });
  }

  async findOne(id: number) {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: { profile: true, orders: true, coupons: true },
    });
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    const { password, ...safe } = customer;
    return safe;
  }

  async update(id: number, dto: UpdateCustomerDto) {
    const customer = await this.customerRepo.preload({ id, ...dto });
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    const saved = await this.customerRepo.save(customer);
    const { password, ...safe } = saved;
    return safe;
  }

  async patch(id: number, dto: PatchCustomerDto) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    Object.assign(customer, dto);
    const saved = await this.customerRepo.save(customer);
    const { password, ...safe } = saved;
    return safe;
  }

  async remove(id: number) {
    const result = await this.customerRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return { message: `Customer #${id} deleted successfully` };
  }

  // ---------- Relationship 1: One-to-One (Customer <-> CustomerProfile) ----------
  async createProfile(customerId: number, dto: CreateProfileDto) {
    const customer = await this.customerRepo.findOne({
      where: { id: customerId },
      relations: { profile: true },
    });
    if (!customer) throw new NotFoundException(`Customer #${customerId} not found`);
    if (customer.profile) {
      throw new ConflictException('Profile already exists for this customer');
    }
    const profile = this.profileRepo.create({ ...dto, customer });
    return this.profileRepo.save(profile);
  }

  async getProfile(customerId: number) {
    const customer = await this.customerRepo.findOne({
      where: { id: customerId },
      relations: { profile: true },
    });
    if (!customer || !customer.profile) {
      throw new NotFoundException(`Profile not found for customer #${customerId}`);
    }
    return customer.profile;
  }
}
