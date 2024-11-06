// src/rfid-readings/rfid-reading.service.ts
import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Tag } from '../tags/tag.entity';
import { RfidReading } from './reading.entity';
import { CreateRfidReadingDto } from './create-reading.dto';
import { UpdateRfidReadingDto } from './update-reading.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(RfidReading)
    private rfidReadingRepository: Repository<RfidReading>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,

    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  private generateRfidCode(): string {
    // Генеруємо унікальний RFID код, використовуючи UUID або інший метод
    return uuidv4(); // UUID генерує унікальний код
  }

  async findAll(): Promise<RfidReading[]> {
    return this.rfidReadingRepository.find({ relations: ['product', 'warehouse', 'tag'] });
  }

  async findOne(id: number): Promise<RfidReading> {
    const rfidReading = await this.rfidReadingRepository.findOne({ where: { reading_id: id }, relations: ['product', 'warehouse', 'tag'] });
    if (!rfidReading) {
      throw new NotFoundException(`RFID Reading with ID ${id} not found`);
    }
    return rfidReading;
  }

  async create(createRfidReadingDto: CreateRfidReadingDto): Promise<RfidReading> {
    try {
      const product = await this.productRepository.findOne({ where: { product_id: createRfidReadingDto.product_id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: createRfidReadingDto.warehouse_id } });
      if (!warehouse) {
        throw new NotFoundException('Warehouse not found');
      }

      const tag = await this.tagRepository.findOne({ where: { tag_id: createRfidReadingDto.tag_id } });
      if (!tag) {
        throw new NotFoundException('Tag not found');
      }

      const rfidReading = this.rfidReadingRepository.create({
        product,
        warehouse,
        tag,
        quantity: createRfidReadingDto.quantity,
        reading_timestamp: new Date(),
      });

      return await this.rfidReadingRepository.save(rfidReading);
    } catch (error) {
      console.error('Error creating RFID reading:', error);
      throw new InternalServerErrorException('Error creating RFID reading');
    }
  }

  async update(id: number, updateRfidReadingDto: UpdateRfidReadingDto): Promise<RfidReading> {
    const rfidReading = await this.rfidReadingRepository.findOne({
      where: { reading_id: id },
      relations: ['product', 'warehouse', 'tag'],
    });

    if (!rfidReading) {
      throw new NotFoundException(`RFID Reading with ID ${id} not found`);
    }

    if (updateRfidReadingDto.product_id) {
      const product = await this.productRepository.findOne({ where: { product_id: updateRfidReadingDto.product_id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      rfidReading.product = product;
    }

    if (updateRfidReadingDto.warehouse_id) {
      const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: updateRfidReadingDto.warehouse_id } });
      if (!warehouse) {
        throw new NotFoundException('Warehouse not found');
      }
      rfidReading.warehouse = warehouse;
    }

    if (updateRfidReadingDto.tag_id) {
      const tag = await this.tagRepository.findOne({ where: { tag_id: updateRfidReadingDto.tag_id } });
      if (!tag) {
        throw new NotFoundException('Tag not found');
      }
      rfidReading.tag = tag;
    }

    // Оновлення запису
    Object.assign(rfidReading, updateRfidReadingDto);
    return await this.rfidReadingRepository.save(rfidReading);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rfidReadingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RFID Reading with ID ${id} not found`);
    }
  }
}