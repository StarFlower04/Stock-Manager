// src/sale-product/sale-product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';

@Entity('sale_product')
export class SaleProduct {
  @PrimaryGeneratedColumn()
  sale_product_id: number;

  @ManyToOne(() => Sale, { nullable: false })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: false })
  quantity: number;
}