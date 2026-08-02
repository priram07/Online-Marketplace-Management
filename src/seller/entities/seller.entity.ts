import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Store } from './store.entity';
import { Listing } from './listing.entity';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  businessName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string; // bcrypt hash

  @Column({ default: 'seller' })
  role!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  // ---- Relationship 1: One-to-One ----
  @OneToOne(() => Store, (store) => store.seller, { cascade: true })
  store!: Store;

  // ---- Relationship 2: One-to-Many ----
  @OneToMany(() => Listing, (listing) => listing.seller)
  listings!: Listing[];
}
