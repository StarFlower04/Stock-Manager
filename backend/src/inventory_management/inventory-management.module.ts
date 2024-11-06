// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { InventoryManagementService } from './inventory-management.service';
// import { Inventory } from 'src/modules/inventory/inventory.entity';
// import { Product } from 'src/modules/products/product.entity';
// import { RestockOrder } from 'src/modules/restock_orders/restock_order.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Inventory, Product, RestockOrder])],
//   providers: [InventoryManagementService],
//   exports: [InventoryManagementService],
// })
// export class InventoryManagementModule {}