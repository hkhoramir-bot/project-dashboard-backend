// src/projects/projects.controller.ts (اصلاح شده)

import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
// 💡 سرویس و DTOها باید ایمپورت شوند
import { ProjectsService } from './projects.service'; 
import { CreateProjectDto } from './dto/create-project.dto'; 

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
    
    // 💡 ProjectsService باید Inject شود
    constructor(private readonly projectsService: ProjectsService) {}

    // ۱. متد گرفتن لیست پروژه‌ها (GET):
    @Get()
    @Roles('ADMIN', 'MANAGER', 'USER') // 💡 نقش USER را برای دیدن پروژه‌های خودش اضافه می‌کنیم
    findAll(@Req() req) { // 💡 دریافت اطلاعات کاربر لاگین شده
        // ✅ متد findAll سرویس فراخوانی می‌شود، نه داده‌های موک
        // ⚠️ با توجه به نقش‌های تعریف شده، احتمالاً باید فقط پروژه‌های مرتبط با کاربر را برگرداند.
        return this.projectsService.findAll(req.user); 
    }

    // ۲. متد ایجاد پروژه (POST): (رفع خطای 404)
    @Post()
    @Roles('ADMIN', 'MANAGER') // فقط ادمین یا مدیر اجازه ایجاد دارند
    create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
        // ✅ متد create سرویس فراخوانی می‌شود
        return this.projectsService.create(createProjectDto, req.user);
    }
}