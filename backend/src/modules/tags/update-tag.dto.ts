import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiProperty({
    description: 'ID of the product',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiProperty({
    description: 'RFID code of the tag',
    example: '123456789ABCDEF',
  })
  @IsOptional()
  @IsString()
  rfid_code?: string;
}