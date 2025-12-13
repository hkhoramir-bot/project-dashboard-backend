import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {

  @Get()
  @Roles('ADMIN', 'MANAGER') // فقط مدیر و ادمین می‌تونن ببینن
  findAll() {
    return [{ id: 1, title: 'پروژه نمونه' }];
  }
}
