import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';
import { Seller } from './entities/seller.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { PatchListingStockDto } from './dto/patch-listing-stock.dto';
import { MailService } from './mail/mail.service';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
    @InjectRepository(Seller)
    private readonly sellerRepo: Repository<Seller>,
    private readonly mailService: MailService,
  ) {}

  // ---------- Relationship 2: One-to-Many (Seller -> Listings) ----------
  async createForSeller(sellerId: number, dto: CreateListingDto) {
    const seller = await this.sellerRepo.findOne({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException(`Seller #${sellerId} not found`);

    const listing = this.listingRepo.create({ ...dto, seller, sellerId: seller.id });
    const saved = await this.listingRepo.save(listing);

    await this.mailService.sendListingPublishedEmail(seller.email, saved.title, saved.price);
    return saved;
  }

  async findAllForSeller(sellerId: number) {
    const seller = await this.sellerRepo.findOne({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException(`Seller #${sellerId} not found`);
    return this.listingRepo.find({ where: { sellerId }, order: { createdAt: 'DESC' } });
  }

  // ---------- extra CRUD on Listing ----------
  findAll() {
    return this.listingRepo.find({ relations: { seller: true } });
  }

  async findOne(id: number) {
    const listing = await this.listingRepo.findOne({ where: { id }, relations: { seller: true } });
    if (!listing) throw new NotFoundException(`Listing #${id} not found`);
    return listing;
  }

  async updateStock(id: number, dto: PatchListingStockDto) {
    const listing = await this.listingRepo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException(`Listing #${id} not found`);
    listing.stock = dto.stock;
    return this.listingRepo.save(listing);
  }

  async remove(id: number) {
    const result = await this.listingRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Listing #${id} not found`);
    return { message: `Listing #${id} deleted successfully` };
  }
}
