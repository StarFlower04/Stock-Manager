// src/restock-orders/restock-order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('restock_orders')
export class RestockOrder {
  @PrimaryGeneratedColumn()
  restock_order_id: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Warehouse, { nullable: false })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ nullable: false })
  order_quantity: number;

  @Column({ type: 'date', nullable: false })
  order_date: Date;

  @Column({ nullable: false })
  status: string;
}