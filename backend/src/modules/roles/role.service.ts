// src/roles/role.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './create-role.dto';
import { UpdateRoleDto } from './update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { role_id: id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(role);
    } catch (error) {
      console.error('Error creating role:', error);
      throw new InternalServerErrorException('Error creating role');
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { role_id: id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
}