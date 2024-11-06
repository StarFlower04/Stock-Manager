// src/warehouse-products/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateWarehouseProductDto {
  @ApiProperty({ description: 'Name of the product' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the product', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Minimum quantity of the product', required: false })
  @IsOptional()
  @IsNumber()
  min_quantity?: number;

  @ApiProperty({ description: 'Price of the product', required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ description: 'First name of the supplier' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Last name of the supplier' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'Email of the supplier' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Phone number of the supplier', required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;
}