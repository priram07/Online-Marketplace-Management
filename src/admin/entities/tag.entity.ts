import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  // ---- Relationship 2 (inverse side): Many-to-Many ----
  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];
}
