import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Product B',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Updated description of Product B',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 29.99,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'ID of the supplier',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  supplier_id?: number;

  @ApiProperty({
    description: 'Minimum quantity of the product',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  min_quantity?: number;
}