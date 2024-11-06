// src/sales/create-sale.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({
    description: 'Sale cost',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  sale_cost: number;

  @ApiProperty({
    description: 'Sale status',
    example: 'Pending',
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}