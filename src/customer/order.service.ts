import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Customer } from './entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { MailService } from './mail/mail.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly mailService: MailService,
  ) {}

  // ---------- Relationship 2: One-to-Many (Customer -> Orders) ----------
  async createForCustomer(customerId: number, dto: CreateOrderDto) {
    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException(`Customer #${customerId} not found`);

    const order = this.orderRepo.create({ ...dto, customer, customerId: customer.id });
    const saved = await this.orderRepo.save(order);

    await this.mailService.sendOrderConfirmation(customer.email, saved.id, saved.totalAmount);
    return saved;
  }

  async findAllForCustomer(customerId: number) {
    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException(`Customer #${customerId} not found`);
    return this.orderRepo.find({ where: { customerId }, order: { createdAt: 'DESC' } });
  }

  // ---------- extra CRUD on Order ----------
  findAll() {
    return this.orderRepo.find({ relations: { customer: true } });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({ where: { id }, relations: { customer: true } });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    order.status = dto.status;
    return this.orderRepo.save(order);
  }

  async remove(id: number) {
    const result = await this.orderRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Order #${id} not found`);
    return { message: `Order #${id} deleted successfully` };
  }
}