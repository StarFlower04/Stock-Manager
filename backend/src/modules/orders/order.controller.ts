// src/orders/order.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './create-order.dto';
import { UpdateOrderDto } from './update-order.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of orders', type: [Order] })
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order details', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created', type: Order })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiResponse({ status: 200, description: 'Order updated', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.orderService.remove(id);
    return { message: `Order with ID ${id} has been successfully deleted` };
  }
}