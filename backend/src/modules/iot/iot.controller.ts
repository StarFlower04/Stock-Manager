// src/iot/iot.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards, Query } from '@nestjs/common';
import { IotService } from './iot.service';
import { Iot } from './iot.entity';
import { CreateIotDto } from './create-iot.dto';
import { UpdateIotDto } from './update-iot.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { RfidReading } from '../rfid_readings/reading.entity';
import { CreateIotReadingDto } from './create-iot-reading.dto';

@ApiTags('iot')
@Controller('iot')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Post('increase/:iotId')
  @ApiOperation({ summary: 'Increase inventory quantity by 1' })
  @ApiResponse({ status: 201, description: 'RFID reading recorded and inventory increased', type: RfidReading })
  @ApiResponse({ status: 404, description: 'Tag, IoT device, or product in warehouse not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async increase(
    @Param('iotId') iotId: number,
    @Query('token') token: string,
    @Query('rfid') rfidCode: string,
  ): Promise<RfidReading> {
    return this.iotService.increase(iotId, token, rfidCode);
  }
  
  @Post('decrease/:iotId')
  @ApiOperation({ summary: 'Decrease inventory quantity by 1' })
  @ApiResponse({ status: 201, description: 'RFID reading recorded and inventory decreased', type: RfidReading })
  @ApiResponse({ status: 404, description: 'Tag, IoT device, or product in warehouse not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async decrease(
    @Param('iotId') iotId: number,
    @Query('token') token: string,
    @Query('rfid') rfidCode: string,
  ): Promise<RfidReading> {
    return this.iotService.decrease(iotId, token, rfidCode);
  }  


  // @Post('record/:iotId')
  // @ApiOperation({ summary: 'Record an RFID reading' })
  // @ApiResponse({ status: 201, description: 'RFID reading recorded', type: RfidReading })
  // @ApiResponse({ status: 404, description: 'Tag or IoT device not found' })
  // @ApiResponse({ status: 500, description: 'Internal server error' })
  // async recordReading(
  //   @Param('iotId') iotId: number,
  //   @Body() CreateIotReadingDto: CreateIotReadingDto,
  // ): Promise<RfidReading> {
  //   return this.iotService.recordReading(CreateIotReadingDto.rfidCode, iotId);
  // }

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all IoT devices' })
  @ApiResponse({ status: 200, description: 'List of IoT devices', type: [Iot] })
  findAll(): Promise<Iot[]> {
    return this.iotService.findAll();
  }

  @Get('get/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get IoT device by ID' })
  @ApiResponse({ status: 200, description: 'IoT device details', type: Iot })
  @ApiResponse({ status: 404, description: 'IoT device not found' })
  findOne(@Param('id') id: number): Promise<Iot> {
    return this.iotService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new IoT device' })
  @ApiResponse({ 
    status: 201, 
    description: 'IoT device created', 
    schema: {
      example: {
        id: 1,
        iot: {
          iot_id: 1,
          token: 'abc123token-1692876241000',
          location: 'Aisle 3',
          warehouse: { warehouse_id: 1 }, // включити необхідні деталі складу
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  create(@Body() createIotDto: CreateIotDto): Promise<{ id: number; iot: Iot }> {
    return this.iotService.create(createIotDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update an IoT device by ID' })
  @ApiResponse({ status: 200, description: 'IoT device updated', type: Iot })
  @ApiResponse({ status: 404, description: 'IoT device not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(@Param('id') id: number, @Body() updateIotDto: UpdateIotDto): Promise<Iot> {
    return this.iotService.update(id, updateIotDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete an IoT device by ID' })
  @ApiResponse({ status: 200, description: 'IoT device deleted successfully' })
  @ApiResponse({ status: 404, description: 'IoT device not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.iotService.remove(id);
    return { message: `IoT device with ID ${id} has been successfully deleted` };
  }
}