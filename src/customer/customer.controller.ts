import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { ParsePositiveIntPipe } from './pipes/parse-positive-int.pipe';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // 1. GET /customers  (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  // 2. GET /customers/me  (protected - own profile)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.customerService.findOne(req.user.id);
  }

  // 3. GET /customers/:id
  @Get(':id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.customerService.findOne(id);
  }

  // 4. PUT /customers/:id  (protected - full update)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParsePositiveIntPipe) id: number, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  // 5. PATCH /customers/:id  (protected - partial update)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patch(@Param('id', ParsePositiveIntPipe) id: number, @Body() dto: PatchCustomerDto) {
    return this.customerService.patch(id, dto);
  }

  // 6. DELETE /customers/:id (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.customerService.remove(id);
  }

  
}
