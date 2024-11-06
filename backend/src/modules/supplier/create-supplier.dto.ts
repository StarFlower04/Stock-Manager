import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'First name of the supplier',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Last name of the supplier',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'Email of the supplier',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Phone number of the supplier',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone_number: string;
}