// src/users/user.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, BadRequestException, UseGuards, Req, UnauthorizedException, UploadedFile, UseInterceptors, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger'; 
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserProfileDto } from './user-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { unlink } from 'fs';

@ApiTags('users')
@Controller('users')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  @Get('profile')
  @Roles('Administrator', 'User', 'Warehouse Manager', 'Sales Manager')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile data', type: UserProfileDto })
  async getProfile(@Req() req: any): Promise<UserProfileDto> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;
    const user = await this.userService.findOne(userId);
  
    return {
      user_name: user.user_name,
      email: user.email,
      created_at: user.created_at.toString(), 
      role: {
        role_name: user.role.role_name,
      },
      avatar: user.avatar, 
    };
  }    

  @Put('profile/avatar')
  @Roles('Administrator', 'User', 'Warehouse Manager', 'Sales Manager')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user avatar' })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
  @ApiResponse({ status: 401, description: 'User not authenticated' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const filename: string = uuidv4() + extname(file.originalname);
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async updateAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<User> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
  
    const userId = req.user.id;
    const filePath = `/uploads/avatars/${file.filename}`;
  
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (user.avatar) {
      const oldAvatarPath = join(process.cwd(), 'uploads/avatars', user.avatar.split('/uploads/avatars/')[1]);
      try {
        unlink(oldAvatarPath, (err) => {
          if (err) {
            console.error('Failed to delete old avatar file', err);
          }
        });
      } catch (error) {
        console.error('Error deleting old avatar file', error);
      }
    }
  
    return await this.userService.updateAvatar(userId, filePath);
  }

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserProfileDto] })
  findAll(): Promise<UserProfileDto[]> {
    return this.userService.findAll();
  }
  
  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: UserProfileDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: number): Promise<UserProfileDto> {
    return this.userService.findOne(id);
  }  

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: `User with ID ${id} has been successfully deleted` };
  }
}