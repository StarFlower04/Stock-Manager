// src/iot/iot.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('iot')
export class Iot {
  @PrimaryGeneratedColumn()
  iot_id: number;

  @Column({ length: 256, nullable: false })
  token: string;

  @ManyToOne(() => Warehouse, warehouse => warehouse.iots, { nullable: false })
  @JoinColumn({ name: 'warehouse_id' }) // Вказуємо назву колонки для зовнішнього ключа
  warehouse: Warehouse;
}