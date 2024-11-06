// src/products/dto/upload-product-image.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadProductImageDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Product image file' })
  @IsNotEmpty()
  file: any;
}