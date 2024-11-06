// src/restock-orders/restock-order.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RestockOrderService } from './restock_order.service';
import { RestockOrder } from './restock_order.entity';
import { CreateRestockOrderDto } from './create-restock_order.dto';
import { UpdateRestockOrderDto } from './update-restock_order.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('restock-orders')
@Controller('restock-orders')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class RestockOrderController {
  constructor(private readonly restockOrderService: RestockOrderService) {}

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all restock orders' })
  @ApiResponse({ status: 200, description: 'List of restock orders', type: [RestockOrder] })
  findAll(): Promise<RestockOrder[]> {
    return this.restockOrderService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get restock order by ID' })
  @ApiResponse({ status: 200, description: 'Restock order details', type: RestockOrder })
  @ApiResponse({ status: 404, description: 'Restock order not found' })
  findOne(@Param('id') id: number): Promise<RestockOrder> {
    return this.restockOrderService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new restock order' })
  @ApiResponse({ status: 201, description: 'Restock order created', type: RestockOrder })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createRestockOrderDto: CreateRestockOrderDto,
  ): Promise<RestockOrder> {
    return this.restockOrderService.create(createRestockOrderDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a restock order by ID' })
  @ApiResponse({ status: 200, description: 'Restock order updated', type: RestockOrder })
  @ApiResponse({ status: 404, description: 'Restock order not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateRestockOrderDto: UpdateRestockOrderDto,
  ): Promise<RestockOrder> {
    return this.restockOrderService.update(id, updateRestockOrderDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete a restock order by ID' })
  @ApiResponse({ status: 200, description: 'Restock order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Restock order not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.restockOrderService.remove(id);
    return { message: `Restock Order with ID ${id} has been successfully deleted` };
  }
}