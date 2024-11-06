import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './create-tag.dto';
import { UpdateTagDto } from './update-tag.dto';
import { Product } from '../products/product.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({ relations: ['product'] });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { tag_id: id }, relations: ['product'] });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const product = await this.productRepository.findOne({ where: { product_id: createTagDto.product_id } });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const rfidCode = this.generateCustomRFIDCode();

      const tag = this.tagRepository.create({
        tag_id: createTagDto.product_id, 
        product,
        rfid_code: rfidCode, 
      });

      return await this.tagRepository.save(tag);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw new InternalServerErrorException('Error creating tag');
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { tag_id: id },
      relations: ['product'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    if (updateTagDto.product_id) {
      const product = await this.productRepository.findOne({ where: { product_id: updateTagDto.product_id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      tag.product = product;
    }

    Object.assign(tag, updateTagDto);
    return await this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tagRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }

  private generateCustomRFIDCode(): string {
    const randomString = randomBytes(5).toString('hex').toUpperCase();
    return `RFID-${randomString}`;
  }
}