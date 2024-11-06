// src/iot/create-iot-reading.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateIotReadingDto {
  @ApiProperty({
    description: 'RFID code',
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  rfidCode: string;
}