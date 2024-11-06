import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShoppingCartDto {
  @ApiProperty({
    description: 'ID of the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'ID of the product',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    description: 'Amount of the product',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}