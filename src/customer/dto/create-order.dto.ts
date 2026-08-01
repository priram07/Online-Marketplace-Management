import { IsNumber, IsPositive, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @Type(() => Number) // transform incoming string/number to number
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
