// src/roles/role.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ unique: true, nullable: false })
  role_name: string;
}