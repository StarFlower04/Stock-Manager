// src/roles/update-role.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
  })
  @IsOptional()
  @IsString()
  role_name?: string;
}