// src/sale-product/update-sale-product.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { CreateSaleProductDto } from './create-sale_product.dto';

export class UpdateSaleProductDto extends PartialType(CreateSaleProductDto) {
  @ApiProperty({
    description: 'ID of the sale',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  sale_id?: number;

  @ApiProperty({
    description: 'ID of the product',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiProperty({
    description: 'Quantity of the product sold',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
