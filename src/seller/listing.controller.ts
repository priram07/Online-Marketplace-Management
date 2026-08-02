import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { PatchListingStockDto } from './dto/patch-listing-stock.dto';
import { ParsePositiveIntPipe } from './pipes/parse-positive-int.pipe';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  // ---- Relationship 2 routes: One-to-Many Seller -> Listings (3 CRUD routes) ----

  // 1. POST /sellers/:id/listings  -> create a listing for a seller
  @UseGuards(JwtAuthGuard)
  @Post('sellers/:id/listings')
  createForSeller(@Param('id', ParsePositiveIntPipe) id: number, @Body() dto: CreateListingDto) {
    return this.listingService.createForSeller(id, dto);
  }

  // 2. GET /sellers/:id/listings  -> list a seller's listings
  @UseGuards(JwtAuthGuard)
  @Get('sellers/:id/listings')
  findAllForSeller(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.listingService.findAllForSeller(id);
  }

  // 3. PATCH /listings/:id/stock  -> update listing stock
  @UseGuards(JwtAuthGuard)
  @Patch('listings/:id/stock')
  updateStock(@Param('id', ParsePositiveIntPipe) id: number, @Body() dto: PatchListingStockDto) {
    return this.listingService.updateStock(id, dto);
  }

  // extra standard endpoints
  @Get('listings')
  findAll() {
    return this.listingService.findAll();
  }

  @Get('listings/:id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.listingService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('listings/:id')
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.listingService.remove(id);
  }
}
