// src/rfid-readings/rfid-reading.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadingService } from './reading.service';
import { RfidReading } from './reading.entity';
import { CreateRfidReadingDto } from './create-reading.dto';
import { UpdateRfidReadingDto } from './update-reading.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('rfid-readings')
@Controller('rfid-readings')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class RfidReadingController {
  constructor(private readonly rfidReadingService: ReadingService) {}

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all RFID readings' })
  @ApiResponse({ status: 200, description: 'List of RFID readings', type: [RfidReading] })
  findAll(): Promise<RfidReading[]> {
    return this.rfidReadingService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get RFID reading by ID' })
  @ApiResponse({ status: 200, description: 'RFID reading details', type: RfidReading })
  @ApiResponse({ status: 404, description: 'RFID reading not found' })
  findOne(@Param('id') id: number): Promise<RfidReading> {
    return this.rfidReadingService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new RFID reading' })
  @ApiResponse({ status: 201, description: 'RFID reading created', type: RfidReading })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Body() createRfidReadingDto: CreateRfidReadingDto,
  ): Promise<RfidReading> {
    return this.rfidReadingService.create(createRfidReadingDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update an RFID reading by ID' })
  @ApiResponse({ status: 200, description: 'RFID reading updated', type: RfidReading })
  @ApiResponse({ status: 404, description: 'RFID reading not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateRfidReadingDto: UpdateRfidReadingDto,
  ): Promise<RfidReading> {
    return this.rfidReadingService.update(id, updateRfidReadingDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete an RFID reading by ID' })
  @ApiResponse({ status: 200, description: 'RFID reading deleted successfully' })
  @ApiResponse({ status: 404, description: 'RFID reading not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.rfidReadingService.remove(id);
    return { message: `RFID reading with ID ${id} has been successfully deleted` };
  }
}