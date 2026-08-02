import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

// PATCH - partial update (only stock quantity)
export class PatchListingStockDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;
}
