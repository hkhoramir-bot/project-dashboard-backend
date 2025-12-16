// src/auth/auth.module.ts (اصلاح شده برای عیب‌یابی خطای 401)

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

// ⚠️ تعریف کلید ثابت موقت (باید با کلید ثابت در jwt.strategy.ts یکسان باشد)
const TEMP_SECRET_KEY = 'YOUR_SUPER_DUPER_TEST_SECRET_401_FIX'; 

@Module({
    imports: [
        JwtModule.register({
            // ✅ اصلاح: استفاده از کلید ثابت برای صدور توکن (برای تست)
            secret: TEMP_SECRET_KEY, 
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthService, JwtModule], 
})
export class AuthModule {}