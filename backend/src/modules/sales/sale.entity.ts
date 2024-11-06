// src/sales/sale.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { SaleProduct } from '../sale_product/sale_product.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  sale_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sale_date: Date;

  @Column({ type: 'decimal' })
  sale_cost: number;

  @Column({ type: 'varchar', length: 50, default: 'Pending' }) 
  status: string;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'user_id' })
  user: User;  

  @OneToMany(() => SaleProduct, (saleProduct) => saleProduct.sale)
  saleProducts: SaleProduct[];
}