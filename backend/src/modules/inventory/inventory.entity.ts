// src/inventory/inventory.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Warehouse, { nullable: false })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ nullable: false })
  quantity: number;
}