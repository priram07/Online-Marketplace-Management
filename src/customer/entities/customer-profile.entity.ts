import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('customer_profiles')
export class CustomerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  // Owning side of the One-to-One relationship
  @OneToOne(() => Customer, (customer) => customer.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Customer;
}
