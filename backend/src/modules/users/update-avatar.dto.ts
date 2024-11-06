import { ApiProperty } from '@nestjs/swagger';

// If using a DTO for the avatar upload
export class UpdateAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: any;
}