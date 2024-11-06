// src/products/product.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { WarehouseProductService } from './warehouse_products.service';
import { Product } from 'src/modules/products/product.entity';
import { UpdateWarehouseProductDto } from './update-warehouse-product.dto';
import { CreateWarehouseProductDto } from './create-wrehouse-product.dto';

@ApiTags('user-inventory')
@Controller('user-inventory')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class WarehouseProductController {
  constructor(private readonly productService: WarehouseProductService) {}

  @Get('products')
  @Roles('User', 'Warehouse Manager', 'Administrator')
  @ApiOperation({ summary: 'Get products by logged-in user\'s warehouse' })
  @ApiResponse({ status: 200, description: 'List of products', type: [Product] })
  @ApiResponse({ status: 401, description: 'User not authenticated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProductsByUser(@Req() req: any): Promise<Product[]> {
    const userId = req.user.id; // Assuming req.user contains the authenticated user
    return this.productService.findProductsByUserId(userId);
  }

  @Put('products/edit/:id')
  @Roles('Administrator', 'Warehouse Manager')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id') productId: number,
    @Body() updateProductDto: UpdateWarehouseProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(productId, updateProductDto);
  }

  @Get('products/:id')
  @Roles('Warehouse Manager', 'Administrator')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(
    @Param('id') productId: number
  ): Promise<Product> {
    return this.productService.findProductById(productId);
  }  

  @Post('products/add')
  @Roles('Administrator', 'Warehouse Manager')
  @ApiOperation({ summary: 'Add a new product to the warehouse' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async addProduct(
    @Req() req: any,
    @Body() createProductDto: CreateWarehouseProductDto,
  ): Promise<Product> {
    const userId = req.user.id; // Assuming req.user contains the authenticated user
    return this.productService.addProductToWarehouse(userId, createProductDto);
  }

  @Delete('products/delete/:id')
  @Roles('Administrator', 'Warehouse Manager')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') productId: number): Promise<void> {
    return this.productService.deleteProduct(productId);
  }
}