// src/orders/update-order.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    description: 'Date of the order',
    example: '2024-07-17',
  })
  @IsOptional()
  @IsDateString()
  order_date?: Date;

  @ApiProperty({
    description: 'ID of the supplier',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  supplier_id?: number;

  @ApiProperty({
    description: 'ID of the warehouse',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  warehouse_id?: number;
}