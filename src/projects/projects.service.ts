// src/projects/projects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';

// ⚡️ Export interface ها برای استفاده در Controller
export interface Task {
  id: number;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  tasks: Task[];
  ownerId?: string;
}

@Injectable()
export class ProjectsService {
  private projects: Project[] = [];
  private idCounter = 1;

  // GET: همه پروژه‌ها
  findAll(user?: { id: string; role: string }): Project[] {
    // ⚡️ اگر بخوای می‌توانی بر اساس user role فیلتر کنی
    return this.projects;
  }

  // GET: پروژه بر اساس id
  findOne(id: number): Project {
    const project = this.projects.find(p => p.id === id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  // POST: ایجاد پروژه
  create(data: CreateProjectDto, user?: { id: string; role: string }): Project {
    const project: Project = {
      id: this.idCounter++,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'To Do',
      tasks: [],
      ownerId: user?.id,
    };

    this.projects.push(project);
    return project;
  }
}
