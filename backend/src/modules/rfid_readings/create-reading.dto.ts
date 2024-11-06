// src/rfid-readings/create-rfid-reading.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRfidReadingDto {
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
    description: 'ID of the tag',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  tag_id: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}