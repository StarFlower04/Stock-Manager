// src/iot/iot.service.ts
import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Iot } from './iot.entity';
import { CreateIotDto } from './create-iot.dto';
import { UpdateIotDto } from './update-iot.dto';
import { Warehouse } from '../warehouses/warehouse.entity';
import { randomBytes } from 'crypto';
import { RfidReading } from '../rfid_readings/reading.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Tag } from '../tags/tag.entity';

@Injectable()
export class IotService {
  constructor(
    @InjectRepository(Iot)
    private iotRepository: Repository<Iot>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(RfidReading)
    private rfidReadingRepository: Repository<RfidReading>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) {}

  private async updateInventoryQuantity(iotId: number, token: string, rfidCode: string, quantityChange: number): Promise<RfidReading> {
    // Fetch IoT device by ID and token
    const iot = await this.iotRepository.findOne({
      where: { iot_id: iotId, token: token },
      relations: ['warehouse'],
    });
    if (!iot) {
      throw new NotFoundException(`IoT device with ID ${iotId} and token ${token} not found`);
    }
  
    // Fetch tag by RFID code
    const tag = await this.tagRepository.findOne({
      where: { rfid_code: rfidCode },
      relations: ['product'],
    });
    if (!tag) {
      throw new NotFoundException(`Tag with RFID code ${rfidCode} not found`);
    }
  
    // Find inventory entry
    const inventory = await this.inventoryRepository.findOne({
      where: {
        warehouse: iot.warehouse,
        product: tag.product,
      },
    });
  
    if (!inventory) {
      throw new NotFoundException(`Product with ID ${tag.product.product_id} not found in warehouse with ID ${iot.warehouse.warehouse_id}`);
    }
  
    // Adjust quantity
    inventory.quantity += quantityChange;
  
    // Ensure quantity is non-negative
    if (inventory.quantity < 0) {
      throw new BadRequestException('Inventory quantity cannot be negative');
    }
  
    await this.inventoryRepository.save(inventory);
  
    // Record RFID reading
    const rfidReading = this.rfidReadingRepository.create({
      product: tag.product,
      warehouse: iot.warehouse,
      tag: tag,
      quantity: quantityChange,
      reading_timestamp: new Date(),
    });
  
    await this.rfidReadingRepository.save(rfidReading);
  
    return rfidReading;
  }
  
  async increase(iotId: number, token: string, rfidCode: string): Promise<RfidReading> {
    return this.updateInventoryQuantity(iotId, token, rfidCode, 1);
  }
  
  async decrease(iotId: number, token: string, rfidCode: string): Promise<RfidReading> {
    return this.updateInventoryQuantity(iotId, token, rfidCode, -1);
  }  
  

  // async recordReading(rfidCode: string, iotId: number): Promise<RfidReading> {
  //   try {
  //     // Знайти пристрій IoT
  //     const iot = await this.iotRepository.findOne({
  //       where: { iot_id: iotId },
  //       relations: ['warehouse'],
  //     });
  //     if (!iot) {
  //       throw new NotFoundException(`IoT device with ID ${iotId} not found`);
  //     }
  
  //     // Знайти тег за rfid_code
  //     const tag = await this.tagRepository.findOne({
  //       where: { rfid_code: rfidCode },
  //       relations: ['product'],
  //     });
  //     if (!tag) {
  //       throw new NotFoundException(`Tag with RFID code ${rfidCode} not found`);
  //     }
  
  //     // Перевірити, чи продукт є на складі, прив'язаному до IoT-пристрою
  //     const inventory = await this.inventoryRepository.findOne({
  //       where: {
  //         warehouse: iot.warehouse,
  //         product: tag.product,
  //       },
  //     });
  
  //     if (!inventory) {
  //       throw new NotFoundException(`Product with ID ${tag.product.product_id} not found in warehouse with ID ${iot.warehouse.warehouse_id}`);
  //     }
  
  //     // Створити запис в rfid_readings
  //     const rfidReading = this.rfidReadingRepository.create({
  //       product: tag.product,
  //       warehouse: iot.warehouse,
  //       tag: tag,
  //       quantity: 1,
  //       reading_timestamp: new Date(),
  //     });
  //     await this.rfidReadingRepository.save(rfidReading);
  
  //     // Оновити таблицю inventory
  //     inventory.quantity += 1;
  //     await this.inventoryRepository.save(inventory);
  
  //     return rfidReading;
  //   } catch (error) {
  //     console.error('Error recording RFID reading:', error);
  //     throw new InternalServerErrorException('Error recording RFID reading');
  //   }
  // }  

  async findAll(): Promise<Iot[]> {
    return this.iotRepository.find({ relations: ['warehouse'] }); // Додаємо завантаження пов'язаного складу
  }

  async findOne(id: number): Promise<Iot> {
    const iot = await this.iotRepository.findOne({ where: { iot_id: id }, relations: ['warehouse'] });
    if (!iot) {
      throw new NotFoundException(`IoT device with ID ${id} not found`);
    }
    return iot;
  }

  async create(createIotDto: CreateIotDto): Promise<{ id: number; iot: Iot }> {
    try {
      const warehouse = await this.warehouseRepository.findOne({
        where: { warehouse_id: createIotDto.warehouse_id },
      });
      if (!warehouse) {
        throw new NotFoundException(`Warehouse with ID ${createIotDto.warehouse_id} not found`);
      }
  
      // Генерація випадкового токена
      const randomToken = randomBytes(32).toString('hex'); // 16 байт = 32 символи
      const unixTime = Date.now(); // Unix-час у мілісекундах
      const token = `${randomToken}-${unixTime}`; // Комбінування випадкового токена з Unix-часом
  
      const iot = this.iotRepository.create({ ...createIotDto, token, warehouse });
      const savedIot = await this.iotRepository.save(iot);
  
      return { id: savedIot.iot_id, iot: savedIot };
    } catch (error) {
      console.error('Error creating IoT device:', error);
      throw new InternalServerErrorException('Error creating IoT device');
    }
  }  

  async update(id: number, updateIotDto: UpdateIotDto): Promise<Iot> {
    const iot = await this.findOne(id);

    if (updateIotDto.warehouse_id) {
      const warehouse = await this.warehouseRepository.findOne({
        where: { warehouse_id: updateIotDto.warehouse_id },
      });
      if (!warehouse) {
        throw new NotFoundException(`Warehouse with ID ${updateIotDto.warehouse_id} not found`);
      }
      iot.warehouse = warehouse;
    }    

    Object.assign(iot, updateIotDto);
    return await this.iotRepository.save(iot);
  }

  async remove(id: number): Promise<void> {
    const result = await this.iotRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`IoT device with ID ${id} not found`);
    }
  }
}