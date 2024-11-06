// src/users/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john_doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Role ID of the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsString()
  role_id: number;
}