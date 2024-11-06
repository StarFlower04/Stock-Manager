// src/transactions/transaction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  transaction_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ length: 50, nullable: false })
  status: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Warehouse, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ length: 20, nullable: true })
  card_number: string;

  @Column({ length: 7, nullable: true })
  card_expiry: string;

  @Column({ length: 4, nullable: true })
  card_cvv: string;

  @Column({ length: 50, nullable: true })
  first_name: string;

  @Column({ length: 50, nullable: true })
  last_name: string;
}