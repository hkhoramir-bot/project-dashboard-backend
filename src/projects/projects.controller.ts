// src/projects/projects.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProjectsService } from './projects.service';
import type { Project } from './projects.service'; // ⚡️ فقط type
import { CreateProjectDto } from './dto/create-project.dto';

// نوع کاربر لاگین شده
interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // GET: لیست پروژه‌ها
  @Get()
  @Roles('ADMIN', 'MANAGER', 'USER')
  findAll(@Req() req: { user: AuthUser }): Project[] {
    return this.projectsService.findAll(req.user);
  }

  // POST: ایجاد پروژه
  @Post()
  @Roles('ADMIN', 'MANAGER')
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: { user: AuthUser }): Project {
    return this.projectsService.create(createProjectDto, req.user);
  }
}
