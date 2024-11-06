import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Inventory } from '../inventory/inventory.entity';
import { User } from '../users/user.entity'; 
import { Iot } from '../iot/iot.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  warehouse_id: number;

  @Column({ nullable: false })
  location: string;

  @Column()
  user_id: number;

  @ManyToOne(() => User, user => user.warehouses, { nullable: false })
  @JoinColumn({ name: 'user_id' }) // Вказуємо явне ім'я стовпця для FK
  user: User;

  @OneToMany(() => Inventory, inventory => inventory.warehouse)
  inventory: Inventory[];

  @OneToMany(() => Iot, iot => iot.warehouse)
  iots: Iot[]; 
}