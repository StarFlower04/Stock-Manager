// src/orders/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Date of the order',
    example: '2024-07-17',
  })
  @IsNotEmpty()
  @IsDateString()
  order_date: Date;

  @ApiProperty({
    description: 'ID of the supplier',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  supplier_id: number;

  @ApiProperty({
    description: 'ID of the warehouse',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  warehouse_id: number;
}