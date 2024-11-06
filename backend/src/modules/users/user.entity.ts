// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, OneToMany, Transaction } from 'typeorm';
import { Role } from '../roles/role.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import * as bcrypt from 'bcrypt';
import { Sale } from '../sales/sale.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true, nullable: false })
  user_name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  role_id: number;

  @Column({ nullable: true }) 
  avatar?: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Warehouse, warehouse => warehouse.user) 
  warehouses: Warehouse[];

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}