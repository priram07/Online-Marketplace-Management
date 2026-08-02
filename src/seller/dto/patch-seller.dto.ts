import { IsOptional, IsBoolean, IsString } from 'class-validator';

// PATCH - partial update, e.g. activate/deactivate account
export class PatchSellerDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  businessName?: string;
}
