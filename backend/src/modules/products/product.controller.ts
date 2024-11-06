// src/products/product.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ProductDto } from './product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadProductImageDto } from './upload-product-image.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('details')
  @ApiOperation({ summary: 'Get all products with details' })
  @ApiResponse({ status: 200, description: 'Success', type: [ProductDto] })
  async findAllWithDetails(): Promise<ProductDto[]> {
    return this.productService.findAllWithDetails();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products', type: [Product] })
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('one/:id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product details', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post(':id/upload')
  @Roles('Administrator', 'Warehouse Manager')
  @ApiOperation({ summary: 'Upload product image' })
  @ApiResponse({ status: 201, description: 'Product image uploaded' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadProductImageDto })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/products', // Destination folder for the images
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`); // Create unique file name
      },
    }),
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB file size limit
  }))
  async uploadFile(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.productService.uploadImage(file, id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created', type: Product })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.productService.remove(id);
    return { message: `Product with ID ${id} has been successfully deleted` };
  }
}