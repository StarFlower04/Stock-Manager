// src/rfid-readings/reading.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Tag } from '../tags/tag.entity';

@Entity('rfid_readings')
export class RfidReading {
  @PrimaryGeneratedColumn()
  reading_id: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Warehouse, { nullable: false })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Tag, { nullable: false })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @Column({ nullable: false })
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reading_timestamp: Date;
}
