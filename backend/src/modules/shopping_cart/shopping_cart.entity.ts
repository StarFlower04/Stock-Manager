import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity('shopping_cart')
export class ShoppingCart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: false })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}