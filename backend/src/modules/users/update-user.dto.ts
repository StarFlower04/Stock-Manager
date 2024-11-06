// src/users/update-user.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  @IsOptional()
  @IsString()
  user_name?: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john_doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Avatar of the user',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Role ID of the user',
    example: 1,
  })
  @IsOptional()
  @IsString()
  role_id?: number;
}