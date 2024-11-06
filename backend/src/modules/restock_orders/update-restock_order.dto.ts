// src/restock-orders/update-restock-order.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRestockOrderDto } from './create-restock_order.dto'; 
import { IsOptional, IsDateString, IsNumber, IsString } from 'class-validator';

export class UpdateRestockOrderDto extends PartialType(CreateRestockOrderDto) {
  @ApiProperty({
    description: 'ID of the product',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiProperty({
    description: 'ID of the warehouse',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  warehouse_id?: number;

  @ApiProperty({
    description: 'Quantity of the order',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  order_quantity?: number;

  @ApiProperty({
    description: 'Date of the order',
    example: '2024-07-17',
  })
  @IsOptional()
  @IsDateString()
  order_date?: Date;

  @ApiProperty({
    description: 'Status of the order',
    example: 'pending',
  })
  @IsOptional()
  @IsString()
  status?: string;
}