import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase().trim())
  code: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercent: number;
}
