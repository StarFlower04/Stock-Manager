import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { RfidReading } from 'src/modules/rfid_readings/reading.entity';
import { Inventory } from 'src/modules/inventory/inventory.entity';
import { Tag } from 'src/modules/tags/tag.entity';
import { Product } from 'src/modules/products/product.entity';
import { Warehouse } from 'src/modules/warehouses/warehouse.entity';
import { RestockOrderStatusService } from './restock-order_status.service';
import { RestockOrder } from 'src/modules/restock_orders/restock_order.entity';

@Injectable()
export class RFIDReadingService {
  private readonly logger = new Logger(RFIDReadingService.name);

  constructor(
    @InjectRepository(RfidReading)
    private rfidReadingRepository: Repository<RfidReading>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(RestockOrder) 
    private restockOrderRepository: Repository<RestockOrder>,
    private restockOrderStatusService: RestockOrderStatusService,
  ) {}

  @Cron('51 0 * * *') 
  async simulateRfidReadings() {
    this.logger.debug('Simulating RFID readings');
  
    const pendingRestockOrders = await this.restockOrderRepository.find({
      where: { status: 'pending' },
      relations: ['product', 'warehouse']
    });
  
    if (pendingRestockOrders.length === 0) {
      this.logger.debug('No pending restock orders found');
    } else {
      this.logger.debug(`Found ${pendingRestockOrders.length} pending restock orders`);
    }
  
    for (const order of pendingRestockOrders) {
      this.logger.debug(`Creating RFID reading for product ${order.product.product_id} in warehouse ${order.warehouse.warehouse_id}`);
      await this.createRfidReading(order.product.product_id, order.warehouse.warehouse_id, order.order_quantity, order.product.product_id);
    }
  }  

  async createRfidReading(productId: number, warehouseId: number, quantity: number, tagId: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ product_id: productId });
    const warehouse = await this.warehouseRepository.findOneBy({ warehouse_id: warehouseId });
    const tag = await this.tagRepository.findOneBy({ tag_id: tagId });
  
    if (!product || !warehouse || !tag) {
      throw new Error('Product, Warehouse, or Tag not found');
    }
  
    const newReading = this.rfidReadingRepository.create({
      product: product,
      warehouse: warehouse,
      quantity: quantity, 
      reading_timestamp: new Date(),
      tag: tag,
    });
  
    await this.rfidReadingRepository.save(newReading);
    await this.updateInventory(product, warehouse, quantity); 
  }  

  private async updateInventory(product: Product, warehouse: Warehouse, orderQuantity: number): Promise<void> {
    this.logger.debug(`Updating inventory for product ${product.name} in warehouse ${warehouse.location} with quantity ${orderQuantity}`);
    const inventory = await this.inventoryRepository.findOne({
      where: { product: { product_id: product.product_id }, warehouse: { warehouse_id: warehouse.warehouse_id } },
    });
  
    if (inventory) {
      this.logger.debug(`Existing inventory found. Current quantity: ${inventory.quantity}`);
      inventory.quantity += orderQuantity;
      await this.inventoryRepository.save(inventory);
      this.logger.debug(`Updated inventory quantity: ${inventory.quantity}`);
    } else {
      this.logger.debug('No existing inventory found. Creating new inventory record.');
      const newInventory = this.inventoryRepository.create({
        product: product,
        warehouse: warehouse,
        quantity: orderQuantity,
      });
      await this.inventoryRepository.save(newInventory);
      this.logger.debug('New inventory record created.');
    }

    await this.restockOrderStatusService.updateRestockOrders();
  }   
}