// src/orders/order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Supplier } from '../supplier/supplier.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column({ type: 'date', nullable: false })
  order_date: Date;

  @ManyToOne(() => Supplier, { nullable: false })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Warehouse, { nullable: false })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;
}