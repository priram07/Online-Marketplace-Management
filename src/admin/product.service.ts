import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PatchStockDto } from './dto/patch-stock.dto';
import { AttachTagDto } from './dto/attach-tag.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  // ---------- CRUD (7 routes) ----------

  // 1. CREATE
  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });
    if (!category)
      throw new NotFoundException(`Category #${dto.categoryId} not found`);

    const product = this.productRepo.create({ ...dto, category });
    return this.productRepo.save(product);
  }

  // 2. READ ALL
  findAll() {
    return this.productRepo.find({ relations: { category: true, tags: true } });
  }

  // 3. READ ONE
  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  // 4. PUT full update
  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productRepo.preload({ id, ...dto });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return this.productRepo.save(product);
  }

  // 5. PATCH partial update (stock)
  async patchStock(id: number, dto: PatchStockDto) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    product.stock = dto.stock;
    return this.productRepo.save(product);
  }

  // 6. DELETE
  async remove(id: number) {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Product #${id} not found`);
    return { message: `Product #${id} deleted successfully` };
  }

  // 7. READ by category (Relationship 1: Category 1 -> M Products)
  async findByCategory(categoryId: number) {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category)
      throw new NotFoundException(`Category #${categoryId} not found`);
    return this.productRepo.find({
      where: { categoryId },
      relations: { tags: true },
    });
  }

  // ---------- Relationship 2: Many-to-Many (Product <-> Tag) — 3 CRUD routes ----------

  // a. Attach (create/link) a tag to a product
  async attachTag(productId: number, dto: AttachTagDto) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: { tags: true },
    });
    if (!product)
      throw new NotFoundException(`Product #${productId} not found`);

    let tag = await this.tagRepo.findOne({ where: { name: dto.name } });
    if (!tag) {
      tag = await this.tagRepo.save(this.tagRepo.create({ name: dto.name }));
    }

    const alreadyLinked = product.tags?.some((t) => t.id === tag.id);
    if (!alreadyLinked) {
      product.tags = [...(product.tags || []), tag];
      await this.productRepo.save(product);
    }
    return product;
  }

  // b. List tags for a product
  async getTags(productId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: { tags: true },
    });
    if (!product)
      throw new NotFoundException(`Product #${productId} not found`);
    return product.tags;
  }

  // c. Detach a tag from a product
  async detachTag(productId: number, tagId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: { tags: true },
    });
    if (!product)
      throw new NotFoundException(`Product #${productId} not found`);

    product.tags = (product.tags || []).filter((t) => t.id !== tagId);
    await this.productRepo.save(product);
    return { message: `Tag #${tagId} removed from product #${productId}` };
  }
}
