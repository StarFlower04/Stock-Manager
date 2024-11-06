// src/inventory/create-inventory.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    description: 'ID of the product',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    description: 'ID of the warehouse',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  warehouse_id: number;

  @ApiProperty({
    description: 'Quantity of the product in the warehouse',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}