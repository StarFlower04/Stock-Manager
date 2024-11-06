import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { CreateTagDto } from './create-tag.dto';
import { UpdateTagDto } from './update-tag.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('tags')
@Controller('tags')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'List of tags', type: [Tag] })
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  @Get('get/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag details', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  findOne(@Param('id') id: number): Promise<Tag> {
    return this.tagService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, description: 'Tag created', type: Tag })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    createTagDto.tag_id = createTagDto.product_id;
    return this.tagService.create(createTagDto);
  }  

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag updated', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.tagService.remove(id);
    return { message: `Tag with ID ${id} has been successfully deleted` };
  }
}