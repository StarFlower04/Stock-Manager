import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'ID of the product',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    description: 'RFID code of the tag',
    example: '123456789ABCDEF',
  })
  @IsNotEmpty()
  @IsString()
  rfid_code: string;

  @ApiProperty({
    description: 'ID of the tag',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  tag_id: number;
}