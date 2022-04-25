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

  findOne(id) {
    const course =  this.courseRepository.findOne(id);

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

  async remove(id) {
    const course = await this.courseRepository.findOne(id);

    if (!course) {
      throw new NotFoundException(`Course id ${id} not found`)
    }

    return this.courseRepository.remove(course)
  }
}
