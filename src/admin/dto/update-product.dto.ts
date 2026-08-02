import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// PUT - full replace
export class UpdateProductDto extends PartialType(CreateProductDto) {}
