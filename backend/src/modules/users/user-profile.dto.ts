// src/users/dto/user-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: 'admin', description: 'Ім\'я користувача' })
  user_name: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email користувача' })
  email: string;

  @ApiProperty({ example: '2024-07-13T15:15:08.073Z', description: 'Дата створення' })
  created_at: string;

  @ApiProperty({ description: 'User avatar image in base64 format', type: 'string' })
  avatar?: string; 

  @ApiProperty({ example: { role_id: 1, role_name: 'Administrator' }, description: 'Роль користувача' })
  role: {
    role_name: string;
  };
}