import { PartialType, OmitType } from '@nestjs/mapped-types';
import { RegisterCustomerDto } from '../auth/dto/register-customer.dto';

// PUT - full replace of editable fields (password excluded here, handled separately)
export class UpdateCustomerDto extends OmitType(RegisterCustomerDto, ['password'] as const) {}