// src/roles/create-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
  })
  @IsNotEmpty()
  @IsString()
  role_name: string;
}