// src/warehouses/update-warehouse.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateWarehouseDto } from './create-warehouse.dto';

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @ApiProperty({
    description: 'Location of the warehouse',
    example: 'Los Angeles',
  })
  @IsString()
  @IsNotEmpty()
  location?: string;

  @ApiProperty({
    description: 'User ID associated with the warehouse',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id?: number;
}