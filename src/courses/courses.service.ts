import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) {}

  findAll() {
    return this.courseRepository.find({
      relations: ['tags']
    });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({ where: { id: parseInt(id, 10) }, relations: ['tags'] });

    if (!course) {
      throw new NotFoundException(`Course id ${id} not found`)
    }

    return course;
  }

  async create(createCourseDto: any) {
    const tags = await Promise.all(
      createCourseDto.tags.map((name: string) => this.preloadTagByName(name)),
    );

    const course = this.courseRepository.create({
      ...createCourseDto,
      tags
    });
    return this.courseRepository.save(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {

    const tags = updateCourseDto.tags && (
      await Promise.all(updateCourseDto.tags.map(name => this.preloadTagByName(name)))
    );

    const course = await this.courseRepository.preload({
      id: Number(id),
      ...updateCourseDto,
      tags,
    });

    if (!course) {
      throw new NotFoundException(`Course id ${id} not found`)
    }

    return this.courseRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!course) {
      throw new NotFoundException(`Course id ${id} not found`)
    }

    return this.courseRepository.remove(course)
  }

  private async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { name: name } });

    if (tag) {
      return tag;
    }

    return this.tagRepository.create({ name });
  }
}
