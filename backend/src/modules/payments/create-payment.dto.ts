import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Payment amount', example: 100.00 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Payment status', example: 'completed' })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({ description: 'Payment method', example: 'credit_card' })
  @IsNotEmpty()
  @IsString()
  payment_method: string;

  @ApiProperty({ description: 'Card number', example: '4111111111111111' })
  @IsNotEmpty()
  @IsString()
  card_number: string;

  @ApiProperty({ description: 'Card expiry date', example: '12/2025' })
  @IsNotEmpty()
  @IsString()
  card_expiry: string;

  @ApiProperty({ description: 'Card CVV', example: '123' })
  @IsNotEmpty()
  @IsString()
  card_cvv: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  last_name: string;
}