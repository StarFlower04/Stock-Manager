// src/auth/auth.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/user.entity';
import { CreateUserDto } from 'src/modules/users/create-user.dto';
import { LoginResponseDto } from 'src/auth/login-response.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post('registerUser')
  @ApiOperation({ summary: 'Register new account' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.authService.createUser(createUserDto);
  }
  
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { user_name, password } = loginUserDto; 
    const user = await this.authService.findOneByUsername(user_name);
  
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
  
    if (!passwordValid) {
      throw new BadRequestException('Password does not match');
    }

    const jwt = await this.jwtService.signAsync({ id: user.user_id, role: user.role.role_name });

    return {
     message: 'Login successful',
      token: jwt,
    };
  }
}