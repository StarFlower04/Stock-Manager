// src/inventory/update-inventory.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { CreateInventoryDto } from './create-inventiry.dto';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @ApiProperty({
    description: 'Quantity of the product in the warehouse',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}