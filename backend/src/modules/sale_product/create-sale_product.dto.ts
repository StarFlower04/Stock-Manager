// src/sale-product/create-sale-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSaleProductDto {
  @ApiProperty({
    description: 'ID of the sale',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  sale_id: number;

  @ApiProperty({
    description: 'ID of the product',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    description: 'Quantity of the product sold',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}