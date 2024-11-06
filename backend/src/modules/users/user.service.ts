import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/role.entity';
import { UserProfileDto } from './user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>, 
  ) {}

  async findAll(): Promise<UserProfileDto[]> {
    const users = await this.userRepository.find({ relations: ['role'] });
    return users.map(user => this.toUserProfileDto(user));
  }

  async findOne(id: number): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({ where: { user_id: id }, relations: ['role'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toUserProfileDto(user);
  }

  private toUserProfileDto(user: User): UserProfileDto {
    return {
      user_name: user.user_name,
      email: user.email,
      created_at: user.created_at.toISOString(), 
      role: {
        role_name: user.role.role_name,
      },
      avatar: user.avatar,  
    };
  }

  async updateAvatar(userId: number, avatarPath: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.avatar = avatarPath;
    return await this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: id }, relations: ['role'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.role_id) {
      const role = await this.roleRepository.findOne({ where: { role_id: updateUserDto.role_id } });
      if (!role) {
        throw new NotFoundException(`Role with ID ${updateUserDto.role_id} not found`);
      }
      user.role = role;
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}