import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/create-user.dto';
import { Role } from 'src/modules/roles/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const userRole = await this.roleRepository.findOne({ where: { role_name: 'User' } }); 
      if (!userRole) {
        throw new NotFoundException('User role not found');
      }
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role: userRole, 
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exists');
      }
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Error creating user');
    }
  }  

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['role'] });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findOneByUsername(user_name: string): Promise<User> {
    return this.userRepository.findOne({
      where: { user_name },
      relations: ['role'],
    });
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}