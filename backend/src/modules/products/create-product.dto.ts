// src/products/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Product A',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A detailed description of Product A',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 19.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'ID of the supplier',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  supplier_id: number;

  @ApiProperty({
    description: 'Minimum quantity of the product',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  min_quantity: number;
}