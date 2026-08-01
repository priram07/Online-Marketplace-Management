import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  code: string;

  @Column('decimal', { precision: 5, scale: 2 })
  discountPercent: number;

  @Column({ default: true })
  isActive: boolean;

  // ---- Relationship 3: Many-to-Many (Customer <-> Coupon), owning side ----
  @ManyToMany(() => Customer, (customer) => customer.coupons)
  @JoinTable({
    name: 'customer_coupons',
    joinColumn: { name: 'couponId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'customerId', referencedColumnName: 'id' },
  })
  customers: Customer[];
}
