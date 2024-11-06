// src/iot/update-iot.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateIotDto } from './create-iot.dto';
import { IsOptional, IsInt } from 'class-validator';

export class UpdateIotDto extends PartialType(CreateIotDto) {
  @ApiProperty({
    description: 'Token of the IoT device',
    example: 'abc123tokenexample',
  })
  @IsOptional()
  token?: string;

  @ApiProperty({
    description: 'ID of the warehouse where the IoT device is located',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  warehouse_id?: number; // Змінили поле location на warehouse_id
}