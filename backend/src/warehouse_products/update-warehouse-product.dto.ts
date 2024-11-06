// src/modules/products/dto/update-warehouse-product.dto.ts
import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWarehouseProductDto {
  @ApiPropertyOptional({ description: 'Product name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Minimum quantity' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  min_quantity?: number;

  @ApiPropertyOptional({ description: 'Product price' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'Supplier ID' })
  @IsNumber()
  @IsOptional()
  supplier_id?: number;

  @ApiPropertyOptional({ description: 'Image URL' })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiPropertyOptional({ description: 'Supplier first name' })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional({ description: 'Supplier last name' })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({ description: 'Supplier email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Supplier phone number' })
  @IsString()
  @IsOptional()
  phone_number?: string;
}