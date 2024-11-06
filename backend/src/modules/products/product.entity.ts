// src/products/product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ManyToOne(() => Supplier, { nullable: false })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ nullable: false })
  min_quantity: number;

  @OneToMany(() => Inventory, inventory => inventory.product)
  inventories: Inventory[];

  @Column({ nullable: true })
  image_url?: string;

  get imagePath(): string {
    return this.image_url
      ? `http://localhost:3000/uploads/products/${this.image_url}`
      : `https://via.placeholder.com/400x300?text=${this.name}`;
  }
}