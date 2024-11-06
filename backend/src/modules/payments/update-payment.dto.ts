import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({ description: 'Payment amount', example: 100.00 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: 'Payment status', example: 'completed' })
  @IsOptional()
  @IsString()
  status?: string;
}