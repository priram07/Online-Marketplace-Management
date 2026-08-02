import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 80 })
  name: string;

  @Column({ nullable: true })
  description: string;

  // ---- Relationship 1: One-to-Many ----
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
