import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from 'src/modules/warehouses/warehouse.entity';
import { Inventory } from 'src/modules/inventory/inventory.entity';
import { Product } from 'src/modules/products/product.entity';
import { RestockOrder } from 'src/modules/restock_orders/restock_order.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class InventoryManagementService {
  private readonly logger = new Logger(InventoryManagementService.name);

  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(RestockOrder)
    private restockOrdersRepository: Repository<RestockOrder>,
  ) {}

  @Cron('50 0 * * *') 
  async handleCron() {
    await this.checkAndRestock();
  }

  async checkAndRestock(): Promise<void> {
    this.logger.debug('Fetching inventories...');
    const inventories = await this.inventoryRepository.find({ relations: ['product', 'warehouse'] });
    
    for (const inventory of inventories) {
      const product = inventory.product;
      this.logger.debug(`Checking product ${product.name} with quantity ${inventory.quantity} and min_quantity ${product.min_quantity}`);
      if (inventory.quantity < product.min_quantity) {
        this.logger.debug(`Product ${product.name} is below min quantity. Initiating restock...`);
        await this.restockProduct(product, inventory.warehouse, product.min_quantity - inventory.quantity);
      }
    }
  }

  private async restockProduct(product: Product, warehouse: Warehouse, orderQuantity: number): Promise<void> {
    this.logger.debug(`Creating restock order for product ${product.name} in warehouse ${warehouse.location}`);
    const newRestockOrder = this.restockOrdersRepository.create({
      product: product,
      warehouse: warehouse,
      order_quantity: orderQuantity,
      order_date: new Date(),
      status: 'pending',
    });
    await this.restockOrdersRepository.save(newRestockOrder);
    this.logger.debug(`Restock order created: ${newRestockOrder}`);
  }
}