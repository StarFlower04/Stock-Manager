import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestockOrder } from 'src/modules/restock_orders/restock_order.entity';
import { Inventory } from 'src/modules/inventory/inventory.entity';

@Injectable()
export class RestockOrderStatusService {
  private readonly logger = new Logger(RestockOrderStatusService.name);

  constructor(
    @InjectRepository(RestockOrder)
    private restockOrderRepository: Repository<RestockOrder>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async updateRestockOrders(): Promise<void> {
    this.logger.debug('Updating restock orders status');
  
    const restockOrders = await this.restockOrderRepository.find({
      where: { status: 'pending' },
      relations: ['product', 'warehouse']
    });
  
    for (const order of restockOrders) {
      if (!order.product || !order.warehouse) {
        this.logger.warn(`Restock order ${order.restock_order_id} is missing product or warehouse`);
        continue;
      }
  
      const inventory = await this.inventoryRepository.findOne({
        where: { product: { product_id: order.product.product_id }, warehouse: { warehouse_id: order.warehouse.warehouse_id } },
      });
  
      if (inventory && inventory.quantity >= order.order_quantity) {
        order.status = 'replenished';
        await this.restockOrderRepository.save(order);
        this.logger.debug(`Restock order ${order.restock_order_id} updated to replenished`);
      }
    }
  }
}