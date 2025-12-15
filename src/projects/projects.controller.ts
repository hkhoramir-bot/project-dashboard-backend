// src/projects/projects.controller.ts

import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProjectsService } from './projects.service'; 
import { CreateProjectDto } from './dto/create-project.dto'; 

@Controller('api/v1/projects') // ✅ مسیر استاندارد REST API
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
    
    constructor(private readonly projectsService: ProjectsService) {}

    // GET: لیست پروژه‌ها (با نقش USER)
    @Get()
    @Roles('ADMIN', 'MANAGER', 'USER')
    findAll(@Req() req) {
        return this.projectsService.findAll(req.user); 
    }

    // POST: ایجاد پروژه (فقط ADMIN و MANAGER)
    @Post()
    @Roles('ADMIN', 'MANAGER')
    create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
        return this.projectsService.create(createProjectDto, req.user);
    }
}
