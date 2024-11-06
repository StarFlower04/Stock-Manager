// src/inventory/inventory.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { UpdateInventoryDto } from './update-inventory.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInventoryDto } from './create-inventiry.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all inventory' })
  @ApiResponse({ status: 200, description: 'List of inventory', type: [Inventory] })
  findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get inventory by ID' })
  @ApiResponse({ status: 200, description: 'Inventory details', type: Inventory })
  @ApiResponse({ status: 404, description: 'Inventory not found' })
  findOne(@Param('id') id: number): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new inventory record' })
  @ApiResponse({ status: 201, description: 'Inventory created', type: Inventory })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<Inventory> {
    return this.inventoryService.create(createInventoryDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update an inventory record by ID' })
  @ApiResponse({ status: 200, description: 'Inventory updated', type: Inventory })
  @ApiResponse({ status: 404, description: 'Inventory not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete an inventory record by ID' })
  @ApiResponse({ status: 200, description: 'Inventory deleted successfully' })
  @ApiResponse({ status: 404, description: 'Inventory not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.inventoryService.remove(id);
    return { message: `Inventory with ID ${id} has been successfully deleted` };
  }
}