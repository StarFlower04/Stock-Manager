// src/rfid-readings/update-rfid-reading.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { CreateRfidReadingDto } from './create-reading.dto';

export class UpdateRfidReadingDto extends PartialType(CreateRfidReadingDto) {
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
    description: 'ID of the tag',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  tag_id?: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}