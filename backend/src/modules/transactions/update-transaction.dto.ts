// src/transactions/update-transaction.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  transaction_id?: number;

  @ApiProperty({ example: 100.00 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: 'completed' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  warehouse_id?: number;

  @ApiProperty({ example: '1234-5678-9012-3456' })
  @IsOptional()
  @IsString()
  card_number?: string;

  @ApiProperty({ example: '12/24' })
  @IsOptional()
  @IsString()
  card_expiry?: string;

  @ApiProperty({ example: '123' })
  @IsOptional()
  @IsString()
  card_cvv?: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  last_name?: string;
}