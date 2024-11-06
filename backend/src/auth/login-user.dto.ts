// src/users/update-user.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { CreateUserDto } from 'src/modules/users/create-user.dto';

export class LoginUserDto extends PartialType(CreateUserDto) {
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
}