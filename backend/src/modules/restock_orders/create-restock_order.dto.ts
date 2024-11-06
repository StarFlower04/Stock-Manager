// src/restock-orders/create-restock-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString, IsString } from 'class-validator';

export class CreateRestockOrderDto {
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
    description: 'Quantity of the order',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  order_quantity: number;

  @ApiProperty({
    description: 'Date of the order',
    example: '2024-07-17',
  })
  @IsNotEmpty()
  @IsDateString()
  order_date: Date;

  @ApiProperty({
    description: 'Status of the order',
    example: 'pending',
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}