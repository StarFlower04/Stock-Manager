// src/roles/role.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { CreateRoleDto } from './create-role.dto';
import { UpdateRoleDto } from './update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('roles')
@Controller('roles')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles', type: [Role] })
  findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role details', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id') id: number): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created', type: Role })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiResponse({ status: 200, description: 'Role updated', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.roleService.remove(id);
    return { message: `Role with ID ${id} has been successfully deleted` };
  }
}