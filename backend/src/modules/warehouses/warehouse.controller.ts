// src/warehouses/warehouse.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.entity';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { UpdateWarehouseDto } from './update-warehouse.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('warehouses')
@Controller('warehouses')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiResponse({ status: 200, description: 'List of warehouses', type: [Warehouse] })
  findAll(): Promise<Warehouse[]> {
    return this.warehouseService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get a warehouse by ID' })
  @ApiResponse({ status: 200, description: 'Warehouse details', type: Warehouse })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  findOne(@Param('id') id: number): Promise<Warehouse> {
    return this.warehouseService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created', type: Warehouse })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createWarehouseDto: CreateWarehouseDto,
  ): Promise<Warehouse> {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a warehouse by ID' })
  @ApiResponse({ status: 200, description: 'Warehouse updated', type: Warehouse })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a warehouse by ID' })
  @ApiResponse({ status: 200, description: 'Warehouse deleted successfully' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    return this.warehouseService.remove(id);
  }
}