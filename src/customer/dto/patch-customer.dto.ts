import { IsOptional, IsBoolean, IsString } from 'class-validator';

// PATCH - partial update, e.g. activate/deactivate account
export class PatchCustomerDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  fullName?: string;
}
