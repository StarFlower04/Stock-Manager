// src/sales/sale.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { SaleService } from './sale.service';
import { Sale } from './sale.entity';
import { CreateSaleDto } from './create-sale.dto';
import { UpdateSaleDto } from './update-sale.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from '../users/user.entity';

@ApiTags('sales')
@Controller('sales')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get('user/purchases')
  @Roles('Administrator', 'User', 'Warehouse Manager', 'Sales Manager')
  @ApiOperation({ summary: 'Get purchases of the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of purchases with products and total cost', type: [Sale] })
  @ApiResponse({ status: 404, description: 'User has no purchases' })
  async findPurchasesByUser(@Req() req: Request): Promise<Sale[]> {
    const user = req['user'] as User;
    return this.saleService.findSalesByUser(user);
}

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({ status: 200, description: 'List of sales', type: [Sale] })
  findAll(): Promise<Sale[]> {
    return this.saleService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale details', type: Sale })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  findOne(@Param('id') id: number): Promise<Sale> {
    return this.saleService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ status: 201, description: 'Sale created', type: Sale })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createSaleDto: CreateSaleDto,
  ): Promise<Sale> {
    return this.saleService.create(createSaleDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale updated', type: Sale })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateSaleDto: UpdateSaleDto,
  ): Promise<Sale> {
    return this.saleService.update(id, updateSaleDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale deleted successfully' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.saleService.remove(id);
    return { message: `Sale with ID ${id} has been successfully deleted` };
  }
}