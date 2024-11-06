// src/inventory/inventory.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { UpdateInventoryDto } from './update-inventory.dto';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { CreateInventoryDto } from './create-inventiry.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findByProduct(product_id: number): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { product: { product_id } },
      relations: ['warehouse']
    });
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({ relations: ['product', 'warehouse'] });
  }

  async findOne(id: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({ where: { inventory_id: id }, relations: ['product', 'warehouse'] });
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventory;
  }

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    try {
      const product = await this.productRepository.findOne({ where: { product_id: createInventoryDto.product_id } });
      const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: createInventoryDto.warehouse_id } });

      if (!product || !warehouse) {
        throw new NotFoundException('Product or Warehouse not found');
      }

      const inventory = this.inventoryRepository.create({
        product,
        warehouse,
        quantity: createInventoryDto.quantity,
      });

      return await this.inventoryRepository.save(inventory);
    } catch (error) {
      console.error('Error creating inventory:', error);
      throw new InternalServerErrorException('Error creating inventory');
    }
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { inventory_id: id },
      relations: ['product', 'warehouse'],
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    if (updateInventoryDto.product_id) {
      const product = await this.productRepository.findOne({ where: { product_id: updateInventoryDto.product_id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      inventory.product = product;
    }

    if (updateInventoryDto.warehouse_id) {
      const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: updateInventoryDto.warehouse_id } });
      if (!warehouse) {
        throw new NotFoundException('Warehouse not found');
      }
      inventory.warehouse = warehouse;
    }

    // Оновлення запису
    Object.assign(inventory, updateInventoryDto);
    return await this.inventoryRepository.save(inventory);
  }

  async remove(id: number): Promise<void> {
    const result = await this.inventoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
  }
}