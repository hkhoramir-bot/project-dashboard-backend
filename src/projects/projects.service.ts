import { Injectable, NotFoundException } from '@nestjs/common';

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  tasks: any[];
}

@Injectable()
export class ProjectsService {
  private projects: Project[] = [];
  private idCounter = 1;

  findAll() {
    return this.projects;
  }

  findOne(id: number) {
    const project = this.projects.find(p => p.id === id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  create(data: any) {
    const project: Project = {
      id: this.idCounter++,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'To Do',
      tasks: [],
    };

    this.projects.push(project);
    return project;
  }
}
