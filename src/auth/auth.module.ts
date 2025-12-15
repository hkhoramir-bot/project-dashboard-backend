// src/auth/auth.module.ts (بدون تغییر در منطق کلید)

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        JwtModule.register({
            // ⚠️ اکنون، کلید پیش‌فرض با JwtStrategy یکی است.
            secret: process.env.JWT_SECRET || 'SECRET_KEY_خیلی_امن', 
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    controllers: [AuthController],
    // ✅ قابلیت‌های احراز هویت (AuthService و JwtModule) را Export می‌کنیم
    exports: [AuthService, JwtModule], 
})
export class AuthModule {}