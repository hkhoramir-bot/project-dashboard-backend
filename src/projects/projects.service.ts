// src/projects/projects.service.ts (نسخه نهایی و بهبود یافته)

import { Injectable, NotFoundException } from '@nestjs/common';
// 💡 DTOها را از فایل مربوطه ایمپورت می‌کنیم
import { CreateProjectDto } from './dto/create-project.dto'; 

// ⚠️ فرض می‌کنیم که Project و Task در یک فایل مدل جداگانه (مثل types/models.ts) تعریف شده‌اند
// برای حفظ ساختار فعلی، فعلاً آن‌ها را در اینجا نگه می‌داریم، اما این روش استاندارد نیست.

export interface Task {
    id: number;
    title: string;
    status: 'To Do' | 'In Progress' | 'Done';
}

// ⚠️ تعریف مجدد Project برای وضوح
export interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'To Do' | 'In Progress' | 'Done';
    tasks: Task[];
    ownerId?: string; // ID کاربری که پروژه را ساخته است
}

@Injectable()
export class ProjectsService {
    private projects: Project[] = [];
    private idCounter = 1;

    // GET: همه پروژه‌ها
    // 💡 الآن پروژه‌ها را بر اساس ownerId فیلتر می‌کنیم
    findAll(user?: { id: string; role: string }): Project[] {
        if (!user) return []; // اگر کاربری نباشد، چیزی برنمی‌گردانیم
        
        // ⚡️ اگر کاربر ادمین یا مدیر است، همه را برگردان
        if (user.role === 'ADMIN' || user.role === 'MANAGER') {
            return this.projects;
        }
        
        // ⚡️ در غیر این صورت، فقط پروژه‌هایی که مالک آن است را برگردان
        return this.projects.filter(p => p.ownerId === user.id);
    }

    // GET: پروژه بر اساس id
    findOne(id: number): Project {
        // ✅ استفاده از Number(id) برای اطمینان از مقایسه صحیح
        const project = this.projects.find(p => p.id === Number(id)); 
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    // POST: ایجاد پروژه
    create(data: CreateProjectDto, user?: { id: string; role: string }): Project {
        if (!user) {
            throw new NotFoundException('User information not available for project creation.');
        }

        const project: Project = {
            id: this.idCounter++,
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            status: 'To Do',
            tasks: [],
            ownerId: user.id, // ✅ ذخیره ID کاربر خالق
        };

        this.projects.push(project);
        return project;
    }
}