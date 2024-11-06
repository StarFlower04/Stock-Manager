// src/supplier/supplier.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity'; // Import the Product entity

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  supplier_id: number;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone_number: string;

  @OneToMany(() => Product, product => product.supplier)
  products: Product[];
}