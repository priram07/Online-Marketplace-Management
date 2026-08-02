import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  storeName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}
