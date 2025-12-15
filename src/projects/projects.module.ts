// src/projects/projects.module.ts (اصلاح شده)

import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthModule } from '../auth/auth.module'; // ✅ ایمپورت کردن AuthModule
import { PassportModule } from '@nestjs/passport'; // ✅ PassportModule نیز باید ایمپورت شود

@Module({
  imports: [
    AuthModule, // 💡 این امر به ما اجازه می‌دهد از JwtModule و Passport در اینجا استفاده کنیم
    PassportModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}