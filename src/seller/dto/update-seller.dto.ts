import { OmitType } from '@nestjs/mapped-types';
import { RegisterSellerDto } from '../auth/dto/register-seller.dto';

// PUT - full replace of editable fields (password excluded here, handled separately)
export class UpdateSellerDto extends OmitType(RegisterSellerDto, ['password'] as const) {}
