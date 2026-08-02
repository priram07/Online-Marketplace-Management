import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Seller } from './seller.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  storeName!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  logoUrl!: string;

  // Owning side of the One-to-One relationship
  @OneToOne(() => Seller, (seller) => seller.store, { onDelete: 'CASCADE' })
  @JoinColumn()
  seller!: Seller;
}
