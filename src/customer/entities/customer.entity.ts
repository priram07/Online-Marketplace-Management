import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Coupon } from './coupon.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // stored as bcrypt hash

  @Column({ default: 'customer' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

 

  // ---- Relationship 2: One-to-Many ----
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  // ---- Relationship 3: Many-to-Many (inverse side) ----
  @ManyToMany(() => Coupon, (coupon) => coupon.customers)
  coupons: Coupon[];
}
