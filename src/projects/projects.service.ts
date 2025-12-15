import { Injectable, NotFoundException } from '@nestjs/common';

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  tasks: Task[];
  ownerId: string; // ⚡️ برای فیلتر کردن بر اساس کاربر
}

interface Task {
  id: number;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}

@Injectable()
export class ProjectsService {
  private projects: Project[] = [];
  private idCounter = 1;
  private taskIdCounter = 1;

  // GET: همه پروژه‌ها یا پروژه‌های کاربر عادی
  findAll(user: AuthUser) {
    if (user.role === 'USER') {
      return this.projects.filter(p => p.ownerId === user.id);
    }
    return this.projects;
  }

  // GET: یک پروژه بر اساس id
  findOne(id: number) {
    const project = this.projects.find(p => p.id === id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  // POST: ایجاد پروژه جدید
  create(data: any, user: AuthUser) {
    const project: Project = {
      id: this.idCounter++,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'To Do',
      tasks: [],
      ownerId: user.id, // 🔑 اختصاص مالک
    };

    this.projects.push(project);
    return project;
  }

  // ⚡️ اختیاری: افزودن تسک به پروژه
  addTask(projectId: number, title: string, status: Task['status'] = 'To Do') {
    const project = this.findOne(projectId);
    const task: Task = {
      id: this.taskIdCounter++,
      title,
      status,
    };
    project.tasks.push(task);
    return task;
  }
}
