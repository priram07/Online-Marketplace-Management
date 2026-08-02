import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { Store } from './entities/store.entity';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PatchSellerDto } from './dto/patch-seller.dto';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepo: Repository<Seller>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  // ---------- CRUD ----------
  findAll() {
    return this.sellerRepo.find({ relations: { store: true } });
  }

  async findOne(id: number) {
    const seller = await this.sellerRepo.findOne({
      where: { id },
      relations: { store: true, listings: true },
    });
    if (!seller) throw new NotFoundException(`Seller #${id} not found`);
    const { password, ...safe } = seller;
    return safe;
  }

  async update(id: number, dto: UpdateSellerDto) {
    const seller = await this.sellerRepo.preload({ id, ...dto });
    if (!seller) throw new NotFoundException(`Seller #${id} not found`);
    const saved = await this.sellerRepo.save(seller);
    const { password, ...safe } = saved;
    return safe;
  }

  async patch(id: number, dto: PatchSellerDto) {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException(`Seller #${id} not found`);
    Object.assign(seller, dto);
    const saved = await this.sellerRepo.save(seller);
    const { password, ...safe } = saved;
    return safe;
  }

  async remove(id: number) {
    const result = await this.sellerRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Seller #${id} not found`);
    }
    return { message: `Seller #${id} deleted successfully` };
  }

  // ---------- Relationship 1: One-to-One (Seller <-> Store) ----------
  async createStore(sellerId: number, dto: CreateStoreDto) {
    const seller = await this.sellerRepo.findOne({
      where: { id: sellerId },
      relations: { store: true },
    });
    if (!seller) throw new NotFoundException(`Seller #${sellerId} not found`);
    if (seller.store) {
      throw new ConflictException('Store already exists for this seller');
    }
    const store = this.storeRepo.create({ ...dto, seller });
    return this.storeRepo.save(store);
  }

  async getStore(sellerId: number) {
    const seller = await this.sellerRepo.findOne({
      where: { id: sellerId },
      relations: { store: true },
    });
    if (!seller || !seller.store) {
      throw new NotFoundException(`Store not found for seller #${sellerId}`);
    }
    return seller.store;
  }
}
