// src/transactions/create-transaction.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Amount of the transaction', example: 100.00 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Status of the transaction', example: 'Completed' })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({ description: 'User ID associated with the transaction', example: 1 })
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @ApiProperty({ description: 'Warehouse ID associated with the transaction', example: 1 })
  @IsOptional()
  @IsNumber()
  warehouse_id?: number;

  @ApiProperty({ description: 'Card number used for the transaction', example: '1234567890123456' })
  @IsOptional()
  @IsString()
  card_number?: string;

  @ApiProperty({ description: 'Card expiry date (MM/YYYY)', example: '12/2024' })
  @IsOptional()
  @IsString()
  card_expiry?: string;

  @ApiProperty({ description: 'Card CVV', example: '123' })
  @IsOptional()
  @IsString()
  card_cvv?: string;

  @ApiProperty({ description: 'First name of the card holder', example: 'John' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ description: 'Last name of the card holder', example: 'Doe' })
  @IsOptional()
  @IsString()
  last_name?: string;
  date: string | number | Date;
}