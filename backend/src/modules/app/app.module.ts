// src/modules/app/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from 'src/orm.config';
import { Supplier } from '../supplier/supplier.entity';
import { SupplierController } from '../supplier/supplier.controller';
import { SupplierService } from '../supplier/supplier.service';
import { Product } from '../products/product.entity';
import { ProductController } from '../products/product.controller';
import { ProductService } from '../products/product.service';
import { Warehouse } from '../warehouses/warehouse.entity';
import { WarehouseController } from '../warehouses/warehouse.controller';
import { WarehouseService } from '../warehouses/warehouse.service';
import { Inventory } from '../inventory/inventory.entity';
import { InventoryController } from '../inventory/inventory.controller';
import { InventoryService } from '../inventory/inventory.service';
import { Order } from '../orders/order.entity';
import { OrderController } from '../orders/order.controller';
import { OrderService } from '../orders/order.service';
import { RestockOrder } from '../restock_orders/restock_order.entity';
import { RestockOrderController } from '../restock_orders/restock_order.controller';
import { RestockOrderService } from '../restock_orders/restock_order.service';
import { Tag } from '../tags/tag.entity';
import { TagController } from '../tags/tag.controller';
import { TagService } from '../tags/tag.service';
import { RfidReading } from '../rfid_readings/reading.entity';
import { RfidReadingController } from '../rfid_readings/reading.controller';
import { ReadingService } from '../rfid_readings/reading.service';
import { Role } from '../roles/role.entity';
import { RoleController } from '../roles/role.controller';
import { RoleService } from '../roles/role.service';
import { User } from '../users/user.entity';
import { UserController } from '../users/user.controller';
import { UserService } from '../users/user.service';
import { Sale } from '../sales/sale.entity';
import { SaleController } from '../sales/sale.controller';
import { SaleService } from '../sales/sale.service';
import { SaleProduct } from '../sale_product/sale_product.entity';
import { SaleProductController } from '../sale_product/sale_product.controller';
import { SaleProductService } from '../sale_product/sale_product.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { InventoryManagementService } from 'src/inventory_management/inventory-management.service';
import { RestockOrderStatusService } from 'src/inventory_management/restock-order_status.service';
import { RFIDReadingService } from 'src/inventory_management/rfid-reading.service';
import { TransactionController } from '../transactions/transaction.controller';
import { TransactionService } from '../transactions/transaction.service';
import { Transaction } from '../transactions/transaction.entity';
import { WarehouseProductController } from 'src/warehouse_products/warehouse_product.controller';
import { WarehouseProductService } from 'src/warehouse_products/warehouse_products.service';
import { ShoppingCart } from '../shopping_cart/shopping_cart.entity';
import { ShoppingCartController } from '../shopping_cart/shopping_cart.controller';
import { ShoppingCartService } from '../shopping_cart/shopping_cart.service';
import { Payment } from '../payments/payment.entity';
import { PaymentController } from '../payments/payment.controller';
import { PaymentService } from '../payments/payment.service';
import { Iot } from '../iot/iot.entity';
import { IotController } from '../iot/iot.controller';
import { IotService } from '../iot/iot.service';
import { AdminController } from 'src/administarting/admin.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([Supplier, Product, Warehouse, Inventory, Order, 
       RestockOrder, Tag, RfidReading, Role, User, Sale, SaleProduct, Transaction, ShoppingCart, Payment, Iot]),
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1d'}})                          
  ],
  controllers: [
    AuthController,
    AppController,
    SupplierController,
    ProductController,
    WarehouseController,
    InventoryController,
    OrderController,
    RestockOrderController,
    TagController,
    RfidReadingController,
    RoleController,
    UserController,
    SaleController,
    SaleProductController,
    TransactionController,
    ShoppingCartController,
    PaymentController,
    IotController,
    WarehouseProductController,
    AdminController,
  ],
  providers: [
    AppService,
    SupplierService,
    ProductService,
    WarehouseService,
    InventoryService,
    OrderService,
    RestockOrderService,
    TagService,
    ReadingService,
    RoleService,
    UserService,
    SaleService,
    SaleProductService,
    AuthService,
    InventoryManagementService,
    RestockOrderStatusService,
    RFIDReadingService,
    TransactionService,
    ShoppingCartService,
    PaymentService,
    IotService,
    WarehouseProductService,
  ],
})
export class AppModule {}