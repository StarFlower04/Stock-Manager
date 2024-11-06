// src/warehouses/warehouse.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { UpdateWarehouseDto } from './update-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({ select: ['warehouse_id', 'location', 'user_id'] });
  }

  async findOne(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({ 
      where: { warehouse_id: id },
      select: ['warehouse_id', 'location', 'user_id']
    });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    try {
      const warehouse = this.warehouseRepository.create(createWarehouseDto);
      return await this.warehouseRepository.save(warehouse);
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw new InternalServerErrorException('Error creating warehouse');
    }
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    Object.assign(warehouse, updateWarehouseDto);
    return await this.warehouseRepository.save(warehouse);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.warehouseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return { message: `Warehouse with ID ${id} has been successfully deleted` };
  }
}