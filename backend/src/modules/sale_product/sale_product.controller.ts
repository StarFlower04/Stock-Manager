// src/sale-product/sale-product.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SaleProductService } from './sale_product.service';
import { SaleProduct } from './sale_product.entity';
import { CreateSaleProductDto } from './create-sale_product.dto';
import { UpdateSaleProductDto } from './update-sale_product.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('sale-products')
@Controller('sale-products')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class SaleProductController {
  constructor(private readonly saleProductService: SaleProductService) {}

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all sale products' })
  @ApiResponse({ status: 200, description: 'List of sale products', type: [SaleProduct] })
  findAll(): Promise<SaleProduct[]> {
    return this.saleProductService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get a sale product by ID' })
  @ApiResponse({ status: 200, description: 'Sale product details', type: SaleProduct })
  @ApiResponse({ status: 404, description: 'Sale product not found' })
  findOne(@Param('id') id: number): Promise<SaleProduct> {
    return this.saleProductService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new sale product' })
  @ApiResponse({ status: 201, description: 'Sale product created', type: SaleProduct })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(@Body() createSaleProductDto: CreateSaleProductDto): Promise<SaleProduct> {
    return this.saleProductService.create(createSaleProductDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Update a sale product by ID' })
  @ApiResponse({ status: 200, description: 'Sale product updated', type: SaleProduct })
  @ApiResponse({ status: 404, description: 'Sale product not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async update(
    @Param('id') id: number,
    @Body() updateSaleProductDto: UpdateSaleProductDto,
  ): Promise<SaleProduct> {
    return this.saleProductService.update(id, updateSaleProductDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete a sale product by ID' })
  @ApiResponse({ status: 200, description: 'Sale product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Sale product not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.saleProductService.remove(id);
    return { message: `SaleProduct with ID ${id} has been successfully deleted` };
  }
}