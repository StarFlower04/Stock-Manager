import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ nullable: false })
  status: string;

  @CreateDateColumn()
  payment_date: Date;

  @Column({ nullable: false })
  payment_method: string;

  @Column({ nullable: false })
  card_number: string;

  @Column({ nullable: false })
  card_expiry: string; // Формат: MM/YYYY

  @Column({ nullable: false })
  card_cvv: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;
}