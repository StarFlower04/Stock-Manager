// src/orders/order.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './create-order.dto';
import { UpdateOrderDto } from './update-order.dto';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Supplier } from '../supplier/supplier.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,

    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['supplier', 'warehouse'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { order_id: id }, relations: ['supplier', 'warehouse'] });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const supplier = await this.supplierRepository.findOne({ where: { supplier_id: createOrderDto.supplier_id } });
      const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: createOrderDto.warehouse_id } });

      if (!supplier || !warehouse) {
        throw new NotFoundException('Supplier or Warehouse not found');
      }

      const order = this.orderRepository.create({
        order_date: createOrderDto.order_date,
        supplier,
        warehouse,
      });

      return await this.orderRepository.save(order);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new InternalServerErrorException('Error creating order');
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { order_id: id },
      relations: ['supplier', 'warehouse'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (updateOrderDto.supplier_id) {
      const supplier = await this.supplierRepository.findOne({ where: { supplier_id: updateOrderDto.supplier_id } });
      if (!supplier) {
        throw new NotFoundException('Supplier not found');
      }
      order.supplier = supplier;
    }

    if (updateOrderDto.warehouse_id) {
      const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: updateOrderDto.warehouse_id } });
      if (!warehouse) {
        throw new NotFoundException('Warehouse not found');
      }
      order.warehouse = warehouse;
    }

    // Оновлення запису
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}