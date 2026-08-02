import { IsNotEmpty, IsString, IsNumber, IsPositive, IsInt, Min, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateListingDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  title!: string;

  @Type(() => Number) // transform pipe: string -> number
  @IsNumber()
  @IsPositive()
  price!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
