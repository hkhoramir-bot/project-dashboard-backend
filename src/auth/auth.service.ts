// src/auth/auth.service.ts (فایل اصلاح شده)

import prisma from '../prismaClient';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // متد createUser به register تغییر نام یافت
  async register(userData: { name: string; email: string; password: string; role: Role }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        // اگر در اسکیمای Prisma برای role مقدار @default(USER) قرار داده‌اید،
        // می‌توانید این خط را حذف کنید تا اگر کاربر نقش را در ورودی مشخص نکرد، پیش‌فرض اعمال شود.
        role: userData.role, 
      },
    });
    // فیلدهای حساس مانند password نباید برگردانده شوند.
    return { id: user.id, email: user.email, role: user.role };
  }

  // متد validateUser به login تغییر نام یافت و آماده برای استفاده در Local Strategy است
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      // فقط اطلاعات ضروری را برای JWT یا Session برگردانید
      return { id: user.id, email: user.email, role: user.role }; 
    }
    return null;
  }
}