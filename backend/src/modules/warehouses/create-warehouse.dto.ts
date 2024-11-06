import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'Location of the warehouse',
    example: 'New York',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'User ID associated with the warehouse',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}