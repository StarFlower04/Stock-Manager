import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Supplier } from './supplier.entity';
import { UpdateSupplierDto } from './update-supplier.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSupplierDto } from './create-supplier.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('suppliers')
@Controller('suppliers')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get('get-all-suppliers')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({ status: 200, description: 'List of suppliers', type: [Supplier] })
  findAll(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get a supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier details', type: Supplier })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  findOne(@Param('id') id: number): Promise<Supplier> {
    return this.supplierService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: 201, description: 'Supplier created', type: Supplier })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.create(createSupplierDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier updated', type: Supplier })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete a supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier deleted successfully' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.supplierService.remove(id);
    return { message: `Supplier with ID ${id} has been successfully deleted` };
  }
}