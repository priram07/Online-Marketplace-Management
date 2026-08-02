import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PatchSellerDto } from './dto/patch-seller.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { ParsePositiveIntPipe } from './pipes/parse-positive-int.pipe';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  // 1. GET /sellers  (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  // 2. GET /sellers/me  (protected - own profile)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.sellerService.findOne(req.user.id);
  }

  // 3. GET /sellers/:id
  @Get(':id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.sellerService.findOne(id);
  }

  // 4. PUT /sellers/:id  (protected - full update)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParsePositiveIntPipe) id: number, @Body() dto: UpdateSellerDto) {
    return this.sellerService.update(id, dto);
  }

  // 5. PATCH /sellers/:id  (protected - partial update)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patch(@Param('id', ParsePositiveIntPipe) id: number, @Body() dto: PatchSellerDto) {
    return this.sellerService.patch(id, dto);
  }

  // 6. DELETE /sellers/:id (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.sellerService.remove(id);
  }

  // ---- Relationship 1 routes: One-to-One Seller <-> Store ----

  // 7. POST /sellers/:id/store
  @UseGuards(JwtAuthGuard)
  @Post(':id/store')
  createStore(@Param('id', ParsePositiveIntPipe) id: number, @Body() dto: CreateStoreDto) {
    return this.sellerService.createStore(id, dto);
  }

  // 8. GET /sellers/:id/store
  @Get(':id/store')
  getStore(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.sellerService.getStore(id);
  }
}
