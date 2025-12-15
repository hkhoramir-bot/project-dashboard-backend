// src/auth/auth.module.ts (اصلاح شده)

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy'; // ✅ ایمپورت کردن استراتژی

@Module({
  imports: [
    JwtModule.register({
      // ⚠️ بهترین روش: استفاده از process.env.JWT_SECRET یا ConfigService
      secret: process.env.JWT_SECRET || 'SECRET_KEY_خیلی_امن', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy, // ✅ مهم‌ترین اصلاح: اضافه کردن استراتژی به Providers
  ],
  controllers: [AuthController],
  // ✅ قابلیت‌های احراز هویت (AuthService و JwtModule) را Export می‌کنیم
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}