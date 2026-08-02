import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PatchStockDto } from './dto/patch-stock.dto';
import { AttachTagDto } from './dto/attach-tag.dto';
import { ParsePositiveIntPipe } from './pipes/parse-positive-int.pipe';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 1. POST /products
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateProductDto,
  ) {
    return this.productService.create(dto);
  }

  // 2. GET /products
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  // 3. GET /products/:id
  @Get(':id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  // 4. PUT /products/:id
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  // 5. PATCH /products/:id/stock
  @UseGuards(JwtAuthGuard)
  @Patch(':id/stock')
  patchStock(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: PatchStockDto,
  ) {
    return this.productService.patchStock(id, dto);
  }

  // 6. DELETE /products/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.productService.remove(id);
  }

  // 7. GET /products/category/:categoryId  (Relationship 1: Category 1->M Product)
  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId', ParsePositiveIntPipe) categoryId: number,
  ) {
    return this.productService.findByCategory(categoryId);
  }

  // ---- Relationship 2 routes: Many-to-Many Product <-> Tag (3 CRUD routes) ----

  // a. POST /products/:id/tags
  @UseGuards(JwtAuthGuard)
  @Post(':id/tags')
  attachTag(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: AttachTagDto,
  ) {
    return this.productService.attachTag(id, dto);
  }

  // b. GET /products/:id/tags
  @Get(':id/tags')
  getTags(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.productService.getTags(id);
  }

  // c. DELETE /products/:id/tags/:tagId
  @UseGuards(JwtAuthGuard)
  @Delete(':id/tags/:tagId')
  detachTag(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Param('tagId', ParsePositiveIntPipe) tagId: number,
  ) {
    return this.productService.detachTag(id, tagId);
  }
}
