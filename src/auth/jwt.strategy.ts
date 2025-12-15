// src/auth/jwt.strategy.ts (اصلاح شده)

import prisma from '../prismaClient';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
    
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // ✅ اصلاح شد: کلید پیش فرض را با کلید AuthModule یکسان می‌کنیم
            secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY_خیلی_امن', 
        });
    }

    async validate(payload: any) {
        // ۱. جستجوی کاربر در دیتابیس
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        
        if (!user) {
            throw new UnauthorizedException();
        }
        
        // ۲. پاسپورت این شیء را به req.user اختصاص می‌دهد
        // 💡 شما ممکن است بخواهید password را اینجا حذف کنید
        const { password, ...result } = user; 
        return result; 
    }
}