import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('tags')
export class Tag {
  @PrimaryColumn()
  tag_id: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: false, unique: true })
  rfid_code: string;
}