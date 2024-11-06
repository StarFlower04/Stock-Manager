// src/iot/create-iot.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateIotDto {
  @ApiProperty({
    description: 'Token of the IoT device',
    example: 'abc123tokenexample',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'ID of the warehouse where the IoT device is located',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  warehouse_id: number; // Змінили поле location на warehouse_id
}