import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {}

  findAll() {
    return this.courseRepository.find();
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!course) {
      throw new NotFoundException(`Course id ${id} not found`)
    }

    return course;
  }

  create(createCourseDto: any) {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.preload({
      id: Number(id),
      ...updateCourseDto
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
}
