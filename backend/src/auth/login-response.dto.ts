// src/auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Message indicating the login was successful',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'JWT token for the authenticated user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}