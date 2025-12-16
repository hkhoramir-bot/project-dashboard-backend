// src/auth/jwt.strategy.ts (اصلاح شده برای عیب‌یابی خطای 401)

import prisma from '../prismaClient';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

// ⚠️ کلید موقت برای عیب‌یابی: این کلید باید دقیقا با کلید JwtModule در auth.module.ts یکسان باشد.
// این اصلاح برای اطمینان از نادیده گرفتن خطاهای محیطی (process.env.JWT_SECRET) است.
const TEMP_SECRET_KEY = 'YOUR_SUPER_DUPER_TEST_SECRET_401_FIX'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
    
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // ✅ اصلاح: استفاده از کلید ثابت برای تست اعتبارسنجی
            secretOrKey: TEMP_SECRET_KEY, 
        });
    }

    async validate(payload: any) {
        // ۱. جستجوی کاربر در دیتابیس
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        
        if (!user) {
            throw new UnauthorizedException();
        }
        
        // ۲. پاسپورت این شیء را به req.user اختصاص می‌دهد
        const { password, ...result } = user; 
        return result; 
    }
}