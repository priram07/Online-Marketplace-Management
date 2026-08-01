import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ParsePositiveIntPipe } from './pipes/parse-positive-int.pipe';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ---- Relationship 2 routes: One-to-Many Customer -> Orders (3 CRUD routes) ----

  // 1. POST /customers/:id/orders  -> create an order for a customer
  @UseGuards(JwtAuthGuard)
  @Post('customers/:id/orders')
  createForCustomer(@Param('id', ParsePositiveIntPipe) id: number, @Body() dto: CreateOrderDto) {
    return this.orderService.createForCustomer(id, dto);
  }

  // 2. GET /customers/:id/orders  -> list a customer's orders
  @UseGuards(JwtAuthGuard)
  @Get('customers/:id/orders')
  findAllForCustomer(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.orderService.findAllForCustomer(id);
  }

  // 3. PATCH /orders/:id/status  -> update order status
  @UseGuards(JwtAuthGuard)
  @Patch('orders/:id/status')
  updateStatus(@Param('id', ParsePositiveIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }

  // extra standard endpoints
  @Get('orders')
  findAll() {
    return this.orderService.findAll();
  }

  @Get('orders/:id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('orders/:id')
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
