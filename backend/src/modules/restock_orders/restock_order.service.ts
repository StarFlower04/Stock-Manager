// src/restock-orders/restock-order.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { RestockOrder } from './restock_order.entity';
import { CreateRestockOrderDto } from './create-restock_order.dto';
import { UpdateRestockOrderDto } from './update-restock_order.dto';

@Injectable()
export class RestockOrderService {
  constructor(
    @InjectRepository(RestockOrder)
    private restockOrderRepository: Repository<RestockOrder>,
    
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<RestockOrder[]> {
    return this.restockOrderRepository.find({ relations: ['product', 'warehouse'] });
  }

  async findOne(id: number): Promise<RestockOrder> {
    const restockOrder = await this.restockOrderRepository.findOne({ where: { restock_order_id: id }, relations: ['product', 'warehouse'] });
    if (!restockOrder) {
      throw new NotFoundException(`Restock Order with ID ${id} not found`);
    }
    return restockOrder;
  }

  async create(createRestockOrderDto: CreateRestockOrderDto): Promise<RestockOrder> {
    try {
      const product = await this.productRepository.findOne({ where: { product_id: createRestockOrderDto.product_id } });
      const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: createRestockOrderDto.warehouse_id } });

      if (!product || !warehouse) {
        throw new NotFoundException('Product or Warehouse not found');
      }

      const restockOrder = this.restockOrderRepository.create({
        product,
        warehouse,
        order_quantity: createRestockOrderDto.order_quantity,
        order_date: createRestockOrderDto.order_date,
        status: createRestockOrderDto.status,
      });

      return await this.restockOrderRepository.save(restockOrder);
    } catch (error) {
      console.error('Error creating restock order:', error);
      throw new InternalServerErrorException('Error creating restock order');
    }
  }

  async update(id: number, updateRestockOrderDto: UpdateRestockOrderDto): Promise<RestockOrder> {
    const restockOrder = await this.restockOrderRepository.findOne({
      where: { restock_order_id: id },
      relations: ['product', 'warehouse'],
    });

    if (!restockOrder) {
      throw new NotFoundException(`Restock Order with ID ${id} not found`);
    }

    if (updateRestockOrderDto.product_id) {
      const product = await this.productRepository.findOne({ where: { product_id: updateRestockOrderDto.product_id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      restockOrder.product = product;
    }

    if (updateRestockOrderDto.warehouse_id) {
      const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: updateRestockOrderDto.warehouse_id } });
      if (!warehouse) {
        throw new NotFoundException('Warehouse not found');
      }
      restockOrder.warehouse = warehouse;
    }

    // Оновлення запису
    Object.assign(restockOrder, updateRestockOrderDto);
    return await this.restockOrderRepository.save(restockOrder);
  }

  async remove(id: number): Promise<void> {
    const result = await this.restockOrderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Restock Order with ID ${id} not found`);
    }
  }
}