import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSupplierDto {
  @ApiProperty({
    description: 'First name of the supplier',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  first_name?: string;

  @ApiProperty({
    description: 'Last name of the supplier',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @ApiProperty({
    description: 'Email of the supplier',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description: 'Phone number of the supplier',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone_number?: string;
}