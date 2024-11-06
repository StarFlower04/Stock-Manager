// src/sales/update-sale.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiProperty({
    description: 'Sale cost',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  sale_cost?: number;

  @ApiProperty({
    description: 'Sale status',
    example: 'Pending',
  })
  @IsOptional()
  @IsString()
  status?: string; 
}