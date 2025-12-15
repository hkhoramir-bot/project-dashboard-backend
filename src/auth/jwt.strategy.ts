// src/auth/jwt.strategy.ts (اصلاح شده)

import prisma from '../prismaClient';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

// 💡 استفاده از 'jwt' به عنوان نام استراتژی برای Passport
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
    
  constructor() {
    // ⚠️ اگر از ConfigService استفاده می‌کنید، آن را به constructor اضافه کنید
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ✅ استفاده از متغیر محیطی برای کلید سری، اگر وجود نداشت از مقدار پیش‌فرض استفاده کن
      secretOrKey: process.env.JWT_SECRET || 'YOUR_SECRET_KEY', 
    });
  }

  async validate(payload: any) {
    // payload حاوی داده‌هایی است که در JwtService امضا شده‌اند.
    
    // ۱. جستجوی کاربر در دیتابیس
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    
    if (!user) {
        // اگر کاربر پیدا نشد یا حذف شده بود
        throw new UnauthorizedException();
    }
    
    // ۲. پاسپورت این شیء را به req.user اختصاص می‌دهد
    return user; 
  }
}