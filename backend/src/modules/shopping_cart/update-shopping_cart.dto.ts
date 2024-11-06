import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateShoppingCartDto } from './create-shopping_cart.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateShoppingCartDto extends PartialType(CreateShoppingCartDto) {
  @ApiProperty({
    description: 'ID of the user',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @ApiProperty({
    description: 'ID of the product',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiProperty({
    description: 'Amount of the product',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;
}